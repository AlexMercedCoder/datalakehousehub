---
title: "What is CQRS?"
meta_title: "What is CQRS? | Expert Data Lakehouse & AI Glossary"
description: "CQRS (Command Query Responsibility Segregation) is a design pattern that separates the operations that write data from those that read it, so each scales alone."
---

CQRS (Command Query Responsibility Segregation) is a software design pattern that uses one model to change data and a separate model to read it. Commands (place order, cancel subscription) go through a write model designed to enforce business rules. Queries (show my order history, revenue by region) go through one or more read models shaped for the questions being asked. Martin Fowler credits Greg Young as the person he first heard describe the pattern, and the name follows the older Command Query Separation principle for methods.

## How It Works

A CQRS system has two sides joined by a synchronization path:

1. **Command side.** A client sends a command. The write model validates it against the current state, applies the change, and records it, often in a normalized relational database or an event store.
2. **Propagation.** Each change produces a notification, typically an event such as `OrderPlaced`. A message broker, an outbox table, or [change data capture](/knowledgebase/change-data-capture/) carries those changes onward.
3. **Query side.** Projectors consume the changes and update read models: denormalized tables, search indexes, caches, or analytical tables. Queries never touch the write model.

Because the read side is updated after the write commits, CQRS systems are usually **eventually consistent**. A user may submit a change and briefly see the old value on a read screen, and the application has to be designed for that gap.

CQRS is frequently paired with [event sourcing](/knowledgebase/event-sourcing/), where the write model stores the full sequence of events and read models are built by replaying them. The two patterns are independent, though: a CQRS system can use an ordinary database on the write side.

## When It Fits and When It Does Not

Fowler cautions that for most systems CQRS "adds risky complexity" and that it should be applied to specific bounded contexts, not to a whole application. It earns its keep when read and write workloads differ sharply in shape or scale, when several very different views of the same data are needed, or when the domain logic on the write side is complex enough to deserve its own model.

| Aspect | Single shared model (CRUD) | CQRS |
|---|---|---|
| Models | One schema for reads and writes | Separate write and read models |
| Consistency | Reads see writes right away | Read models lag behind writes |
| Scaling | Reads and writes scale together | Each side scales and is tuned on its own |
| Complexity | Lower | Higher: projections, messaging, replays |
| Good fit | Most business applications | High read/write asymmetry, many distinct views |

## CQRS and the Lakehouse

A data lakehouse is, in effect, a large read model. Operational systems handle commands and keep normalized transactional state. Changes stream out through CDC or event logs into [Apache Iceberg](/knowledgebase/apache-iceberg/) tables, and engines such as Dremio, Trino, Spark, or DuckDB answer analytical queries against those tables without adding load to the operational database. The medallion layers map onto CQRS projections: bronze holds raw change events, silver holds cleaned current-state tables, and gold holds the query-shaped models that dashboards and AI agents read. A semantic layer on top plays the role of a curated read API.

The Hub's guide to [Iceberg CDC pipelines](/blog/2026-05-iceberg-cdc-pipelines/) shows how changes move from the write side into lakehouse tables.

## Summary

CQRS separates the model that changes data from the models that serve reads, trading simplicity for independent scaling and query-shaped views. Use it where the read and write needs truly diverge, and expect eventual consistency between the two sides.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
