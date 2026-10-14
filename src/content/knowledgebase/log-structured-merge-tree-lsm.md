---
title: "What is Log-Structured Merge-Tree (LSM)?"
meta_title: "What is Log-Structured Merge-Tree (LSM)? | Data Lakehouse Hub Knowledge Base"
description: "A log-structured merge-tree is a write-optimized data structure that buffers writes in memory, flushes sorted files to disk, and merges them through compaction."
---

# What is Log-Structured Merge-Tree (LSM)?

## Introduction to LSM Trees

In many traditional databases (like PostgreSQL indexes), data is organized in B-Trees. B-Trees are fast for reads, but writes are more expensive. 
Inserting a record into a B-Tree means finding the right page somewhere in the middle of the structure and updating it in place. This is called **Random I/O**. Storage devices, especially mechanical hard drives, handle random I/O much more slowly than sequential I/O, so very high insert rates can become limited by the disk.

The **Log-Structured Merge-Tree (LSM Tree)**, described by Patrick O'Neil and colleagues in 1996, was designed to address this "write bottleneck." 
It is the storage structure behind many write-heavy databases and storage engines (like Apache Cassandra, Apache HBase, RocksDB, and LevelDB).

## How LSM Trees Work: The Write Optimization

LSM Trees avoid in-place random writes and rely on **Sequential I/O**. Instead of finding the correct place for each record on disk, they buffer writes and later write them out in large sorted batches.

### Step 1: The MemTable (RAM)
When a user writes a new record (`ID=42, Name=Alex`), the database appends it to a write-ahead log on disk for durability (a fast sequential write) and inserts it into a sorted structure in **Memory (RAM)**, called the MemTable. Writing to RAM is far faster than updating pages on disk.

### Step 2: The Flush (SSTable)
Eventually, the MemTable reaches a configured size (for example, 64MB). The database freezes that MemTable and "flushes" it to the physical hard drive as a brand new, immutable file called an **SSTable** (Sorted String Table). 
Because the database writes already-sorted data sequentially in one large block, the disk handles it efficiently. 

### Step 3: Compaction
Over time, the disk accumulates many of these SSTable files. 
If a user updates `ID=42` three different times on three different days, that record exists in three different SSTables.
To fix this, a background process called **Compaction** wakes up. It reads several SSTables, merges them, drops the outdated versions of `ID=42`, and writes new, larger sorted SSTables. 

## The Read Penalty

There is no free lunch in computer science. By optimizing for write throughput, the LSM Tree gives up some read speed.

If a user runs `SELECT * FROM table WHERE ID=42`, the database has to check multiple places:
1.  First, it checks the active MemTable in RAM.
2.  If it doesn't find it, it checks the newest SSTable on the hard drive.
3.  If it doesn't find it, it checks the next oldest SSTable, and the next, and the next.

Searching many files to find one record is slow. To reduce this "Read Penalty," LSM trees use **[Bloom Filters](https://iceberglakehouse.com/iceberg/iceberg-bloom-filters/)**, a compact probabilistic structure that can tell the database, *"Do not check SSTable #4, ID=42 is definitely not in there."* A Bloom filter never gives a false negative, though it can occasionally give a false positive.

## Conclusion

The Log-Structured Merge-Tree is a core storage structure of the big data era. Write-heavy workloads, such as IoT sensors or social media feeds, strain B-Tree storage. By using RAM as a buffer and writing to disk sequentially, LSM Trees let databases sustain high write rates, deferring the work of sorting and merging to background compaction.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
