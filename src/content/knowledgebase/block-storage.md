---
title: "What is Block Storage?"
meta_title: "What is Block Storage? | Expert Data Lakehouse Architecture Guide"
description: "A comprehensive guide to Block Storage. Learn how bare-metal storage provides the ultra-low latency required for live transactional databases."
---

# What is Block Storage?

Block Storage is a high-performance, foundational data storage architecture engineered explicitly for ultra-low latency and incredibly fast, high-volume transactional workloads. It is the storage mechanism that physically mounts directly to a computing server (like a local hard drive or a Cloud SSD). While Object Storage (like Amazon S3) is designed to hold massive, petabyte-scale historical files for analytical data lakes, Block Storage (like Amazon EBS or Azure Managed Disks) is designed strictly to power the live, rapidly mutating operational databases (OLTP) and active operating systems of the enterprise.

To understand Block Storage, one must understand how a computer writes data. If a massive, 10-Gigabyte database file is resting on a server, and a single user logs in to update their email address, the computer must physically rewrite that data to the disk. 

If the database was stored on Object Storage, the system would have to download the entire 10-GB object over the network, change the single email address in memory, and re-upload the entire 10-GB object back to the cloud. This would take minutes.

## The Architecture of the Block

Block Storage solves this by physically shattering the 10-GB database file into millions of tiny, evenly sized mathematical chunks called "Blocks" (typically 4KB or 8KB in size). 

These blocks are written directly to the bare-metal hard drive. The server’s operating system manages a highly complex internal map that tracks exactly which blocks belong to which file.

When the user updates their email address, the operating system consults its map. It identifies the exact, specific 4KB block on the hard drive that contains the email string. It physically overwrites only that single, microscopic block, leaving the other 9.99 Gigabytes of data completely untouched. The update occurs in microseconds. 

## Use Cases and Limitations

Because Block Storage allows for surgical, sub-millisecond updates, it is the absolute mandatory storage requirement for:
* **Relational Databases (OLTP):** Live PostgreSQL, Oracle, and MySQL instances require block storage to ensure ACID compliance and handle millions of concurrent writes.
* **Operating Systems:** The boot drives of virtual machines and Kubernetes worker nodes require the low latency of block storage to function.

### The Scaling Limitation
The primary limitation of Block Storage is its severe physical coupling. A block storage volume must be physically "attached" to a specific server. It cannot be accessed over the internet via a REST API like Object Storage. 

If an operational database fills up its 1-Terabyte block storage drive, the system will crash. The engineering team must manually provision a larger drive, detach the old one, and attach the new one. This physical rigidity makes Block Storage fundamentally incompatible with the infinitely elastic, massive-scale requirements of a Data Lakehouse, which is why Lakehouses rely exclusively on Object Storage.

## Summary of Technical Value

Block Storage is the high-speed, bare-metal storage architecture of the operational enterprise. By shattering massive files into tiny, individually updatable chunks, it completely eliminates the massive I/O bottlenecks of file manipulation. While it lacks the infinite scalability of cloud Object Storage, its ability to execute surgical, sub-millisecond data mutations makes it the non-negotiable foundation for live transactional databases and mission-critical software systems.

## Learn More
To learn more about the Data Lakehouse, read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
