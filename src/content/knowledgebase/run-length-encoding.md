---
canonical: "https://opendatalakehouse.com/kb/run-length-encoding/"
title: "What is Run-Length Encoding?"
meta_title: "What is Run-Length Encoding? | Expert Data Lakehouse & AI Glossary"
description: "Run-length encoding is a lossless compression method that stores a run of repeated values as one value and a count, which suits sorted columnar data."
---

Run-length encoding (RLE) is a lossless compression method that replaces a run of identical consecutive values with a single copy of the value plus a count of how many times it repeats. The sequence `A A A A B B C C C` becomes `(A,4) (B,2) (C,3)`. RLE does nothing useful for data that changes on every row, but it shrinks long runs of repeated values to a few bytes, which is why it shows up inside columnar formats used in a lakehouse, including Apache Parquet and Apache Arrow.

## How Run-Length Encoding Works

An encoder walks the input in order. While the next value matches the current one it increments a counter; when the value changes it emits the pair and starts a new run. Decoding reverses the process by repeating each value by its count. Two properties matter in practice:

* **It depends on order.** RLE only sees adjacent repeats. A column with ten distinct values compresses well if rows are sorted on that column and poorly if the same values are scattered.
* **It can be queried without full decoding.** An engine can count, filter, or aggregate a run as one unit. A filter such as `status = 'shipped'` can test one value and accept or reject the whole run.

Real formats rarely use pure RLE. Apache Parquet defines an RLE and bit-packing hybrid encoding (encoding id 3). It switches between RLE runs for repeated values and bit-packed groups for values that do not repeat, using a fixed bit width known in advance. The Parquet spec uses this hybrid for three things: repetition and definition levels (which record nesting and nulls), dictionary indices, and boolean values.

## RLE and Dictionary Encoding Together

RLE is most often paired with [dictionary encoding](/knowledgebase/dictionary-encoding/). In Parquet's `RLE_DICTIONARY` encoding, the distinct values of a column chunk are stored once in a dictionary page, and each data page stores small integer IDs that point into that dictionary. Those IDs are then compressed with the RLE and bit-packing hybrid. A low-cardinality column such as `country` or `order_status` becomes a short list of distinct strings plus a compact stream of run-length encoded integers. The older `PLAIN_DICTIONARY` value is deprecated in the spec in favor of this approach.

Apache Arrow added a related in-memory layout, Run-End Encoded (REE), in columnar format version 1.3. Instead of storing run lengths, an REE array holds two child arrays: `run_ends`, a strictly ascending list of 16, 32, or 64 bit integers marking where each run stops, and `values`, holding one value per run. Storing end positions rather than lengths lets an engine find the run for a given row with a binary search.

| Encoding | Stores | Works best when |
|---|---|---|
| Run-length encoding | value plus repeat count | Long runs of the same value, usually after sorting |
| Dictionary encoding | distinct values once, plus integer IDs | Few distinct values, in any order |
| Delta encoding | differences between consecutive values | Increasing numbers such as timestamps or IDs |
| Plain | each value as written | High-cardinality data with few repeats |

## Run-Length Encoding in the Lakehouse

In a lakehouse, RLE lives inside the Parquet files that back [Apache Iceberg](/knowledgebase/apache-iceberg/) tables. Writers such as Spark, Flink, and Dremio choose encodings per column chunk automatically, so engineers rarely configure RLE directly. What they do control is data layout, and layout decides how well RLE performs:

* **Sort orders and clustering.** Iceberg tables can declare a sort order, and table maintenance jobs can rewrite files with sorting or [Z-ordering](/knowledgebase/z-ordering/). Sorting on low-cardinality columns that queries filter on produces longer runs and smaller files.
* **Partitioning.** Within a partition, the partition column holds a single value, which RLE stores in a few bytes.
* **Engine execution.** Query engines that read Parquet into Arrow, including DuckDB and Dremio, can keep encoded data compact through scans and apply filters before expanding values.

Because RLE output is still a structured byte stream, Parquet usually applies a general codec such as Snappy or ZSTD on top of it. The encodings reduce redundancy that the codec would miss, and the codec reduces what is left.

## Related Reading

* [All About Parquet Part 06: Encoding in Parquet](/blog/2024-10-all-about-parquet-part-06/)
* [FSST and ALP: The Two Encodings Fixing Parquet's Weakest Compression Cases](/blog/fsst-alp-parquet-encodings/)
* [Columnar format](/knowledgebase/columnar-format/)

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
