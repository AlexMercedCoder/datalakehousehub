---
title: "What is Event Sourcing?"
meta_title: "What is Event Sourcing? | Expert Data Lakehouse & AI Glossary"
description: "Event sourcing is a design pattern that records every state change as an event in an append-only log, so current state is rebuilt by replaying those events."
---

Event sourcing is a design pattern in which an application stores every change to its state as an immutable event in an append-only log, and treats that log as the source of truth. The current state of an account, order, or device is not stored directly as the primary record. It is derived by replaying the events for that entity in order. Martin Fowler summarized the pattern in 2005 as capturing "all changes to an application state as a sequence of events."

## How It Works

Consider a bank account. A traditional system keeps one row with the current balance and overwrites it on every transaction. An event-sourced system records facts instead:

1. `AccountOpened(id=42)`
2. `MoneyDeposited(id=42, amount=100)`
3. `MoneyWithdrawn(id=42, amount=30)`

The balance of 70 is computed by applying those events in sequence. Core mechanics include:

- **Append-only event store.** Events are written once and never edited. Mistakes are corrected with new compensating events, such as `DepositReversed`.
- **Rebuilding state.** Any entity's state can be reconstructed by replaying its events from the beginning.
- **Snapshots.** Replaying long histories is slow, so systems periodically save the computed state and replay only the events after the latest snapshot.
- **Projections.** Consumers subscribe to the event stream and maintain read-optimized views, which is why event sourcing is often combined with [CQRS](/knowledgebase/cqrs/).

Fowler lists the capabilities this enables: complete rebuilds of state, temporal queries that show state as of any past point, and event replay to correct or reprocess history.

## Event Sourcing vs State-Based Storage

| Aspect | State-based (CRUD) | Event-sourced |
|---|---|---|
| What is stored | Current state, overwritten on change | Every change as an event |
| History | Lost unless separately audited | Kept by design |
| Reading current state | Direct lookup | Replay or read a projection |
| Schema change | Migrate the table | Version events and handle old versions on replay |
| Complexity | Lower | Higher: event design, versioning, projections |

Event sourcing is a good fit where history matters for its own sake, such as finance, logistics, and audit-heavy domains. It adds overhead where only the current state is ever needed.

## Event Sourcing and the Lakehouse

Event-sourced systems and lakehouses fit together naturally. The event log, often held in [Apache Kafka](/knowledgebase/apache-kafka/) or a dedicated event store, can be streamed into Apache Iceberg tables with Kafka Connect, Flink, or Spark. In a medallion design, the bronze layer stores the raw, append-only events, and silver and gold tables are projections built from them, such as current account balances or daily transaction totals. If projection logic changes, those tables can be rebuilt by replaying the bronze events.

Iceberg itself follows a related idea at the table level. Every commit produces a new [snapshot](/knowledgebase/iceberg-snapshot/), and engines such as Dremio, Spark, and Trino can query a table as of an earlier snapshot through [time travel](/knowledgebase/time-travel/). The difference is that Iceberg records table versions, not business events, so it complements an event log rather than replacing one.

The Hub post on [data modeling for events and entities](/blog/2024-10-data-modeling-events-entities/) covers how to model event tables alongside entity tables for analytics.

## Summary

Event sourcing stores state as an ordered log of immutable events and derives current state by replay. It gives full history, temporal queries, and rebuildable read models, at the cost of more design work. Paired with a lakehouse, the event log becomes the raw layer from which analytical tables are projected.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
