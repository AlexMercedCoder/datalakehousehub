---
title: "Graph Databases and Graph Queries on Lakehouse Iceberg Tables"
meta_title: "Graph Database vs Graph Queries on Iceberg Tables"
description: "A graph database stores data as nodes and edges to traverse relationships quickly. Learn how it works and when to run graph queries on Iceberg tables instead."
---

A graph database stores data as nodes (entities) and edges (relationships) and is built to traverse those relationships quickly. Where a relational database models a friendship as rows in a join table, a graph database stores the friendship as an edge you can follow directly. Neo4j, Amazon Neptune, TigerGraph, Memgraph, and ArangoDB are common examples.

Graph databases shine on multi-hop questions such as "which customers bought the same product as friends of John" or "how is this account connected to that one within four transfers." In SQL, each hop is another join. Joins on indexed keys work well for one or two hops, but query complexity and cost grow quickly as the number of hops grows or becomes variable.

## Index-Free Adjacency

Native graph databases such as Neo4j use a storage design called index-free adjacency: each node record points directly to its relationships, so moving from a node to its neighbors follows pointers instead of looking up an index. The cost of a traversal depends on how much of the graph it touches, not on the total size of the database. Not every graph database stores data this way; some build graph models on top of key-value or relational storage and still perform well, so benchmark on your own queries.

## Labeled Property Graphs

Most graph databases use the labeled property graph model, where both nodes and edges carry labels and properties. In a supply chain graph, `Factory_A` and `Warehouse_B` are nodes, and a `SHIPS_TO` edge between them can carry `cost`, `distance`, and `transit_days`. Path algorithms such as Dijkstra's shortest path then use those edge properties directly.

Query languages include Cypher (and its open variant openCypher), Gremlin, and GQL, which ISO published as the international standard ISO/IEC 39075 in April 2024.

## Common Uses

1. **Fraud detection:** fraud rings often show up as cycles or tight clusters of accounts, devices, and addresses. Graph queries find those patterns with short, readable queries.
2. **Recommendations:** "people who bought this also bought" and similar traversals.
3. **Knowledge graphs for AI:** a [knowledge graph](/knowledgebase/knowledge-graph/) gives an LLM structured, verified relationships to retrieve, an approach often called [GraphRAG](/knowledgebase/graphrag/). This can reduce hallucinations on relationship questions, but it does not eliminate them.

## Graph Database vs Graph Queries on Iceberg

Graph structure often already exists in lakehouse tables: a `users` table and a `transactions` table are nodes and edges. You can copy that data into a graph database, or query it as a graph where it sits.

| | Dedicated graph database | Graph engine over [Iceberg](/knowledgebase/apache-iceberg/) tables |
|---|---|---|
| Data location | Loaded into the graph store | Stays in Iceberg tables on object storage |
| Freshness | Depends on the sync pipeline | Same as the tables |
| Traversal speed | Optimized storage for deep, frequent traversals | Depends on the engine's caching and indexing |
| Writes | Transactional graph updates | Writes go to tables through normal pipelines |
| Example | Neo4j, Neptune, TigerGraph | PuppyGraph maps Iceberg tables to nodes and edges and accepts openCypher and Gremlin |

A dedicated graph database fits applications that update and traverse the graph constantly. Querying Iceberg as a graph fits analysts and AI agents who need relationship questions answered over data that already lives in the lakehouse, without another copy to govern. For how graphs show up in AI systems more broadly, read [Graphs in AI Engineering](/blog/graphs-in-ai-engineering/).

## Summary

Graph databases store relationships as first-class data, which makes multi-hop traversal fast and queries short. They are a strong fit for fraud, recommendations, and knowledge graphs. In a lakehouse, you can also run graph queries over Iceberg tables directly and decide case by case whether a separate graph store is worth the extra copy.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
