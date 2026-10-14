---
title: "Chunking for RAG: Strategies and How to Store Chunks in Lakehouse Tables"
meta_title: "Chunking for RAG: Strategies and Lakehouse Pipelines"
description: "Chunking splits long documents into smaller segments before embedding them for RAG. Compare chunking strategies and see how to manage chunks in Iceberg tables."
---

Chunking is the step in a Retrieval-Augmented Generation (RAG) pipeline that splits long unstructured documents into smaller segments ("chunks") before each segment is converted into a vector embedding. A 500-page contract becomes hundreds of chunks, each embedded and indexed separately, so a search can return the passage that answers a question instead of the whole document.

Chunking looks like a minor preprocessing step, but it has a large effect on retrieval quality. Poorly chunked data leads to retrieved passages that are missing the relevant context or diluted by unrelated text, and the language model then answers from weak evidence.

## Why Chunking Is Necessary

Embedding models accept a limited number of input tokens, commonly 512 for smaller open models and around 8,000 for some hosted models. Input beyond the limit is either rejected with an error or truncated, so most of a long document would never be embedded.

Even if a model accepted a whole book, one embedding for 500 pages would average together hundreds of topics. A question about a clause on page 42 would not match that diluted vector well. Smaller chunks give each embedding a focused meaning that a query can match.

## Common Chunking Strategies

The right strategy depends on the documents. See [chunking strategies for RAG](/knowledgebase/chunking-strategies-for-rag/) for a longer treatment.

### 1. Fixed-Size Chunking
The simplest method splits text every N characters or tokens. It is fast, but a split can cut a sentence in half (e.g., "The user must never..." [SPLIT] "...reboot the server."), leaving two chunks that each carry only part of the meaning.

### 2. Sentence, Paragraph, and Structure-Aware Chunking
These methods split on sentence boundaries, paragraphs, or document structure such as headings, list items, and table rows, using NLP libraries (like NLTK or spaCy) or format-aware parsers for Markdown, HTML, and PDF. Each chunk holds a complete thought, which usually produces better embeddings.

### 3. Chunk Overlap
To keep context that spans a boundary, chunks can overlap: if Chunk A is 500 tokens, Chunk B starts with the last 50 tokens of Chunk A. Overlap reduces the chance that an answer is split across two chunks, at the cost of more storage and some duplicate results.

### 4. Semantic Chunking
Semantic chunking compares embeddings of consecutive sentences and starts a new chunk where the topic shifts. It costs more to compute but adapts to documents with uneven structure.

## Managing Chunks in a Lakehouse

Chunks are data, and they change: documents are updated, chunking rules are tuned, and embedding models are replaced. Storing chunks in an [Apache Iceberg](/knowledgebase/apache-iceberg/) table, with or without a separate [vector database](/knowledgebase/vector-database/), makes those changes manageable:

| Column | Purpose |
|---|---|
| `doc_id`, `chunk_id` | Link each chunk to its source document |
| `chunk_text` | The text that gets embedded and shown to the model |
| `chunker_version` | Which strategy and settings produced the chunk |
| `embedding_model`, `embedding` | Which model produced the vector, and the vector itself |
| `source_updated_at`, `access_tags` | Freshness and permissions inherited from the source |

With this layout, re-chunking one updated document is a `MERGE` on its `doc_id`, testing a new chunker can happen on an Iceberg branch, and a snapshot ID records exactly which chunks an index was built from. Vector indexes in Milvus, pgvector, or another store can be rebuilt from the table at any time.

For the data engineering side of RAG, read [RAG Isn't a Modeling Problem. It's a Data Engineering Problem.](/blog/2026-01-rag-isnt-the-problem/) and [Vector Search Directly Over Iceberg Tables](/blog/vector-search-over-iceberg-tables/).

## Summary of Technical Value

Chunking turns long documents into segments small and focused enough to embed and retrieve precisely. Choosing boundaries that respect sentences and structure, adding modest overlap, and tracking chunk versions in governed tables make RAG retrieval more accurate and easier to maintain. Good chunking reduces, but does not eliminate, the risk of wrong or unsupported answers.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
