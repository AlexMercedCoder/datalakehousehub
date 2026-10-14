---
title: "What is Vector Similarity Metrics?"
meta_title: "What is Vector Similarity Metrics? | Data Lakehouse Hub Knowledge Base"
description: "Vector similarity metrics measure how close two embeddings are, comparing cosine similarity, Euclidean distance, and dot product and their impact on RAG search."
---

# What is Vector Similarity Metrics?

## Introduction to Vector Similarity

In modern AI architectures (specifically RAG systems), searching through text often goes beyond matching keywords. It uses **[Semantic Search](https://datalakehousehub.com/knowledgebase/semantic-search/)**, which looks for matching *meaning*.

To do this, text is passed through an Embedding Model, which converts a sentence into a **Vector** (an array of numbers, often hundreds to a few thousand dimensions; OpenAI's `text-embedding-3-small` produces 1,536 by default). 

If you want to find the most relevant document for a user's question, you convert the user's question into a Vector, and then you ask the Vector Database: *"Which document vectors are closest to the question vector?"*

To calculate "closeness" in a high-dimensional space, the database uses **Vector Similarity Metrics**. The choice of metric affects both the results and the cost of the search.

## The Three Primary Metrics

Three formulas are used most often to calculate the similarity between two vectors.

### 1. Cosine Similarity (The Common Default)
Cosine Similarity measures the **angle** between two vectors, ignoring their length (magnitude). 
Imagine a 2D graph. Vector A points North-East. Vector B points North-East, but is twice as long. The angle between them is 0 degrees, so their cosine similarity is 1, the maximum. 

*   **Why it's used**: It is a common default for text embeddings. Vector magnitude can vary for reasons unrelated to meaning, and cosine similarity compares only the *direction*, which is where embedding models encode the topic.

### 2. Euclidean Distance (L2 Norm)
Euclidean Distance measures the straight-line distance between the endpoints of two vectors. (Think of taking a ruler and measuring the distance between Point A and Point B). 

*   **Why it's used**: It is sensitive to the *magnitude* (length) of the vectors as well as their direction. For normalized vectors it produces the same ranking as cosine similarity. It is common in [Computer Vision](https://datalakehousehub.com/knowledgebase/computer-vision/), clustering, and anomaly detection, where magnitude carries information.

### 3. Dot Product (Inner Product)
The Dot Product multiplies the two vectors element by element and sums the results. It takes into account both the angle (like Cosine) AND the magnitude (like Euclidean). 

*   **Why it's used**: It is cheap to compute. Cosine similarity is a dot product divided by both vectors' lengths, so skipping that division saves work. 
*   **The Catch**: Dot Product gives the same result as cosine similarity only when the vectors are **Normalized** (scaled to a length of 1). Some embedding models, including OpenAI's embedding models, return normalized vectors. With normalized vectors, a Dot Product produces the same ranking as Cosine Similarity. Some models are trained specifically for dot product on unnormalized vectors, so follow the model's documentation. 

## The Impact on Database Performance

When building a RAG system with millions of documents, the similarity metric is set when you build the index in the Vector Database (like Pinecone, Milvus, or pgvector).

If a model's embeddings are not normalized and the model is meant for cosine similarity, the developer should use cosine or normalize the vectors at insert time. Normalizing once at insert lets the database use the cheaper dot product for every query, which adds up in a K-Nearest Neighbors (KNN) search across millions of vectors. The metric must also match the one the index was built with.

## Conclusion

Vector Similarity Metrics are the rulers used to measure distance between embeddings. Cosine Similarity is the usual choice for semantic meaning, and with normalized embeddings, developers can use the cheaper Dot Product and get the same ranking, which helps RAG applications retrieve relevant content quickly.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
