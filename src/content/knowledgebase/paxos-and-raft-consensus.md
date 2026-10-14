---
title: "What is Paxos and Raft Consensus?"
meta_title: "What is Paxos and Raft Consensus? | Data Lakehouse Hub Knowledge Base"
description: "Paxos and Raft are consensus algorithms that let a server cluster agree on shared state despite failures. See how Raft's leader election powers etcd and Consul."
---

# What is Paxos and Raft Consensus?

## Introduction to Distributed Consensus

Imagine an army with 5 different generals, all camped on different hills surrounding an enemy city. They can only communicate by sending messengers running between the hills. 
To win the battle, all 5 generals must attack at the exact same time. If only 2 generals attack, they will lose. They must reach a **Consensus**. 

However, messengers can be killed (Network Packet Loss). A general might be a traitor (Byzantine Fault). A general might fall asleep (Server Crash). How can the generals be sure they all agree on the attack time, despite these failures?

This is the fundamental problem of [Distributed Systems](https://datalakehousehub.com/knowledgebase/distributed-systems/). If you have a database cluster of 5 servers, and a user tries to change their password, how do you make sure all 5 servers agree on the new password, even if a router fails during the transaction?

To solve this, computer science relies on **Consensus Algorithms**. Note that Paxos and Raft tolerate crashed servers and lost or delayed messages, but not traitors: handling Byzantine faults requires different algorithms, such as PBFT.

## Paxos: The Hard-to-Understand Pioneer

First written up by Leslie Lamport in 1989 and formally published in 1998 as "The Part-Time Parliament," **Paxos** became one of the most influential algorithms for reaching consensus in a distributed network with unreliable communication.

Paxos uses roles called "Proposers," "Acceptors," and "Learners." It runs phases of voting and message passing to ensure that once a majority (a Quorum) of nodes accepts a value, that value is chosen and cannot be changed, even with network failures.

*   **The Problem with Paxos**: Although proven correct, Paxos is known for being hard to understand and harder to implement. The original description covers agreement on a single value, and real systems need to extend it to a replicated log, so production implementations often diverge from the published algorithm in ways that are hard to verify.

## Raft: Consensus for Humans

Because Paxos was so difficult to implement, Diego Ongaro and John Ousterhout at Stanford University published the **Raft** consensus algorithm in 2014. 

Raft's stated goal was **Understandability**. Its authors describe it as equivalent to (multi-)Paxos in fault tolerance and performance, but structured so that engineers can understand and build it more easily.

Raft simplifies consensus by relying on **Leader Election**:
1.  **The Leader**: In a 5-node cluster, Raft holds an election. One node becomes the Leader. The other 4 become Followers.
2.  **The Single Writer**: All writes go to the Leader. If a user wants to change a password, they tell the Leader.
3.  **The Log Replication**: The Leader does not immediately save the password. It sends a message to the 4 Followers: *"I propose changing the password to '123'."*
4.  **The Quorum**: The Leader waits. Once a majority of the Followers (at least 2 out of 4) reply *"Acknowledged"*, the Leader permanently saves (commits) the password, and orders the Followers to do the same.

If the Leader fails, the Followers notice the missing heartbeats when an election timeout expires. They hold a new election, pick a new Leader, and normal operation resumes, typically within a fraction of a second to a few seconds depending on configuration.

## Real-World Implementations

Consensus algorithms add coordination overhead, so many systems use them mainly for the control plane: storing critical metadata and managing cluster state. Some distributed databases, such as CockroachDB and TiKV, also run Raft for each range of data.

*   **Apache ZooKeeper**: Uses a Paxos-like protocol (ZAB) to manage coordination and configuration for systems such as Hadoop and HBase. Apache Kafka used ZooKeeper until it replaced it with its own Raft-based KRaft mode, and Kafka 4.0 removed ZooKeeper support.
*   **etcd**: Uses the **Raft** algorithm. It is the standard backing store for [Kubernetes](https://datalakehousehub.com/knowledgebase/kubernetes/) cluster state.
*   **HashiCorp Consul**: Uses **Raft** for service discovery and configuration.

## Conclusion

Paxos and Raft are foundations of distributed computing. Without consensus, a strongly consistent multi-server database could not stay in agreement through network failures and server crashes. Paxos showed how to reach consensus safely, and Raft made it easier to implement, helping the open-source community build the fault-tolerant, self-healing systems that run much of the cloud.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
