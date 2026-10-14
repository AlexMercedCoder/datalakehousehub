---
title: "What is Distributed Computing?"
meta_title: "What is Distributed Computing? | Expert Data Lakehouse Architecture Guide"
description: "Distributed computing splits one workload across many networked machines. Covers master-worker clusters, fault tolerance, and the cost of data shuffling."
---

# What is Distributed Computing?

Distributed Computing is the architectural approach that underpins much of the modern internet, cloud infrastructure, and the Open [Data Lakehouse](/data-lakehouse/). It is the practice of taking a single, very large computational problem (like searching billions of web pages, or executing a SQL aggregation across a petabyte of Apache Parquet files) and splitting it into many smaller tasks. These tasks are executed in parallel across many separate servers, which together behave like a single, much more powerful computer.

Historically, if an enterprise ran out of database capacity, they were forced into Vertical Scaling (Scaling Up). They had to replace their existing server with a far more expensive machine with faster CPUs. Eventually, there is a practical limit on how large and fast a single machine can be. 
Distributed Computing introduced Horizontal Scaling (Scaling Out). Instead of buying one very large machine, an organization uses many inexpensive "commodity" servers that fail more often individually. The distributed software coordinates them so the servers work together in parallel.

## The Architecture of the Cluster

A Distributed Computing environment (commonly called a Cluster) is defined by its ability to manage physical complexity and expected hardware failure.

### 1. The Master-Worker Node Topology
Many distributed data engines (Apache Spark, Trino) and orchestration platforms like Kubernetes use a coordinator and worker (master-worker) topology.
* **The Master Node (The Brain):** The coordinator. It does little of the heavy data processing. When it receives a SQL query, it parses and analyzes the query, generates an execution plan, and assigns which Worker Node will process which chunk of the data.
* **The Worker Nodes (The Brawn):** The servers that do the actual processing. They process their chunks of data in parallel and return partial results that are combined and sent back through the coordinator.

### 2. Fault Tolerance and Self-Healing
A major challenge of Distributed Computing is hardware failure. If you run a cluster of thousands of servers, some component, such as a disk or power supply, will fail regularly.
A distributed system must be Fault Tolerant. If Worker Node #42 fails halfway through a large job, the Master Node detects the missed heartbeat. Instead of failing the whole job, engines like Spark reassign the work assigned to Node #42 to another node. The job finishes, and the user may only notice a delay. (Some engines, like Trino in its default mode, fail the query instead and rely on retries; Trino offers fault-tolerant execution as an option.)

## The Network Bottleneck (Data Shuffling)

The main weakness of Distributed Computing is the network. 

If Worker Node A possesses the Customer names, and Worker Node B possesses the Customer purchases, and the SQL query demands a `JOIN`, the servers must send large amounts of data to each other across the network (a process called the "Shuffle"). 
Transferring data over the network is much slower than reading data from local RAM. Therefore, a large part of performance tuning involves minimizing network Shuffling, so that worker nodes do as much work locally as possible before exchanging data.

## Summary of Technical Value

Distributed Computing is the mechanism that moved computing past the limits of a single machine. By coordinating many inexpensive, independent servers into a fault-tolerant parallel execution engine, distributed architectures (like Apache Spark and Trino) provide the computational scale needed to train modern artificial intelligence and run fast analytics across a multi-petabyte Data Lakehouse.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
