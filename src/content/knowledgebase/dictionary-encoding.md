---
title: "Dictionary Encoding: How Parquet, Arrow, and Iceberg Tables Compress Repeated Values"
meta_title: "Dictionary Encoding in Parquet and Iceberg Tables | Glossary"
description: "Dictionary encoding stores each distinct value once and replaces repeats with small integer IDs. See how Parquet, Arrow, and Iceberg writers use it and tune it."
---

## What is Dictionary Encoding?

Dictionary encoding is a compression technique that stores each distinct value in a column once, in a dictionary, and replaces every occurrence with a small integer ID that points into that dictionary. A column holding `"United States"` a million times stores the string once and a million small integers.

It works best on **low to moderate cardinality** columns: country codes, status flags, product categories, region names. When nearly every value is unique (UUIDs, free text, timestamps with milliseconds), the dictionary grows as large as the data and stops helping, so writers fall back to plain encoding.

## How It Works in Apache Parquet

In [Apache Parquet](/knowledgebase/apache-parquet/), each column chunk can have one dictionary page, written before its data pages, that holds the distinct values in plain encoding. The data pages then store the IDs using the RLE/bit-packing hybrid encoding, so a column with 200 distinct values needs only 8 bits per row, and long runs of the same ID collapse further through [run-length encoding](/knowledgebase/run-length-encoding/). General compression (Zstandard, Snappy, Gzip) is applied on top.

If the dictionary grows too large, the writer stops adding to it and switches the remaining pages of that column chunk to plain encoding. `RLE_DICTIONARY` is the current encoding for data pages; the older `PLAIN_DICTIONARY` is deprecated.

Dictionaries also speed up reads. A reader can check whether a filter value appears in a row group's dictionary at all and skip the row group if it does not. Apache Iceberg's Java reader has a dictionary-based row group filter that does this alongside min/max statistics.

## Dictionary Encoding Across the Lakehouse Stack

| Layer | Where dictionaries show up | What you can control |
|---|---|---|
| Parquet files | Dictionary page per column chunk, IDs in data pages | Writer settings for dictionary on/off and max dictionary page size |
| Iceberg tables | Iceberg writes Parquet (or ORC, Avro) files and passes settings through table properties | `write.parquet.dict-size-bytes` (default 2 MB) sets the Parquet dictionary page size |
| Apache ORC | Dictionary encoding for string columns, chosen per stripe | Dictionary key size threshold |
| [Apache Arrow](/knowledgebase/apache-arrow/) (in memory) | `DictionaryArray` keeps indices plus a values array | Engines may keep data dictionary-encoded in memory to save RAM and speed up group-bys |
| Query engines | Dremio, Trino, Spark, and DuckDB read dictionary pages and some operate on the encoded IDs directly | Mostly automatic |

## Practical Tuning on Iceberg

* **Check before tuning.** Parquet metadata tools such as `parquet-cli` or PyArrow show which encodings each column chunk uses. If a column you expected to be dictionary-encoded shows plain encoding in later pages, the dictionary overflowed.
* **Raise the dictionary size for wide-but-repetitive columns.** For a column with tens of thousands of distinct values per file, a larger `write.parquet.dict-size-bytes` can keep the whole chunk dictionary-encoded. Larger dictionaries cost writer memory.
* **Sort or cluster data.** Sorting by a low-cardinality column creates long runs of identical IDs, which RLE then compresses well. Iceberg sort orders and compaction with a sort strategy apply this at scale.
* **Leave high-cardinality columns alone.** For IDs and free text, newer encodings such as FSST for strings target the cases dictionaries cannot handle.

For more depth, see [Encoding in Parquet](/blog/2024-10-all-about-parquet-part-06/), [What is Apache Parquet? Columns, Encoding, and Performance](/blog/2026-04-apache-parquet/), and [FSST and ALP: The Two Encodings Fixing Parquet's Weakest Compression Cases](/blog/fsst-alp-parquet-encodings/).

## Frequently Asked Questions

### Is dictionary encoding the same as compression?
It is a lightweight encoding that reduces size based on the data's structure. Parquet then applies a general-purpose codec such as Zstandard on top. The two stack: encoding first, compression second.

### Why does columnar storage make dictionary encoding effective?
A columnar file stores all values of one column together, so repeated values sit next to each other. That makes dictionaries smaller and runs longer than they would be in a row-oriented format.

### Does dictionary encoding affect security or governance?
No. It is a physical storage detail. Access control, masking, and auditing happen in the catalog and engine layers, not in the file encoding.

---

### E-E-A-T & Further Reading
