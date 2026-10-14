---
title: "What is GraphRAG?"
meta_title: "What is GraphRAG? | Expert Data Lakehouse & AI Glossary"
description: "GraphRAG is a retrieval-augmented generation approach that pulls facts from a knowledge graph, not only vector search, to give an LLM structured, linked facts."
---

GraphRAG is a form of [retrieval-augmented generation](/knowledgebase/retrieval-augmented-generation/) (RAG) that builds a [knowledge graph](/knowledgebase/knowledge-graph/) of entities and relationships from source material and uses that graph, rather than only vector similarity over text chunks, to retrieve context for a large language model. The name is most closely tied to Microsoft Research's GraphRAG project and the 2024 paper "From Local to Global: A Graph RAG Approach to Query-Focused Summarization" by Darren Edge and coauthors (arXiv 2404.16130), though it is also used more broadly for any RAG pipeline that retrieves from a graph.

## Why GraphRAG Exists

Standard vector RAG splits documents into chunks, embeds them, and retrieves the chunks most similar to a question. That works for questions whose answer sits in a few passages. It struggles with two kinds of questions:

* **Global questions** about a whole corpus, such as "What are the main themes across these reports?", where no single chunk contains the answer.
* **Multi-hop questions** that require connecting facts spread across documents, such as which suppliers are linked to a product line through several intermediate entities.

The GraphRAG paper reported that, for global sensemaking questions over datasets of around one million tokens, its approach produced more comprehensive and diverse answers than a conventional RAG baseline.

## How GraphRAG Works

Microsoft's open source GraphRAG implementation describes an indexing pipeline and several query modes.

**Indexing:**

1. Split the corpus into text units, which also serve as source references.
2. Use an LLM to extract entities, relationships, and key claims from each text unit.
3. Cluster the resulting graph hierarchically with the Leiden community detection algorithm, grouping closely related entities.
4. Generate a summary report for each community, from the lowest level up.

**Querying:**

* **Global search** answers corpus-wide questions by drawing on community summaries, generating partial answers and combining them.
* **Local search** answers questions about specific entities by pulling in their neighbors, relationships, and source text.
* **DRIFT search** extends local search with community information.
* **Basic search** falls back to standard top-k vector retrieval.

The project's documentation recommends prompt tuning for each dataset, since out-of-the-box extraction prompts may not fit a given domain. Because indexing calls an LLM over every text unit, building the graph costs far more than embedding chunks, and it has to be refreshed as source documents change.

## GraphRAG Versus Vector RAG

| Aspect | Vector RAG | GraphRAG |
|---|---|---|
| Index | Embeddings of text chunks | Entities, relationships, and community summaries, often plus embeddings |
| Retrieval | Nearest neighbors by similarity | Graph traversal, community summaries, or both |
| Strong at | Specific, local factual questions | Global themes and multi-hop connections |
| Indexing cost | Embedding calls | LLM extraction and summarization calls |
| Explainability | Retrieved passages | Retrieved passages plus the entity paths used |

Many systems use both, with hybrid retrieval that combines graph context and vector search.

## GraphRAG and the Lakehouse

GraphRAG is usually discussed for unstructured text, but enterprise questions often mix documents with structured data. A lakehouse fits in a few ways. Extracted entities and relationships can be stored as ordinary node and edge tables in [Apache Iceberg](/knowledgebase/apache-iceberg/), versioned with snapshots, and queried with SQL engines such as Dremio, Spark, or DuckDB, or loaded into a graph database for traversal. A [semantic layer](/knowledgebase/semantic-layer/) already defines business entities, metrics, and their relationships, which can seed or validate an extracted graph so that the AI's view of "customer" or "revenue" matches the governed definition. Catalog lineage and access controls then determine which source documents and tables a given user's GraphRAG queries may draw on.

## Related Reading

* [Graphs in AI Engineering Have Solved Three Problems. The Fourth Is the Plan.](/blog/graphs-in-ai-engineering/)
* [Graph database](/knowledgebase/graph-database/)
* [Hybrid search](/knowledgebase/hybrid-search/)

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
