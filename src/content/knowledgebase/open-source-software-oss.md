---
title: "What is Open-Source Software (OSS)?"
meta_title: "What is Open-Source Software (OSS)? | Data Lakehouse Hub Knowledge Base"
description: "Open-source software is code released under a license that lets anyone inspect, modify, and share it. See how OSS licenses and business models shape data tools."
---

# What is Open-Source Software (OSS)?

## Introduction to Open Source

In the 1980s and 1990s, much of the commercial software industry followed a proprietary model. Companies like Microsoft and Oracle wrote software code (source code), compiled it into an unreadable binary format, and sold it. If a user hit a serious bug, they could not fix it themselves; they had to wait for the vendor to release a patch. The source code was treated as a trade secret.

**Open-Source Software (OSS)** is a different approach to software development and intellectual property. It is software whose source code is made publicly available for anyone to inspect, modify, enhance, and distribute.

Today, much of the internet and most of the big data ecosystem (Linux, [Kubernetes](https://datalakehousehub.com/knowledgebase/kubernetes/), [Apache Spark](https://datalakehousehub.com/knowledgebase/apache-spark/), Python) are built on open-source software.

## The Power of the Open Source Model

Open source is not a charity; it is an engineering model with several practical advantages:

### 1. The Global Talent Pool
If a company builds a proprietary database, only its internal engineers can read the code. If it open-sources the database, developers anywhere can read, test, and improve it. 
When a security vulnerability is found in a widely used project, many people can help investigate and patch it. Eric S. Raymond summarized the idea as Linus's Law: *"Given enough eyeballs, all bugs are shallow."*

### 2. Faster Innovation and Standards
Proprietary products often use closed formats that make switching costly ([Vendor Lock-in](https://datalakehousehub.com/knowledgebase/vendor-lock-in/)). Open source encourages shared standards. Because developers would rather not write the same code twice, they collaborate on open-source foundations. 
For example, **[Apache Iceberg](https://iceberglakehouse.com/iceberg/iceberg-catalog/)** was created at Netflix and donated to the Apache Software Foundation, where engineers from Apple, Netflix, and many vendors now develop it as a shared open table format instead of each building their own.

## Open Source Licensing

"Open Source" does not mean "free of copyright." All open-source software is governed by specific legal licenses that define what a user can and cannot do with the code.

*   **Permissive Licenses (e.g., Apache 2.0, MIT)**: Business-friendly. A company can take MIT- or Apache-licensed code, modify it, include it in proprietary software, and sell it, as long as it keeps the required copyright and license notices.
*   **Copyleft Licenses (e.g., GNU GPL)**: More restrictive. A company can use the code for free, but if it distributes a modified version, it must release that version's source under the same license. This keeps derived works open.

## The Business of Open Source

If the code is free, how do open-source companies make money?

*   **Open Core Model**: The core software is free (e.g., [Apache Kafka](https://datalakehousehub.com/knowledgebase/apache-kafka/)), and a company such as Confluent sells proprietary add-ons or an enterprise edition with extra security features, management tools, and support.
*   **Managed Cloud Services**: The company gives the software away for free, and charges for running it as a managed cloud service, because operating it yourself takes real effort (e.g., [Databricks](https://opendatalakehouse.com/kb/databricks/) offering managed [Apache Spark](https://datalakehousehub.com/knowledgebase/apache-spark/), or [Dremio](https://opendatalakehouse.com/kb/dremio/) offering a managed lakehouse built on Apache Iceberg).

## Conclusion

Open-source software is one of the largest collaborative efforts in computing. By favoring transparent cooperation, the OSS model widened access to high-quality technology, so a student with a laptop can build applications with the same data infrastructure that large companies run in production.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
