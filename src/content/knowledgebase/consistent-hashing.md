---
title: "What is Consistent Hashing?"
meta_title: "What is Consistent Hashing? | Data Lakehouse Hub Knowledge Base"
description: "Consistent hashing maps keys and servers onto a hash ring so adding or removing a node moves only a small share of keys. Virtual nodes balance the load."
---

# What is Consistent Hashing?

## Introduction to Consistent Hashing

When scaling a large web application, engineers often rely on distributed caches (like Memcached or Redis clusters) to store frequently accessed data in RAM, bypassing the slow main database.

If you have a large dataset of user profiles and 4 cache servers (Node 0, 1, 2, 3), how do you decide which server gets which user?
The naive approach is **Modulo Hashing**. You take the `User_ID`, run it through a basic hash function, and use the modulo operator (`%`) against the total number of servers:
*   `Hash(User_ID 10) % 4 Servers = Node 2`
*   `Hash(User_ID 11) % 4 Servers = Node 3`

This distributes the data evenly. 

**The Failure Case:**
What happens if Node 2 crashes? 
You now only have 3 servers. The formula changes.
*   `Hash(User_ID 10) % 3 Servers = Node 1`
*   `Hash(User_ID 11) % 3 Servers = Node 2`

Because the divisor changed, *most keys* are suddenly mapped to a different server. Most of the cache is effectively invalidated at once. A flood of requests bypasses the cache and hits the main database at the same time, which can overload it. This is known as a **Cache Stampede**.

**Consistent Hashing** is an algorithm designed to solve this problem.

## How Consistent Hashing Works: The Hash Ring

Instead of mapping data directly to the number of available servers, Consistent Hashing maps both the Data AND the Servers onto an abstract, circular ring (The Hash Ring).

Imagine a circle representing all possible hash values from `0` to `359` (like degrees on a compass).

1.  **Place the Servers**: The algorithm hashes the IP addresses of the 4 cache servers and places them on the ring (e.g., Node 0 is at 0°, Node 1 is at 90°, Node 2 is at 180°, Node 3 is at 270°).
2.  **Place the Data**: The algorithm hashes `User_ID 10`. Let's say it lands at 100°.
3.  **The Routing Rule**: To find out which server holds the data, the algorithm starts at the data's location (100°) and walks clockwise around the ring until it bumps into the very first server it finds. In this case, walking clockwise from 100°, the first server is Node 2 (at 180°). 

### Handling Node Failure
What happens if Node 2 (180°) crashes?
Node 2 is removed from the ring.
`User_ID 10` is still located at 100°. The algorithm walks clockwise. Because Node 2 is gone, it continues walking until it hits Node 3 (at 270°). 

**Crucially, the data assigned to Node 0 and Node 1 did not move.**
When a server crashes (or a new server is added) in a Consistent Hashing system, only the keys owned by that specific server on the ring need to be remapped. The rest of the cluster is unaffected. 

## Virtual Nodes (VNodes)

There is one flaw with basic Consistent Hashing: **Uneven Distribution**.
If you only have 3 servers, they might randomly hash close together on the ring (e.g., 10°, 20°, 30°). This means Server 1 handles the traffic for most of the circle, while Server 2 and 3 sit idle.

To fix this, modern systems use **Virtual Nodes**. 
Instead of placing Server A on the ring once, the algorithm hashes Server A many times with slight variations (A1, A2, A3...), scattering many "Virtual Nodes" around the ring. It does the same for Server B and C. 
This spreads the data load much more evenly across the physical hardware.

## Conclusion

Consistent Hashing is a widely used algorithm in distributed systems. By decoupling the routing logic from the total count of active servers, it allows distributed databases (like Apache Cassandra, and the Dynamo design that inspired Amazon DynamoDB) to add or remove hardware while moving only a fraction of the data, instead of triggering system-wide data migrations.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
