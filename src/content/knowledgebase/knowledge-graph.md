---
title: "What is a Knowledge Graph?"
meta_title: "What is a Knowledge Graph? | Expert Data Lakehouse Architecture Guide"
description: "A knowledge graph models entities as nodes and relationships as edges so queries can follow connections directly. Learn how it supports GraphRAG for AI apps."
---

# What is a Knowledge Graph?

A knowledge graph is a data model that represents information as a network of entities and the relationships between them, rather than as rows and columns. The term was popularized by Google, which introduced its Knowledge Graph for search in May 2012. A knowledge graph represents entities (like people, companies, or products) as nodes, and the relationships between those entities as edges.

In a relational database (like PostgreSQL), answering "John Doe works for Apple, Apple was founded by Steve Jobs, and Steve Jobs invested in Pixar" requires a chain of SQL `JOIN` statements across several tables. Each additional hop adds another join, and queries get harder to write and slower to run as the number of hops grows.
In a knowledge graph, relationships are stored as data in their own right. The query engine "walks" along the stored edges from node to node, which makes multi-hop relationship queries shorter to write and often faster to run.

## The Architecture of Nodes and Edges

Knowledge graphs are commonly stored in graph databases. Some use the labeled property graph model (like Neo4j), and others use RDF (Resource Description Framework) triple stores. Amazon Neptune supports both.

In RDF, the basic building block is the "triple," which consists of a subject, a predicate, and an object.
* `[Node: John Doe]` -> `[Edge: WORKS_FOR]` -> `[Node: Apple]`
* `[Node: Apple]` -> `[Edge: LAUNCHED]` -> `[Node: iPhone]`

In a property graph, edges are first-class records that can hold their own properties. The `WORKS_FOR` edge can store `start_date: 2021` directly, instead of requiring the intermediate bridge table that a relational design would use.

## Knowledge Graphs in the AI Era

Knowledge graphs have long been used for fraud detection and recommendation engines (e.g., "Customers who bought X also bought Y"), and they have recently drawn new interest as a way to ground large language models.

### Graph-RAG (Retrieval-Augmented Generation)
Standard RAG architectures rely on vector embeddings (semantic search) to retrieve documents for the AI. Semantic search is weaker at connecting facts spread across many documents. If an AI is asked to "Map the corporate ownership structure of all our European vendors," a vector search may return only some of the relevant pieces, because the answer is scattered across many separate PDF files.

[GraphRAG](/knowledgebase/graphrag/) addresses this by letting the AI query the knowledge graph. Because the graph explicitly maps the ownership (Vendor A -> OWNED_BY -> Holding Company B), the system can traverse the vendor network and retrieve the relevant relational structure. This gives the LLM structured, verified context that vector search alone does not provide.

## Summary of Technical Value

The knowledge graph is a strong fit for highly interconnected enterprise data. By storing relationships between entities as edges rather than computing them through chains of SQL joins, knowledge graphs make network analysis faster to write and run. Combined with large language models, they provide structured, verifiable grounding that can reduce AI hallucinations in relationship-heavy reasoning tasks.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
