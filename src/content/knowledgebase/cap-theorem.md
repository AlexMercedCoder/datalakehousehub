---
title: "What is CAP Theorem?"
meta_title: "What is CAP Theorem? | Data Lakehouse Hub Knowledge Base"
description: "The CAP Theorem is the foundational mental model for data engineering architecture. It proves that there is no such thing as a 'perfect' distributed database."
---

# What is CAP Theorem?

## Introduction to the CAP Theorem

When building a distributed database across multiple servers, engineers want three things:
1. They want every server to return the same, latest data.
2. They want the database to answer every query.
3. They want the database to survive if the network cables between the servers are cut.

In 2000, computer scientist Eric Brewer proposed the **CAP Theorem** as a conjecture, and Seth Gilbert and Nancy Lynch published a formal proof in 2002. The theorem states a hard limit of distributed computing: 

**A distributed data store cannot guarantee all THREE of the following properties at the same time:**

*   **Consistency (C)**
*   **Availability (A)**
*   **Partition Tolerance (P)**

## The Three Properties Explained

### 1. Consistency (C)
Consistency means that every read request receives the most recent write (or an error). 
If a user updates their password on Server A, and one millisecond later tries to log in using Server B, Server B *must* know the new password. If Server B hasn't received the update yet, it must refuse to answer until it is synchronized.

### 2. Availability (A)
Availability means that every request to a non-failing node receives a non-error response. The database must answer, even if the answer is slightly outdated.

### 3. Partition Tolerance (P)
A "Partition" is a network failure. Server A and Server B are both online, but the internet connection between them is severed. They cannot talk to each other. Partition Tolerance means the database as a whole continues to function despite this network failure.

## The Choice: CP vs. AP

Because network failures (Partitions) happen in the real world (routers crash, cables break), a distributed system **must** be Partition Tolerant (P). 

Therefore, the CAP theorem dictates that when a network failure occurs, the database engineer must choose between Consistency (C) and Availability (A).

### CP Databases (Consistency + Partition Tolerance)
*   **Example**: HBase, MongoDB with majority read and write concerns, traditional Relational Databases configured for synchronous clustering.
*   **The Scenario**: The network breaks. Server A cannot talk to Server B. 
*   **The Choice**: The database chooses **Consistency**. Because Server B cannot verify if Server A just received new data, Server B refuses the request and returns an Error to the user. It sacrifices Availability so that it does not return stale data. This matters for banking and financial applications.

### AP Databases (Availability + Partition Tolerance)
*   **Example**: Apache Cassandra and Amazon DynamoDB in their default, eventually consistent modes.
*   **The Scenario**: The network breaks. Server A cannot talk to Server B.
*   **The Choice**: The database chooses **Availability**. If a user asks Server B for their account balance, Server B returns the balance it has on file, even though it might be outdated (stale). It sacrifices Consistency so the user still gets a response. This suits social media feeds and e-commerce shopping carts.

## Conclusion

The CAP Theorem is the foundational mental model for data engineering architecture. It shows that no distributed database can offer every property at once. Every database choice is a deliberate trade-off. Architects must understand the business requirements (whether the business can tolerate the website going down (CP), or whether it can tolerate displaying a slightly outdated number (AP)) before selecting the underlying storage technology.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
