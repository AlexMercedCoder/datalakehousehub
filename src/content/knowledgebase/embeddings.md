---
title: "What is Embeddings?"
meta_title: "What is Embeddings? | Expert Data Lakehouse & AI Glossary"
description: "Embeddings are numeric vectors that capture the meaning of text, images, or audio. Learn how vector search over embeddings supports RAG and hybrid search."
---

Embeddings are lists of numbers (vectors) that represent the meaning of a piece of content, such as a sentence, a document chunk, an image, or a product, so that items with similar meaning end up close together in vector space. A model trained for the purpose produces them: two support tickets that describe the same problem in different words get vectors that point in nearly the same direction, while an unrelated ticket lands far away. That property lets software search, cluster, and compare content by meaning rather than by exact keywords.

## How It Works

1. **Choose an embedding model.** Text models, image models, and multimodal models each map their inputs into a vector of fixed length. The length (the dimension) is set by the model, commonly several hundred to a few thousand values.
2. **Prepare the content.** Long documents are split into chunks so each vector represents a focused passage.
3. **Generate vectors.** Each chunk is passed through the model, and the output vector is stored along with the original text and metadata such as source, date, and access labels.
4. **Embed the query.** At search time, the user's question is embedded with the same model.
5. **Compare.** The system finds stored vectors closest to the query vector, typically with cosine similarity, dot product, or Euclidean distance.

Exact comparison against every stored vector is slow for large collections, so vector databases and search engines use approximate nearest neighbor indexes such as HNSW to find close matches quickly. The [vector similarity metrics](/knowledgebase/vector-similarity-metrics/) entry covers the distance functions in more detail.

Vectors from different models are not compatible. If you change the embedding model, every stored vector has to be regenerated.

## Embeddings vs Keyword Search

| Aspect | Keyword (lexical) search | Embedding (semantic) search |
|---|---|---|
| Matches on | Shared words and terms | Similar meaning |
| Handles synonyms and paraphrase | Poorly without extra configuration | Well |
| Exact codes, IDs, rare terms | Well | Can miss them |
| Explainability | Easy to see why a result matched | Harder to explain |
| Index | Inverted index | Vector index |

Because each approach covers the other's weak spots, many systems combine them in [hybrid search](/knowledgebase/hybrid-search/).

## Embeddings in the Lakehouse

Embeddings are central to [retrieval-augmented generation](/knowledgebase/retrieval-augmented-generation/), where an AI assistant retrieves relevant passages before answering. In a lakehouse, the source content and its metadata usually live in governed tables, and the embeddings are derived data that need the same care as any other pipeline output:

- **Generation.** A batch or streaming job reads new or changed rows from Apache Iceberg tables, chunks the text, calls the embedding model, and writes vectors back to a table or a vector store.
- **Storage.** Vectors can sit in a dedicated vector database or in lakehouse tables as fixed-length float arrays. DuckDB's `vss` extension, for example, can build HNSW indexes on fixed-size float array columns, though the DuckDB docs mark the extension experimental.
- **Governance.** The access rules on the source tables should carry over to the vectors and their text, or a semantic search can surface content a user is not allowed to read.
- **Freshness.** Iceberg snapshots and change data make it possible to re-embed only the rows that changed.

The Hub post on [vector search over Iceberg tables](/blog/vector-search-over-iceberg-tables/) walks through these patterns, and the [vector embeddings](/knowledgebase/vector-embeddings/) entry covers the math behind them.

## Summary

Embeddings turn content into vectors whose distances reflect meaning. They power semantic search, recommendations, clustering, and RAG, and in a lakehouse they are best treated as governed, versioned derived data generated from the tables they describe.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
