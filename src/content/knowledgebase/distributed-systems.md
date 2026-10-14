---
title: "What is Distributed Systems?"
meta_title: "What is Distributed Systems? | Data Lakehouse Hub Knowledge Base"
description: "A distributed system is a set of networked computers that act as one. Covers horizontal scaling, fault tolerance, distributed computing fallacies, and state."
---

# What is Distributed Systems?

## Introduction to Distributed Systems

In the 1990s, if a company's database ran out of storage space, the IT department had only one solution: **Vertical Scaling** (Scaling Up). They had to replace the server with a larger, far more expensive machine from a vendor like IBM or Sun. 

Eventually, companies like Google and Amazon hit a practical limit. No single machine was large or affordable enough to index the web.

The solution was the **Distributed System** (Horizontal Scaling or Scaling Out). A Distributed System is a network of independent, relatively cheap computers (nodes) that communicate with each other via network messages to appear to the end-user as a single, unified system.

## The Core Advantages

Distributed systems form the backbone of modern cloud computing and Big Data architectures (like [Apache Hadoop](https://datalakehousehub.com/knowledgebase/hadoop/), [Apache Spark](https://datalakehousehub.com/knowledgebase/apache-spark/), and [Amazon S3](https://datalakehousehub.com/knowledgebase/amazon-s3/)).

1.  **Horizontal Scalability**: If a distributed database (like Apache Cassandra) reaches its storage limit, you do not buy a bigger server. You add another commodity server to the cluster, and the software redistributes data and load across the new node. Capacity grows by adding nodes.
2.  **Fault Tolerance (High Availability)**: In a single-server architecture, if the motherboard fails, the application goes offline. In a distributed system with 1,000 nodes, hardware failure is treated as a normal, expected event. The data is replicated. If Node 42 fails, the system routes queries to a replica on another node, and the end-user usually does not notice.

## The Fallacies of Distributed Computing

Building distributed systems is hard. In 1994, L. Peter Deutsch at Sun Microsystems described the "Fallacies of Distributed Computing" (James Gosling later added an eighth): false assumptions that engineers often make when transitioning from single-machine code to distributed code.

1.  **The Network is Reliable**: (It is not. Cables get unplugged, routers crash. Your code must handle lost messages).
2.  **Latency is Zero**: (It takes milliseconds for an electronic signal to travel from a server in New York to a server in Tokyo. Distributed databases must account for this physical delay).
3.  **Bandwidth is Infinite**: (Sending a 1TB file between two servers takes real time and network capacity).
4.  **The Network is Secure**: (Any node communicating over a network can be intercepted).

## Distributed Coordination

The hardest problem in distributed systems is **State**.
If Server A processes a customer's $50 deposit, how does Server B find out about it? If the user immediately tries to withdraw $50 from Server B before the message arrives from Server A, what happens?

To solve this, distributed systems rely on consensus algorithms (like Paxos or Raft) and coordination services (like Apache ZooKeeper or etcd) to manage leader election and locks, and to make nodes agree on shared state.

## Conclusion

Distributed Systems are the architectural compromise that enabled the modern internet. By giving up the simplicity and fast internal communication of a single machine, software engineers gained the ability to scale computational power and storage across thousands of commodity, redundant machines, creating the resilient, globe-spanning architectures of the modern [Data Lakehouse](https://iceberglakehouse.com/iceberg/data-lakehouse/).

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
