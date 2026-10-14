---
title: "Apache ZooKeeper: What It Does and Whether Your Lakehouse Needs It"
meta_title: "Apache ZooKeeper vs KRaft: Do Lakehouses Need It? | Glossary"
description: "Apache ZooKeeper is a coordination service for distributed systems. See what it does, why Kafka replaced it with KRaft, and which lakehouse tools still use it."
---

Apache ZooKeeper is an open source coordination service for distributed systems. It stores small pieces of shared state, such as configuration, membership, and leader information, and gives every client a consistent view of that state. It was developed at Yahoo! Research and became a top-level Apache project in 2010, where it is still actively maintained.

Distributed systems need agreement. When a primary server fails, the rest of the cluster must agree on a single replacement, or two servers may both act as leader (a "split brain") and write conflicting data. ZooKeeper gives applications building blocks for leader election, locks, and group membership so they do not have to implement consensus themselves.

## The ZNode Data Model

ZooKeeper organizes data in a hierarchical namespace that looks like a file system. Each node is called a znode and holds a small amount of data, limited to about 1 MB by default and usually far less. The full data tree is kept in memory for fast reads, while a transaction log and periodic snapshots on disk make it durable.

### Ephemeral Nodes and Watches
An ephemeral znode exists only as long as the client session that created it. Clients keep sessions alive with heartbeats. If a server crashes and its session times out, ZooKeeper deletes its ephemeral znodes automatically. Other clients can set watches on znodes and are notified when they change, which is how a cluster learns that a member has gone away and reassigns its work.

## The Zab Protocol

ZooKeeper runs as an ensemble, typically of three or five servers. Writes go to the leader, which uses the Zab (ZooKeeper Atomic Broadcast) protocol to propose them to followers. A write commits once a majority (a quorum) acknowledges it. With five servers, the ensemble keeps working with two failed, and a minority partition cannot accept writes, so the cluster never splits into two conflicting histories.

## The Shift Away from ZooKeeper

For years ZooKeeper was a required dependency of many big data systems: HDFS NameNode automatic failover, HBase, SolrCloud, and Apache Kafka. Kafka originally kept all cluster metadata in ZooKeeper (consumer offsets moved into an internal Kafka topic as early as version 0.9).

Running a separate ensemble added operational work: another cluster to secure, size, monitor, and upgrade. Kafka addressed this with KRaft, a Raft-based metadata quorum built into Kafka itself. KRaft became production ready in Kafka 3.3, and Kafka 4.0, released in March 2025, removed ZooKeeper support entirely. Existing ZooKeeper-based clusters must migrate to KRaft on 3.9 before upgrading to 4.x.

## Does a Lakehouse Need ZooKeeper?

Usually not. The core of an open lakehouse does not depend on it, though some surrounding systems still do.

| Component | ZooKeeper required? |
|---|---|
| [Apache Iceberg](/knowledgebase/apache-iceberg/) tables and REST catalogs such as [Apache Polaris](/knowledgebase/apache-polaris/) and Project Nessie | No; commits use the catalog's atomic swap, backed by a database |
| Query engines: Trino, Dremio, Spark, DuckDB | No for normal operation (Spark standalone and Flink can optionally use it for high availability) |
| [Apache Kafka](/knowledgebase/apache-kafka/) 4.0 and later | No; KRaft only |
| Apache Kafka 3.x and earlier | Yes, unless running in KRaft mode |
| [Apache Pinot](/knowledgebase/apache-pinot/) | Yes, through Apache Helix |
| [Apache Druid](/knowledgebase/apache-druid/) | Yes by default; a Kubernetes-based alternative exists as an extension |
| HDFS high availability, HBase, HiveServer2 high availability | Yes |

If you are building a new lakehouse on object storage, Iceberg, and a REST catalog, you can likely avoid running ZooKeeper at all. If you operate Hadoop-era systems or real-time OLAP databases, plan for it. For the Kafka side of this change, see [Kafka 4.0 Changes Streaming Platform Operations](/blog/2026-05-kafka-streaming-operations/), and for the consensus algorithms behind both ZooKeeper and KRaft, see [Paxos and Raft Consensus](/knowledgebase/paxos-and-raft-consensus/).

## Summary

Apache ZooKeeper provides consistent shared state, ephemeral membership, and leader election for distributed systems through a quorum-replicated namespace. Kafka has moved to KRaft, and modern lakehouse catalogs and engines do not need it, but it remains part of HDFS, HBase, Pinot, Druid, and other systems many teams still run.


## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
