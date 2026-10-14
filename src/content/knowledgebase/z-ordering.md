---
title: "What is Z-Ordering?"
meta_title: "What is Z-Ordering? | Expert Data Lakehouse Architecture Guide"
description: "Z-ordering is a clustering technique that sorts rows along a Z-curve across several columns, so Iceberg and Delta Lake queries can skip more files on filters."
---

# What is Z-Ordering?

Z-Ordering is a multi-column data clustering technique used with Open Table Formats (like [Apache Iceberg](/apache-iceberg/) and Delta Lake) to place related rows in the same data files. It is designed to speed up analytical queries that filter on several columns, which single-column partitioning or sorting handles poorly.

In a large [Data Lakehouse](/data-lakehouse/), data engineers typically partition tables by a single dimension, most often Date (`year/month/day`). This works well if a business analyst filters by Date. However, if analysts often filter on Date *and* Customer_ID *and* Product_ID, partitioning alone is not enough. The engine quickly finds the correct Date partition, but the matching Customer and Product rows are scattered across many Apache Parquet files inside it, so the engine has to read most of them. Z-Ordering reduces these scattered reads by clustering rows with similar values in several columns together.

## The Mathematics of the Z-Curve

Z-Ordering relies on Space-Filling Curves. It maps multi-dimensional values (e.g., Customer_ID and Product_ID) onto a single one-dimensional value (the Z-value) by interleaving the bits of each column, which keeps points that are close in several dimensions mostly close on the line.

When a data engineer runs a Z-Order rewrite across three columns (in Iceberg, for example, Spark's `rewrite_data_files` procedure with a `zorder(...)` sort order), the engine reads the selected data files during a compaction job. 

It calculates a Z-value for each row from those three columns, sorts the rows by this Z-value, and writes them out to new Parquet files.

### The Physical Impact
The result of this sort is significant. Because the data is clustered, the transactions for Customer A purchasing Product B end up in the same Parquet file or a small group of files instead of being scattered.

## Better File Skipping with Predicate Pushdown

The benefit of Z-Ordering shows up at query time, through its interaction with Predicate Pushdown.

Parquet files record Minimum and Maximum values for each column in their footer metadata, and Iceberg also stores per-file column bounds in its manifests. 

If data is randomly scattered, the Min/Max range for the Customer_ID column inside a specific file might span from `1` to `999,999`. This range is so wide that when an analyst queries for `Customer_ID = 500`, the query engine assumes the file *might* contain the data and reads the file. Because every file has a wide, overlapping range, the engine reads nearly everything.

Z-Ordering clusters the data. After clustering, one Parquet file might contain Customer_IDs mostly between `1` and `5000`, and the next mostly between `5001` and `10000`. 

When the analyst queries `Customer_ID = 7500`, the query engine checks the Min/Max statistics and determines that most files cannot contain the value. The engine skips those files and reads only the few whose ranges include the target. Because a Z-order balances several columns, the ranges for each column are less tight than a sort on that column alone would produce, and the benefit decreases as more columns are added.

## Implementation and Maintenance

Z-Ordering is effective, but in most setups it is not automatic. It requires deliberate maintenance. 

As new data streams into the Lakehouse, it arrives un-clustered. If left alone, query performance gradually degrades as more scattered files accumulate. Data engineers schedule compaction jobs (often nightly or weekly) that identify the new, small data files, compute the Z-values, and rewrite the data into larger, clustered Parquet files.

## Summary of Technical Value

Z-Ordering is a practical technique for queries that filter on several columns. By using a space-filling curve to cluster related rows in the same files, it lets query engines skip more files using Min/Max statistics across multiple columns. It cuts down on unnecessary file scans and speeds up dashboards that filter on several dimensions.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
