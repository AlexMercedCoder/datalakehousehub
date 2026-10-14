---
title: "Milvus and the Lakehouse: When to Use a Vector Database vs Vector Search on Iceberg"
meta_title: "Milvus Vector Database vs Lakehouse Vector Search"
description: "Milvus is an open-source distributed vector database for similarity search on embeddings. See how it works and when a lakehouse needs it over vectors in tables."
---

Milvus is an open-source, distributed vector database built for similarity search over embeddings in AI applications such as semantic search, recommendations, and Retrieval-Augmented Generation (RAG). It was created by Zilliz, which also sells a managed version (Zilliz Cloud), and it is a graduated project of the LF AI & Data Foundation, part of the Linux Foundation. Milvus is designed to scale to billions of vectors.

Relational databases are built for exact matches and range queries on strings and numbers. AI applications need nearest-neighbor search over high-dimensional vectors (embeddings) that represent the meaning of text, images, or audio. Milvus provides the storage layout and approximate nearest neighbor (ANN) indexes that make that search fast at large scale.

## The Cloud-Native Architecture

Milvus can run as a library-like embedded instance (Milvus Lite), a single-node standalone server, or a distributed cluster on Kubernetes. The distributed version separates storage from compute so each scales independently.

### The Storage Layer
* **Object storage** (S3, MinIO-compatible stores, Azure Blob, GCS) holds log snapshots, sealed data segments, and index files.
* **A meta store** (etcd) holds cluster metadata and service registration.
* **A write-ahead log** records incoming writes. Older releases relied on Kafka or Pulsar; Milvus 2.6 introduced Woodpecker, a WAL that writes directly to object storage, as an option.

### The Compute Layer
In current releases (2.6 and later), the worker roles are:
* **Coordinator:** a single active coordinator manages cluster topology, data placement, and scheduling.
* **Streaming Nodes:** handle incoming writes and recent ("growing") data and convert it into sealed segments.
* **Query Nodes:** load sealed segments and indexes and execute searches.
* **Data Nodes:** do offline work such as compaction and index building.

Because query capacity is separate from ingestion and index building, a spike in search traffic can be handled by adding Query Nodes alone.

## High-Dimensional Indexing Algorithms

Exact nearest-neighbor search compares the query vector with every stored vector, which becomes slow at hundreds of millions of vectors. Milvus supports several ANN index types that trade a small amount of recall for large speedups.

### HNSW (Hierarchical Navigable Small World)
HNSW is a widely used graph index. It organizes vectors into layers of a navigable graph: a search starts in a sparse top layer and moves down toward denser layers near the query, visiting only a small fraction of the vectors. It offers high recall and low latency at the cost of memory.

### IVF (Inverted File Index)
IVF uses k-means clustering to divide the vector space into clusters. A query is compared with cluster centroids first, then only with vectors in the closest few clusters (the `nprobe` setting). Variants with product quantization (IVF_PQ) compress vectors to cut memory.

Milvus also supports disk-based (DiskANN) and GPU indexes for datasets that do not fit in memory or need higher throughput.

## Filtering and Hybrid Search

Real applications combine similarity with constraints: find jackets visually similar to this one, priced under $100, in size Large. Milvus stores scalar fields (numbers, strings, booleans, JSON) alongside vectors and applies filter expressions during the search, so results satisfy both. Milvus also supports hybrid search in the sense of combining multiple vector fields, such as dense embeddings and sparse keyword vectors, and reranking the merged results.

## Milvus vs Vector Search in the Lakehouse

Embeddings do not have to live only in a vector database. Many teams keep the source of truth in [Apache Iceberg](/knowledgebase/apache-iceberg/) or [Lance](/knowledgebase/lance-file-format/) tables and decide separately where to serve search.

| | Milvus | Vectors in lakehouse tables |
|---|---|---|
| Query latency | Milliseconds at high concurrency | Seconds to sub-seconds, engine dependent |
| Scale of online search | Built for billions of vectors | Better for batch, analytical, or moderate-volume search |
| Governance | Its own users and roles | Same catalog, RBAC, and lineage as other tables |
| Freshness | Streaming inserts | Snapshot commits |
| Operations | A separate cluster to run (or Zilliz Cloud) | No extra system |

A common pattern: Spark or Dremio builds a governed chunk-and-embedding table in Iceberg (see [chunking](/knowledgebase/chunking/)), and a job loads that table into Milvus for low-latency serving. If Milvus is lost or the embedding model changes, the index is rebuilt from the table. For deeper discussion, read [Vector Search Directly Over Iceberg Tables, and When You Still Need a Vector Database](/blog/vector-search-over-iceberg-tables/) and [Choosing Vector Stores for Retrieval Workloads](/blog/2026-05-vector-stores-retrieval/).

At inference time, agent and RAG frameworks such as LangChain or LlamaIndex query Milvus to retrieve passages that ground the model's answer. Good retrieval reduces hallucinations; it does not eliminate them.

## Summary of Technical Value

Milvus is a distributed vector database that separates storage from compute and offers HNSW, IVF, disk-based, and GPU indexes for fast similarity search with filtering. In a lakehouse architecture it works best as a serving layer for embeddings whose source of truth lives in governed tables.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
