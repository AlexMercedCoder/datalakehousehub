---
title: "What is Data Gravity?"
meta_title: "What is Data Gravity? | Expert Data Lakehouse & AI Glossary"
description: "Data gravity is the idea that large datasets attract applications, services, and more data around them, making that data harder and costlier to move over time."
---

Data gravity is the observation that as a body of data grows, it pulls applications, services, and more data toward it, and it becomes harder and more expensive to move. Dave McCrory introduced the term in a December 2010 post on his Data Gravitas blog, using the analogy of mass in physics: the larger the dataset, the stronger its pull, and data large enough "can be virtually impossible to move." Latency and throughput are what create the pull, because applications run faster and cheaper when they sit near the data they use.

## How It Works

Several forces combine to make data gravity real in day-to-day architecture:

- **Network latency.** Applications that issue many small requests against data perform better in the same region or data center.
- **Transfer cost and time.** Copying petabytes across regions or clouds takes time and often incurs egress fees from the provider.
- **Dependent services.** Once pipelines, BI tools, ML jobs, and governance tooling are built around one store, each new workload tends to land next to them.
- **Policy.** Data residency rules and contracts can pin data to a location regardless of technical preference. McCrory has described these outside forces, along with pricing and throttling, as artificial data gravity.

The result is a feedback loop. Data attracts applications, applications generate more data, and the location becomes a default that is hard to change.

## Effects on Architecture

| Effect | What it looks like | Common response |
|---|---|---|
| Lock-in | Moving off a platform means copying everything first | Keep data in open formats you control |
| Duplication | Each tool keeps its own copy near its compute | Share one copy through a common table format |
| Egress cost | Cross-region and cross-cloud reads are billed | Place compute in the same region as storage, cache hot data |
| Slow migrations | Projects stall on the data move | Migrate metadata or query in place before moving files |

## Data Gravity and the Lakehouse

The lakehouse is partly a response to data gravity. Rather than fighting the pull of a large dataset by copying it into each tool, a lakehouse lets data settle once on object storage in open formats like Apache Parquet and [Apache Iceberg](/knowledgebase/apache-iceberg/), then brings many engines to it. Dremio, Trino, Spark, Flink, and DuckDB can all read the same Iceberg tables through a shared catalog such as Apache Polaris, so the data's pull no longer ties you to one vendor's compute. This is what [separating storage from compute](/blog/iceberg-storage-compute-decoupling/) buys you.

Gravity still applies to where that storage lives. Running a query engine in a different cloud region from the bucket adds latency and transfer cost, which is why most deployments place engines in the same region as the data and use caching for frequently read files. When data is spread across systems that cannot be consolidated, [data federation](/knowledgebase/data-federation/) lets an engine query each source in place and push filters down to it, instead of moving everything into one store first.

Reducing [vendor lock-in](/knowledgebase/vendor-lock-in/) is closely related: data gravity becomes lock-in when the format, catalog, or storage that holds your data only works with one vendor's tools.

## Summary

Data gravity describes why large datasets attract compute and resist moving. You cannot remove it, but you can choose where it settles. Keeping data in open table formats on storage you control, and bringing interchangeable engines to that data, turns gravity into an advantage instead of a trap.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
