---
title: "What is Vectorized Execution?"
meta_title: "What is Vectorized Execution? | Expert Data Lakehouse Architecture Guide"
description: "Vectorized execution is a query processing model that works on batches of columnar values instead of rows, using CPU cache and SIMD in engines like DuckDB."
---

# What is Vectorized Execution?

Vectorized Execution is a database processing model designed to use modern CPU hardware efficiently for analytical work. Used by analytical engines like Dremio, ClickHouse, and DuckDB, and by the compute libraries built on Apache Arrow, vectorized execution replaces row-by-row processing with operations on batches of contiguous column values.

Historically, traditional operational databases (like PostgreSQL or MySQL) processed queries using a "Volcano" execution model. In this model, each operator pulls a single row from the operator below it, processes it, and passes it up through the chain of filters and aggregations before moving on to the next row. For a query analyzing ten million rows, the database makes tens of millions of function calls. Much of the CPU's time goes to call overhead and interpretation rather than the actual computation. Vectorized execution reduces this overhead.

## The Architecture of Columnar Batches

Vectorized execution works best with columnar data layouts, so engines typically convert data to columnar batches in memory even when it is read from row-based sources.

Instead of processing one row at a time, a vectorized engine works on a "vector" (an array) of values for a single column, typically one to a few thousand values (DuckDB's default vector size is 2,048). 
For example, if the query calculates `SUM(sales_amount)`, the engine processes an array of, say, 2,048 `sales_amount` integers at a time.

### CPU Cache Optimization
This architecture is designed around the physical design of modern Central Processing Units (CPUs). CPUs have very fast, small memory caches on the processor chip, known as the L1 and L2 Caches. Reading data from main memory (RAM) is much slower than reading it from the L1 Cache.

Because the vectorized batch is a small, contiguous array, it fits in the CPU caches, and the CPU's hardware prefetcher can load it efficiently with sequential reads. The CPU does not have to jump around random memory addresses searching for data. This raises the "Cache Hit Rate" and reduces the time the processor spends waiting for data to arrive from RAM.

## SIMD Instructions (Single Instruction, Multiple Data)

Once the vector of data is in the CPU Cache, the execution engine can use SIMD instructions.

SIMD (Single Instruction, Multiple Data) is a specialized class of hardware-level instructions built into modern x86 (Intel and AMD) and ARM processors. In a legacy row-by-row model, adding two numbers requires one CPU instruction. If you need to add 2,048 numbers, it requires about 2,048 separate add instructions.

SIMD instructions apply one operation to several values at once. With 256-bit AVX2 registers, for example, a single instruction can add eight 32-bit integers. The vectorized engine runs tight loops over the array that compilers and hand-written kernels turn into SIMD instructions, processing the `SUM` several values per instruction. Combined with lower per-row overhead, this lets vectorized engines run analytical queries much faster than row-at-a-time engines.

## Integration in Modern Query Engines

Vectorized execution is a defining feature of modern analytical engines.

* **Apache Arrow:** Arrow is a standard columnar in-memory format that suits vectorized execution. Because Arrow defines a common, columnar in-memory layout, engines and libraries can operate on Arrow buffers directly and exchange them without conversion.
* **DuckDB:** DuckDB is an in-process, vectorized engine. It processes columnar batches read from Parquet files and other sources, which lets it analyze millions of rows quickly on a single machine without a distributed cluster.
* **Dremio and ClickHouse:** These distributed engines rely on vectorized processing to serve interactive BI dashboards. Dremio processes data in Arrow format across its worker nodes, while ClickHouse uses its own columnar blocks; both aim to keep the hardware busy across the cluster.

## Summary of Technical Value

Vectorized Execution aligns database software with how modern CPUs work. By replacing row-by-row processing with contiguous columnar batches, vectorized engines use CPU caches efficiently and take advantage of SIMD instructions. It is a core technique for delivering fast, concurrent analytical performance over large datasets.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
