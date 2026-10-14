---
title: "High Availability (HA) for a Data Lakehouse: Storage, Catalog, and Engines"
meta_title: "High Availability (HA) in a Data Lakehouse | Glossary"
description: "High availability means designing a system to stay up through failures by removing single points of failure. See how HA applies to storage, catalogs, engines."
---

High Availability (HA) is the practice of designing a system so it keeps serving requests when individual components fail. In practice that means finding every single point of failure (SPOF), adding redundancy for it, and automating failover so recovery does not wait for a person to wake up.

Availability targets are usually written as "nines":

| Target | Allowed downtime per year |
|---|---|
| 99% (two nines) | about 3.65 days |
| 99.9% (three nines) | about 8.8 hours |
| 99.99% (four nines) | about 53 minutes |
| 99.999% (five nines) | about 5.26 minutes |

Each extra nine costs more in redundancy and operations, so the right target depends on what downtime costs the business. Analytical platforms often run at three or four nines, while payment and trading systems aim higher.

## Building Blocks of HA

### 1. Redundancy Across Failure Domains
One server is never highly available. Cloud deployments spread replicas across several Availability Zones (AZs), which are separate data centers within a region with independent power and networking. If one AZ fails, replicas in the others keep serving traffic.

### 2. Health Checks and Automated Failover
Redundancy only helps if the system detects failure and switches over. In a PostgreSQL cluster managed by Patroni, the primary holds a leader lock in a distributed configuration store (etcd, Consul, or ZooKeeper). If the primary stops renewing the lock, a replica is promoted once the lock expires. With Patroni's defaults (a 30 second leader TTL and a 10 second loop), failover takes tens of seconds, and clients reconnect through a load balancer or virtual IP that points at the new primary.

### 3. HA Is Not Disaster Recovery
HA handles routine failures inside a region with little or no data loss. [Disaster recovery](/knowledgebase/disaster-recovery/) handles losing a whole region or corrupting data, and is measured by recovery point and recovery time objectives. You need both.

## The CAP Theorem Tradeoff

Distributed databases such as Cassandra and DynamoDB face the [CAP theorem](/knowledgebase/cap-theorem/): during a network partition, a system must choose between staying available and staying consistent. A system that keeps accepting writes on both sides of a partition stays available but lets the sides diverge, and has to reconcile conflicts when the network heals. A system that refuses writes on one side stays consistent but is partly unavailable.

## High Availability in a Lakehouse Stack

A lakehouse has several layers, and each has its own failure modes. Availability of the whole is limited by the weakest layer.

| Layer | What fails | Typical HA approach |
|---|---|---|
| Object storage (S3, ADLS, GCS) | Disks, racks, an AZ | Provider replicates across AZs; S3 Standard is designed for 99.99% availability with a 99.9% SLA |
| Catalog ([Apache Polaris](/knowledgebase/apache-polaris/), Nessie, Glue, Unity Catalog) | Catalog service or its database | Run several stateless catalog replicas behind a load balancer, backed by an HA database; managed catalogs handle this for you |
| Query engines (Dremio, Trino, Spark) | Coordinator or executor nodes | Executor failures retry tasks; check whether your engine supports coordinator failover |
| Streaming ingestion (Kafka, Flink) | Brokers, jobs | Replicated topics; Flink checkpoints so a restarted job resumes without duplicating Iceberg commits |

The catalog deserves the most attention. Every Iceberg read and commit goes through it, so a catalog outage stops queries even when storage is healthy. For cross-region designs, see [Disaster Recovery for Iceberg Tables](/blog/disaster-recovery-for-iceberg-tables/) and [Governing Iceberg Tables Across Regions](/blog/multi-region-catalog-federation/).

## Summary

High availability comes from redundancy across failure domains plus automated detection and failover. In a lakehouse, apply that thinking layer by layer: storage is usually the most available part, and the catalog and engine coordinators are where single points of failure tend to hide.

## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
