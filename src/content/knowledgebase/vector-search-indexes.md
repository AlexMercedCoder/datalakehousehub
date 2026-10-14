---
title: "What is Vector Search Indexes?"
meta_title: "What is Vector Search Indexes? | Data Lakehouse Hub Knowledge Base"
description: "Vector search indexes are structures that speed up approximate nearest neighbor search over embeddings, with a look at how IVF clustering and HNSW graphs work."
---

# What is Vector Search Indexes?

## Introduction to Vector Search Indexes

As Generative AI and Retrieval-Augmented Generation (RAG) pipelines have moved from experimental prototypes into enterprise production, the underlying infrastructure has faced serious scaling challenges. The core of any semantic search or RAG application is the ability to compare a user's query against a large collection of **[Vector Embeddings](https://datalakehousehub.com/knowledgebase/vector-embeddings/)** to find the most conceptually similar documents.

If a database contains 10,000 documents, finding the most similar vector is easy. The system performs an **Exact Nearest Neighbor (k-NN)** search. It calculates the exact distance (using Cosine Similarity or Euclidean Distance) between the query vector and *every single one* of the 10,000 document vectors, and returns the closest match.

However, if the database contains 100 million or 1 billion documents (which is common for enterprise knowledge bases or image repositories), calculating the distance 1 billion times for a single user query requires a lot of compute and adds too much latency for interactive use. 

To keep search fast at that scale, systems use **Approximate Nearest Neighbor (ANN)** algorithms, implemented as **Vector Search Indexes**.

## How Approximate Nearest Neighbor (ANN) Works

The basic trade-off of an ANN index is giving up a small amount of accuracy (e.g., occasionally missing one of the true nearest neighbors) in exchange for much faster search. Accuracy is measured as recall and can be tuned. 

Instead of scanning every vector linearly, ANN algorithms pre-compute the relationships between vectors and organize them into searchable data structures (indexes) when the index is built.

There are several types of ANN indexes, but two of the most widely used are **Inverted File Index (IVF)** and **Hierarchical Navigable Small World (HNSW)**.

## 1. Inverted File Index (IVF)

IVF is one of the oldest and most widely used vector indexing strategies, and a core index type in Meta's open-source **FAISS** library (originally Facebook AI Similarity Search).

### How it Works (Clustering)
During the ingestion phase, the IVF algorithm uses K-Means clustering to divide the vector space into hundreds or thousands of "cells" or "clusters". 
It calculates the central point (the centroid) of each cluster. Every document vector is then assigned to the cluster whose centroid it is closest to.

### The Search Process
When a user submits a query vector:
1.  **Coarse Search**: The algorithm first calculates the distance between the query vector and the *centroids* of the clusters (e.g., comparing it to 1,000 centroids instead of 100 million documents).
2.  **Fine Search**: It identifies the top $n$ closest clusters. The algorithm then enters those specific clusters and performs an exact calculation against only the document vectors residing inside them.

By skipping most of the clusters, IVF greatly reduces compute time. Searching more clusters raises recall at the cost of speed.

## 2. Hierarchical Navigable Small World (HNSW)

While IVF works well, **HNSW** is one of the most popular vector search indexes. It is the main or default index in several Vector Databases, including Qdrant and Weaviate, and is supported by Milvus and pgvector.

HNSW uses a **Multi-Layered Graph** instead of clustering.

### How it Works (The Graph)
Imagine a standard map of a city. If you want to get from Point A to Point B, you don't check every street; you take the highway, get off at an exit, take a main road, and finally turn down a small residential street. HNSW mimics this logic.

HNSW builds a graph where vectors are nodes, connected by edges based on their proximity. Crucially, it builds *multiple layers* of this graph.
*   **The Bottom Layer (Layer 0)**: Contains every vector in the database, densely connected to its nearest neighbors.
*   **Middle Layers**: Contain fewer and fewer vectors.
*   **The Top Layer**: Contains only a handful of vectors (the "highways").

### The Search Process
When a query vector arrives:
1.  The search begins at the very top, sparse layer. It jumps from node to node, quickly narrowing in on the general neighborhood of the query.
2.  Once it finds the closest node in the top layer, it drops down to the next layer below it. 
3.  It repeats this process, traversing the graph and dropping down layers until it hits the dense, bottom layer (Layer 0), where it searches locally for the nearest neighbors.

### HNSW Performance
HNSW is fast and achieves high recall, with search cost that grows roughly logarithmically ($O(\log N)$) with the number of vectors. However, it requires significant RAM, because the graph and vectors are usually kept in memory for fast traversals.

## Conclusion

Without Vector Search Indexes, large-scale semantic search and RAG would be far more expensive. Algorithms like HNSW and IVF let systems search high-dimensional spaces efficiently. Choosing which index to deploy, weighing HNSW's higher recall and memory use against IVF's smaller footprint and faster index builds (often combined with compression such as product quantization), is an important architectural decision when designing scalable RAG applications and semantic search engines for the enterprise.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
