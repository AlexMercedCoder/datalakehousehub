---
title: "What is Chunking Strategies for RAG?"
meta_title: "What is Chunking Strategies for RAG? | Data Lakehouse Hub Knowledge Base"
description: "Chunking for RAG splits documents into smaller pieces before embedding them for retrieval. Compare fixed-size, sentence, structural, and parent-child chunking."
---

# What is Chunking Strategies for RAG?

## Introduction to Chunking

When building a Retrieval-Augmented Generation (RAG) system, an early step is converting your company's documents into embeddings and storing them in a vector database.

However, you cannot take a 300-page PDF of a financial report, run it through an embedding model, and store it as a single vector.
1.  **Embedding Limits**: Embedding models have a maximum input length, often between a few hundred and several thousand tokens, so a long document will not fit.
2.  **Semantic Dilution**: Even if you could embed 300 pages into one vector, that vector would blend many topics together. A single vector representing "Finance, Legal, HR, and Marketing" is too general. When a user searches for a specific HR policy, the search may miss the document because the HR content is diluted by hundreds of pages of finance material.

**Chunking** is the process of breaking large documents into smaller, meaningful text blocks before they are embedded. The strategy you choose has a large effect on the accuracy of the RAG application.

## Common Chunking Strategies

There is no single chunking strategy that fits every case. The right choice depends on the structure of your data.

### 1. Fixed-Size Chunking (The Simple Approach)
The simplest method. You configure the code (with [LlamaIndex](https://datalakehousehub.com/knowledgebase/llamaindex/) or [LangChain](https://datalakehousehub.com/knowledgebase/langchain/)) to split the document every 500 words (or tokens).
To reduce the damage of cutting a thought in half, engineers add an **Overlap**.
*   Chunk 1: Words 0 to 500.
*   Chunk 2: Words 450 to 950 (a 50-word overlap).
*   **Pros**: Easy to implement and fast to run.
*   **Cons**: It ignores structure. It might split the document in the middle of an important paragraph, separating the premise from the conclusion.

### 2. Sentence or Paragraph Chunking
Instead of counting words, the code splits the document at natural boundaries (for example, sentence endings or blank lines between paragraphs).
*   **Pros**: Keeps sentences and paragraphs whole, preserving the boundaries the author wrote.
*   **Cons**: Paragraph length varies widely, from a few words to many hundreds, which produces uneven chunks that can make similarity search less consistent.

### 3. Document-Specific (Structural) Chunking
This approach is often the most accurate. The code uses parsers that understand the file type (for example, Markdown or HTML).
When processing a Markdown file, the chunker splits the document at each heading (`##`).
*   **Pros**: Preserves the logical structure of the document, so each section becomes a chunk.
*   **Cons**: Requires parsing logic for each file type in your system (PDFs, Word documents, wikis), and very long sections may still need further splitting.

## Advanced Patterns: Parent-Child Chunking

A central dilemma in RAG is the **Chunk Size Trade-off**.
*   If chunks are large (for example, 1,000 words), the LLM gets good context, but each vector is less specific, so precise matches are harder to find.
*   If chunks are small (for example, 50 words), search finds precise matches, but the LLM may not get enough surrounding context to answer well.

To address this, many architectures use **Parent-Child Chunking** (or the related Sentence-Window Retrieval).
1.  The document is split into large "Parent" chunks (for example, 1,000 words) and stored in a regular database or document store.
2.  Each Parent chunk is split into small "Child" chunks (for example, 50 words), which are embedded into the vector database.
3.  When the user searches, the vector database matches the most relevant Child chunks.
4.  Before sending text to the LLM, the system uses each Child chunk's parent ID to fetch the full Parent chunk.

This combines the precision of small-chunk search with the richer context the LLM needs to reason accurately.

## Conclusion

Chunking is often treated as an afterthought in RAG development, but it is one of the biggest factors in system accuracy. If documents are chunked poorly, important meaning is split or diluted before it reaches the index, and the LLM is more likely to produce wrong or unsupported answers. Choosing a chunking strategy that fits your documents helps semantic search retrieve the right knowledge and makes enterprise AI more reliable.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
