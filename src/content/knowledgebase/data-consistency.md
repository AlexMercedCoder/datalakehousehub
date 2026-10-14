---
title: "What is Data Consistency?"
meta_title: "What is Data Consistency? | Data Lakehouse Hub Knowledge Base"
description: "Data consistency is the guarantee about which version of data a reader sees across replicas. Covers the CAP theorem and strong versus eventual consistency."
---

# What is Data Consistency?

## Introduction to Data Consistency

When a user deposits $100 into their bank account via a mobile app, they expect to see their balance increase by $100 when they refresh the screen. If they refresh the screen and the balance hasn't changed, they will panic, assuming the bank lost their money.

In a single, monolithic database running on a single computer, this is straightforward to provide. When the transaction hits the hard drive, the data is updated.

However, in modern distributed systems, databases are often spread across many servers in several regions. If the user's deposit is processed by Server A in New York, it takes physical time (milliseconds to seconds) for Server A to copy that new data to Server B in London and Server C in Tokyo. 
**Data Consistency** is the set of rules a system follows for managing what happens if a user connects to Server B *before* the data finishes copying. 

## The CAP Theorem

Discussions around consistency in distributed systems are usually framed by the **[CAP Theorem](https://datalakehousehub.com/knowledgebase/cap-theorem/)** (Brewer's Theorem). It states that when a network partition occurs, a distributed data store must give up either consistency or availability. The three properties are:

1.  **Consistency (C)**: Every read receives the most recent write, or an error. If Server A is updated, you cannot read from Server B until Server B is identical to A.
2.  **Availability (A)**: Every request receives a non-error response, without the guarantee that it contains the most recent write. The system answers you, even if the answer is slightly outdated.
3.  **Partition Tolerance (P)**: The system continues to operate despite an arbitrary number of messages being dropped or delayed by the network between nodes (e.g., the internet cable between NY and London is cut).

Because network partitions (P) cannot be ruled out in practice, distributed systems must choose between prioritizing Consistency (CP architectures) or Availability (AP architectures).

## Strong vs. Eventual Consistency

This choice leads to two common database designs.

### Strong Consistency (CP)
In a Strongly Consistent system (like traditional Relational Databases or Google Spanner), the database prioritizes correctness over availability. 
If the network connection between NY and London breaks during a transaction, the database may refuse to answer read requests in London. It returns an error rather than risk showing the user an outdated bank balance. 
*   **Pros**: Every read reflects the latest committed write. Commonly required for financial ledgers and inventory management (you can't sell the same seat on an airplane twice).
*   **Cons**: Slower performance (writes wait for replicas to agree) and lower availability during network outages.

### Eventual Consistency (AP)
In an Eventually Consistent system (like Apache Cassandra or Amazon DynamoDB in their default read modes), the database prioritizes uptime and speed.
If the NY server updates a profile picture, it immediately tells the user "Success!" and tries to sync with London in the background. If a user in London checks the profile a millisecond later, the London server may return the *old* profile picture. It prioritizes giving an answer quickly. The system's promise is that, eventually, if no new updates are made, all servers will converge on the correct data.
*   **Pros**: Lower latency and higher availability. A good fit for social media (it doesn't matter if you see a "Like" on a post 2 seconds later than someone else).
*   **Cons**: Developers must write defensive code to handle reads of stale data.

## Consistency in the Data Lakehouse

Historically, [Amazon S3](https://datalakehousehub.com/knowledgebase/amazon-s3/) (the foundation of the Data Lake) was only *Eventually Consistent*. If you wrote a file to S3 and immediately tried to list the files in the bucket, S3 might not show you the new file. This made building transactional systems on S3 difficult.

In December 2020, AWS upgraded S3 to provide **Strong Read-After-Write Consistency**. This change, combined with the ACID guarantees provided by [Open Table Formats](https://opendatalakehouse.com/kb/open-table-formats/) like **[Apache Iceberg](https://iceberglakehouse.com/iceberg/iceberg-catalog/)**, allowed the [Data Lakehouse](https://iceberglakehouse.com/iceberg/data-lakehouse/) to provide consistency similar to a traditional Data Warehouse, so that business analysts do not query a half-written dataset.

## Conclusion

Data Consistency is a central architectural tradeoff in distributed computing. Engineers must carefully evaluate the business use case before selecting a database. Building a banking app on an Eventually Consistent database risks financial errors, while building a global social media feed on a Strongly Consistent database can lead to slower load times. Understanding where a system falls on the CAP spectrum is essential for designing reliable data infrastructure.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
