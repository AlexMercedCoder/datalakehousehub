---
title: "What is Data Contracts?"
meta_title: "What is Data Contracts? | Expert Data Lakehouse & AI Glossary"
description: "A data contract is an agreement between data producers and consumers on schema, quality, and ownership, meant to stop changes breaking downstream analytics."
---

A data contract is a formal, versioned agreement between the team that produces a dataset and the teams that consume it. It states what the data looks like (schema and types), what it means (field definitions), how good it must be (quality rules), how fresh and available it will be (service levels), and who owns it. The purpose is to make breaking changes visible and deliberate, so a renamed column in an upstream application does not silently break a dashboard, a model, or an AI agent downstream.

## What a Contract Contains

Data contracts are usually written as YAML or JSON files stored in version control next to the producer's code. The Open Data Contract Standard (ODCS), maintained by the Bitol project, is one widely used specification. Its sections cover fundamentals, schema, data quality, support channels, pricing, team, roles, service-level agreements, and servers. A typical contract includes:

- **Schema.** Table and column names, types, nullability, and keys.
- **Semantics.** Business definitions and units, such as whether `amount` is gross or net and in which currency.
- **Quality rules.** Checks such as uniqueness of `order_id`, allowed values, or row-count expectations.
- **Service levels.** Freshness targets, update frequency, and retention.
- **Ownership and access.** The accountable team, support channel, and who may read the data.
- **Version.** Changes that break consumers get a new major version and a migration window.

## How It Works in Practice

A contract only helps if something enforces it. Common enforcement points are:

1. **At design time.** A pull request that changes a producer's schema runs a check against the contract and fails if it would break consumers.
2. **At ingestion.** Pipelines validate incoming data against the schema and quality rules and route bad records aside instead of loading them.
3. **At publish time.** Data lands in a staging area, is tested, and becomes visible to consumers only if it passes.
4. **At run time.** Monitoring compares actual freshness and quality to the promised service levels and alerts the owner.

| Approach | What it covers | Limitation |
|---|---|---|
| Schema registry | Message schema compatibility for event streams | Says little about meaning, quality, or freshness |
| Data quality tests | Checks on loaded data | Usually written by consumers after the fact |
| Data contract | Schema, semantics, quality, SLAs, ownership in one agreement | Requires producer buy-in and tooling to enforce |

## Data Contracts in the Lakehouse

In a lakehouse, contracts usually attach to the boundary between layers of the [medallion architecture](/knowledgebase/medallion-architecture/), and especially to the gold tables that other teams depend on. Apache Iceberg supplies several building blocks. Its schema evolution rules make additive changes safe, its column IDs keep renames from breaking readers, and its branching support enables a [write-audit-publish](/knowledgebase/write-audit-publish/) flow in which new data is written to a branch, validated against the contract, and then published to the main branch in one atomic commit.

Catalogs such as Apache Polaris and query engines such as Dremio add the access side, enforcing who can read a contracted table. A semantic layer extends the idea from tables to metrics: when a metric like "active customer" is defined once and every BI tool or AI agent uses that definition, the definition itself works as a contract. The Hub covers this in [metric contracts](/blog/metric-contracts-2026/) and in [freshness as a contract](/blog/freshness-as-a-contract/).

For the adjacent tooling, see the [schema registry](/knowledgebase/schema-registry/) and [data quality](/knowledgebase/data-quality/) entries.

## Summary

A data contract turns the implicit expectations between data producers and consumers into a versioned, testable document. It works when it is enforced in CI, at ingestion, and at publish time, and in a lakehouse it pairs well with Iceberg schema evolution, branch-based publishing, and semantic-layer metric definitions.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
