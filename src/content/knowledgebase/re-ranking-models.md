---
title: "What is Re-ranking Models?"
meta_title: "What is Re-ranking Models? | Data Lakehouse Hub Knowledge Base"
description: "A re-ranking model reorders search results by scoring each document against the query, often with a cross-encoder. Learn how two-stage retrieval improves RAG."
---

# What is Re-ranking Models?

## Introduction to Re-ranking

In a standard Retrieval-Augmented Generation (RAG) system, the search process is a tradeoff between speed and accuracy. 

When a user asks a question, the Vector Database must search through millions of documents. To keep latency low, the database uses **Bi-Encoders** (standard Embedding models). The user's query is converted to a vector, the documents are converted to vectors, and their similarity is calculated (Cosine Similarity). 

While fast, this process is "shallow": the query and document are compared only through their vectors. It often returns documents that are highly related to the *topic*, but don't actually contain the *answer* to the specific question. 

If you feed those weaker results to an LLM, it is more likely to give a wrong or hallucinated answer. 

**Re-ranking** is a second step added to many RAG pipelines to address this. It is a more accurate but more computationally expensive scoring pass that takes the top results (for example, the top 50) from the fast Vector Search and re-orders them by relevance to the query.

## How Re-ranking Works: The Cross-Encoder

Re-ranking typically uses a different model architecture called a **Cross-Encoder**.

### The Bi-Encoder Limitation (The Fast Search)
In standard vector search, the question and the document are encoded separately. The model never sees them together. It turns each into a vector and measures the distance between them. 

### The Cross-Encoder Intelligence (The Slow Re-rank)
A Cross-Encoder model (like those provided by Cohere or BAAI) processes the Question and the Document *at the exact same time*. 
It concatenates them: `[Question] + [Document]`. 
It feeds this combined text into its Transformer [Attention Mechanism](https://datalakehousehub.com/knowledgebase/attention-mechanism/). Because the model can see both texts simultaneously, its Attention layers model the relationships between the words in the question and the words in the document. 

The Cross-Encoder acts somewhat like a human judge. It reads the pair and outputs a relevance score that estimates: *"Does this document explicitly answer the user's question?"*

## The Pipeline Architecture

Because Cross-Encoders must run once per query and document pair, running them across a database of a million documents for every query is impractical. Therefore, Re-ranking is usually implemented as a two-stage pipeline.

1.  **Stage 1: Retrieval (Broad & Fast)**. The Vector Database uses fast, cheap Bi-Encoders (or BM25 [Hybrid Search](https://datalakehousehub.com/knowledgebase/hybrid-search/)) to search a large collection and retrieve the Top 50 most likely candidates quickly.
2.  **Stage 2: Re-ranking (Narrow & Slow)**. The system takes those 50 documents and passes them to the Cross-Encoder. The Cross-Encoder scores each of the 50 documents against the user's query. This is slower per document than vector search, but manageable for a short candidate list.
3.  **Stage 3: Generation**. The system takes the Top 5 newly re-ranked documents (discarding the other 45) and feeds them into the LLM prompt.

## The Business Impact

Implementing a Re-ranking model (often via a simple API call to Cohere's `Rerank` endpoint) is often one of the simpler, higher-value improvements a developer can make to a RAG system. 

It usually takes little code, and it can improve retrieval quality noticeably; the gain depends on the data and should be measured on your own evaluation set. By giving the LLM more relevant passages, Re-ranking reduces the chance of hallucinated answers, which matters for customer-facing applications.

## Conclusion

Re-ranking models act as a quality-control layer in modern information retrieval. By separating the search process into a fast, scalable retrieval phase and a slower, more precise scoring phase, engineers can work around the limits of vector similarity alone. The Cross-Encoder makes it more likely that the final context given to the Generative AI is precise and relevant, which supports a more trustworthy RAG application.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
