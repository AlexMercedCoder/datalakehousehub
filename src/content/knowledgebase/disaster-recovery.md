---
title: "What is Disaster Recovery (DR)?"
meta_title: "What is Disaster Recovery (DR)? | Expert Data Architecture Guide"
description: "Disaster recovery (DR) is the plan for restoring data systems after a major outage or loss. Learn how RPO, RTO, immutable backups, and air-gapping shape it."
---

# What is Disaster Recovery (DR)?

Disaster Recovery (DR) is the strategy for restoring an enterprise data ecosystem after a major event takes it down (such as a regional earthquake destroying a data center, a ransomware attack encrypting the primary systems, or an engineer accidentally deleting the production database). 

While High Availability (HA) focuses on keeping a system running through smaller hardware failures, Disaster Recovery assumes the entire primary system is lost. It is the set of backups, off-site data replication, and "Infrastructure as Code" blueprints needed to rebuild systems quickly, before the business suffers serious financial damage.

## The Two Core Metrics of DR

A Data Architect does not design a Disaster Recovery plan based on feelings. The DR architecture is driven by two business metrics, set by business leadership for each system.

### 1. Recovery Point Objective (RPO) - The Data Loss Limit
RPO defines the maximum amount of recent data, measured in time, that the business is willing to lose during a disaster.
* If a business takes a database backup to magnetic tape once every night at midnight, their RPO is 24 hours. If the data center is destroyed at 11:59 PM, they lose nearly a full day of transactions. 
* For a bank's core ledger, losing a day of transactions is unacceptable to regulators and customers. The target RPO may be effectively zero. This pushes the Data Architect beyond nightly backups toward expensive Synchronous Data Replication to a second site, so committed transactions are not lost.

### 2. Recovery Time Objective (RTO) - The Downtime Limit
RTO defines how long a system can be offline before the business impact becomes unacceptable.
* If the RTO is 48 hours, the engineering team has two days to manually order new servers, install Linux, download the magnetic tape backups, and slowly rebuild the databases.
* If an e-commerce website has an RTO of 5 minutes, people cannot rebuild it fast enough. The Architect must deploy a "Hot Standby" DR architecture. They pay their cloud provider to keep a matching, fully operational infrastructure running in a different geographic region. If the primary region fails, a DNS or global load balancer change routes traffic to the Hot Standby within minutes.

## Immutable Backups and Air-Gapping

Ransomware has changed Disaster Recovery architecture. 

Historically, if the primary database synced reliably to the DR replica database, the company felt safe. However, if an attacker breaches the primary database and encrypts or deletes the data, the replication pipeline copies that damage to the replica database as well.

To defend against this, modern Data Lakehouses use Immutable Backups and Air-Gapping. 
Data engineers use features like Amazon S3 Object Lock, which stores objects in a write-once-read-many (WORM) model. When the daily backup is written to S3 with a retention period in compliance mode, no user, including the AWS account root user, can overwrite or delete that object version until the retention period (for example, 90 days) expires. This provides a restore point that ransomware running with stolen credentials cannot erase.

## Summary of Technical Value

Disaster Recovery is the insurance policy for enterprise architecture. By defining clear thresholds for acceptable data loss (RPO) and downtime (RTO), and deploying air-gapped, immutable backups combined with automated infrastructure rebuild scripts (Terraform), a well-designed DR architecture lets an organization survive major physical or cyber incidents and restore its mission-critical data ecosystem quickly.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
