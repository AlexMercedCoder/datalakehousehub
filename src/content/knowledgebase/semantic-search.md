---
title: "What is Semantic Search?"
meta_title: "What is Semantic Search? | Expert Data Lakehouse Architecture Guide"
description: "Semantic search finds results by meaning instead of exact keywords, using vector embeddings and nearest neighbor similarity, and hybrid search mixes both."
---

# What is Semantic Search?

Semantic Search is an information retrieval approach that searches by the *meaning, intent, and context* of a user's query rather than by exact keyword matching. It is the main capability enabled by Vector Embeddings and Vector Databases, and it changes how users find information in large, unstructured collections of corporate data.

For decades, search systems relied mainly on Lexical Search (Keyword Search). If an employee queried a corporate HR database for "How to get a refund for my laptop," the search engine looked for documents containing the words "refund" and "laptop." If the official IT policy document actually stated, "To be reimbursed for your computer hardware," the search could miss it entirely. Without synonym lists, a keyword engine has no way to know that "refund" relates to "reimbursed" and "laptop" relates to "computer hardware." Semantic search addresses this gap.

## The Architecture of Meaning

Semantic Search compares items in a vector space rather than as text.

When the HR documents are originally ingested into the [Data Lakehouse](/data-lakehouse/), they are passed through an Embedding Model. The sentence "To be reimbursed for your computer hardware" is converted into an array of numbers (a Vector, for example 1,536 dimensions for some OpenAI embedding models) and stored in the database.

When the employee types, "How to get a refund for my laptop," that search query is not run against the database text. The query itself is sent to the Embedding Model and converted into a Vector.

### Cosine Similarity (Nearest Neighbor Search)
The database then runs a K-Nearest Neighbors (k-NN) search, usually an approximate version for speed, using a measure such as Cosine Similarity. 
Cosine similarity measures the angle between the Search Vector and the Document Vectors. Because the embedding model has learned that "refund" and "reimburse" are closely related, it places their vectors close together. The angle between the user's question and the IT policy is small, which indicates similar meaning, so the database returns the policy document even though no keywords matched.

## Hybrid Search Architectures

While Semantic Search is good at matching intent, it often struggles with exact identifiers. If a user searches for a highly specific serial number (`Laptop-XJ-9948`), a semantic search might fail because the string lacks broader semantic "meaning."

To address this, many search systems implement Hybrid Search. They run the Semantic Vector Search and the traditional Lexical Keyword Search (BM25) in parallel and merge the two ranked lists with a fusion method such as Reciprocal Rank Fusion, so results can match the exact serial number *and* the intent of the query.

## Summary of Technical Value

Semantic Search changes how enterprises find data. By using Vector Embeddings to map the context and intent of human language, Semantic Search allows organizations to retrieve relevant information from large, unstructured data repositories without relying only on exact-keyword matches. It is a core building block for conversational AI agents over proprietary enterprise data.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
