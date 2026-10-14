---
title: "What is Data Privacy?"
meta_title: "What is Data Privacy? | Expert Data Lakehouse Architecture Guide"
description: "Data privacy is handling personal data lawfully, with consent and limited purpose. See how Apache Iceberg row-level deletes help honor erasure requests."
---

# What is Data Privacy?

Data Privacy (or Information Privacy) is the legal, ethical, and architectural discipline focused on the proper handling, processing, storage, and deletion of sensitive consumer information. While "Data Security" protects data from unauthorized access, "Data Privacy" governs how even the organization that lawfully collected the data may use it.

In the early decades of the internet, organizations operated in a lightly regulated "Wild West." A company could often collect a user's geolocation, purchase history, and political affiliations, and then sell that dataset to third-party advertising brokers without the user's knowledge or consent. 
This era was curtailed by the introduction of major privacy frameworks (most notably GDPR in Europe and CCPA in California). Today, violating Data Privacy laws is a serious business risk; European regulators have issued GDPR fines in the hundreds of millions of euros for unlawful data processing.

## The Three Architectural Pillars of Privacy

Modern data engineering pipelines should be designed from the ground up (Privacy by Design) to enforce legal requirements.

### 1. Consent Management
Under GDPR, an organization needs a lawful basis to process personal data in its [Data Lakehouse](/knowledgebase/data-lakehouse/), and for many marketing and tracking uses that basis is the person's consent, which must be recorded and verifiable. 
When a user clicks "Accept Cookies" on a website, that action generates a Consent Event. This event flows into the architecture. The data engineering team must build automated logic into the ETL pipelines: if a row of user data arrives *without* a linked, active Consent Event, the pipeline should quarantine or delete that specific row before it enters the analytical Data Lakehouse, preventing unlawful processing.

### 2. Purpose Limitation
This is one of the harder legal requirements to engineer. If a consumer gives a hospital their phone number explicitly "To receive appointment reminders," the hospital generally cannot use that same phone number to text the consumer promotional advertisements for a new medical service. 

The data was legally collected, but the *purpose* of the processing was violated. Data architects manage this with Enterprise Data Catalogs (like Collibra) and access policies. The catalog tags the `Phone_Number` column with metadata indicating its approved purpose. If a marketing analyst attempts to query that column, a policy tied to that tag can block or mask the result.

### 3. The Right to Be Forgotten
Under laws like GDPR (Article 17), a person can in many cases demand that an organization erase their personal data, and the organization must generally respond within one month.

Historically, this was very hard in a data lake. A user's data might be scattered across thousands of nested JSON log files in a large S3 data lake. Deleting a single user could require rewriting a large share of those files. 
Open Table Formats (like [Apache Iceberg](/knowledgebase/apache-iceberg/)) made this practical. With metadata-based file pruning and row-level `DELETE` commands, data engineers can target only the files that contain a specific user's records. To fully remove the data, teams then compact delete files and expire old snapshots, since earlier snapshots still reference the original files.

## Summary of Technical Value

Data Privacy is no longer only a legal concern; it is an architectural requirement. By integrating automated consent management, purpose-driven access controls, and targeted row-level deletion into the Data Lakehouse infrastructure, organizations can run large-scale business analytics while protecting consumer rights and reducing the risk of regulatory penalties.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
