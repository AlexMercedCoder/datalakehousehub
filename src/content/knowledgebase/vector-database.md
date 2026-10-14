---
title: "What is a Vector Database?"
meta_title: "What is a Vector Database? | Expert Data Lakehouse Architecture Guide"
description: "A vector database stores embeddings and finds items by semantic similarity, covering HNSW and IVF indexes, metadata filtering, and hybrid search for AI apps."
---

# What is a Vector Database?

A Vector Database is a storage and retrieval system designed to handle high-dimensional numeric arrays, known as vectors or embeddings. While traditional relational databases are built to manage rows of explicit text and numbers, and search engines are built to manage keyword indexing, Vector Databases are built to run similarity searches based on the semantic meaning of data.

The growth of Generative AI and Large Language Models (LLMs) made this kind of search much more common. Embedding models convert words, images, and audio into numerical arrays (often hundreds to a few thousand dimensions) that place similar concepts near each other in a vector space. Traditional database indexes are not designed to search these arrays by similarity. Vector Databases store these embeddings and run nearest-neighbor search over them, often serving as the long-term memory layer for AI applications. Many general-purpose databases, such as PostgreSQL with the pgvector extension, now offer vector search as well.

## The Architecture of Similarity Search

Searching a Vector Database works differently from a standard SQL lookup.

### Exact Match vs Semantic Similarity
In a relational database, if a user searches `WHERE product_description = 'Red Running Shoes'`, the database looks for an exact string match. If the database contains the string "Crimson Jogging Sneakers," the query will return no results because the strings do not match.

In a Vector Database, the query "Red Running Shoes" is converted into an embedding. The database then finds the stored embeddings closest to it. Because "Crimson Jogging Sneakers" has a very similar meaning, its vector sits close to the query vector in the high-dimensional space. The database returns it as a relevant match, which exact keyword search would have missed.

## High-Dimensional Indexing Algorithms

Calculating the exact distance (typically Cosine Similarity or Euclidean Distance) between a query vector and a billion stored vectors one by one is too slow for interactive use. Vector Databases use Approximate Nearest Neighbor (ANN) indexing algorithms, which trade a small amount of accuracy for much lower latency.

### Hierarchical Navigable Small World (HNSW)
HNSW is one of the most widely used indexing algorithms in vector search systems (Weaviate, Milvus, Qdrant, and pgvector all support it). It builds a multi-layered graph connecting the vectors. 

When a query executes, the database enters the top layer of the graph, which contains a few widely spaced nodes, and moves to the node closest to the query. It then drops down to the next, denser layer, starting from that specific node. By traversing down this hierarchy, the algorithm visits only a small fraction of the vectors in the dataset and narrows in on the most likely matches. This lets the database return high-recall results across very large collections with low latency.

### Inverted File Index (IVF)
Another common algorithm is IVF, which utilizes k-means clustering. During index building, the database divides the vector space into many clusters (Voronoi cells). When a query executes, the database finds the clusters whose centroids are closest to the query vector and only calculates distances against the vectors inside those few clusters (a tunable number, often called `nprobe`), which greatly reduces the compute required.

## Metadata Filtering and Hybrid Search

Real-world AI applications require more than just semantic similarity. A user searching an internal corporate wiki for "Q3 Revenue Projections" should only see documents they are authorized to view.

Most Vector Databases support Metadata Filtering. They store traditional scalar data (like `author_id`, `clearance_level`, or `document_date`) alongside the embedding. Depending on the system, the filter is applied before the search, during graph traversal, or after it. When filters are applied before or during the search, the AI agent only retrieves matches that satisfy the metadata constraints, such as those derived from Role-Based Access Controls (RBAC).

## Summary of Technical Value

The Vector Database changed how AI applications retrieve data. By using Approximate Nearest Neighbor algorithms instead of exact matching, it allows organizations to search billions of unstructured documents, images, and audio files based on meaning rather than exact keywords. It is a common storage foundation for Retrieval-Augmented Generation (RAG) pipelines and AI agents.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
