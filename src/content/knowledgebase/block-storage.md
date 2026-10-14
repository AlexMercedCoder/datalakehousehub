---
title: "What is Block Storage?"
meta_title: "What is Block Storage? | Expert Data Lakehouse Architecture Guide"
description: "Block storage splits data into fixed-size blocks on a volume attached to one server. Learn why databases use it and why lakehouses use object storage instead."
---

# What is Block Storage?

Block Storage is a data storage architecture designed for low latency and high-volume transactional workloads. It is storage that a server uses as a disk volume (like a local drive or a cloud SSD volume). Object Storage (like Amazon S3) is designed to hold large volumes of files for analytical data lakes, while Block Storage (like Amazon EBS or Azure Managed Disks) is designed to back live, frequently changing operational databases (OLTP) and operating systems.

To understand Block Storage, consider how a database writes data. Suppose a 10 GB database file sits on a server and a user updates their email address. The system must write that change to disk.

If the database file were stored as a single object in Object Storage, changing it would mean writing a new version of the whole object, since objects are generally replaced as a unit rather than edited in place. That is far too slow for a transactional database.

## The Architecture of the Block

Block Storage divides data into fixed-size chunks called "Blocks" (file systems commonly use 4 KB blocks, and many databases use 8 KB pages).

The server's file system (or the database itself) keeps a map of which blocks belong to which file.

When the user updates their email address, the database finds the page that holds that row and writes only that page back to the volume, leaving the rest of the 10 GB file untouched. On SSD-backed volumes, such writes typically complete with sub-millisecond to low-millisecond latency.

## Use Cases and Limitations

Because Block Storage supports small, low-latency, in-place updates, it is the standard storage choice for:
* **Relational Databases (OLTP):** PostgreSQL, Oracle, and MySQL instances typically run on block storage, which supports their transaction logs and high rates of concurrent writes.
* **Operating Systems:** The boot volumes of virtual machines and Kubernetes worker nodes use block storage.

### The Scaling Limitation
The primary limitation of Block Storage is its coupling to compute. A block storage volume is attached to a specific server (or, with some volume types, a small number of servers). It is not accessed over a REST API the way Object Storage is.

Capacity must also be provisioned in advance. If a database fills its volume, writes fail until the team grows it. Cloud providers let you increase volume size, often without detaching, but someone still has to plan and pay for provisioned capacity. This coupling and provisioning model is why a [Data Lakehouse](/data-lakehouse/), which needs elastic, shared storage for many engines, relies primarily on Object Storage.

## Summary of Technical Value

Block Storage is the high-speed storage layer of operational systems. By dividing data into small, individually updatable blocks, it avoids rewriting large files for small changes. While it lacks the elastic scalability and shared access of cloud Object Storage, its low-latency in-place writes make it the standard foundation for transactional databases and other critical software systems.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
