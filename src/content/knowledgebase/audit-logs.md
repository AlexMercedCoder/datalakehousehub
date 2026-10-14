---
title: "What are Audit Logs?"
meta_title: "What are Audit Logs? | Expert Data Lakehouse Architecture Guide"
description: "Audit logs are chronological records of who did what, when, and from where in a system, covering WORM storage, structured event payloads, and anomaly alerts."
---

# What are Audit Logs?

Audit Logs are secure, chronological records designed to capture the actions, security events, and data changes executed within an enterprise software system. While standard "Application Logs" are used by software developers to debug broken code (e.g., "The Python script crashed at Line 42"), Audit Logs are a compliance mechanism that many regulations and standards require. They are the evidence used by security architects, regulators, auditors, and forensic investigators to determine exactly *who* did *what*, *when* they did it, and *from where* they did it.

If a global bank suffers a data breach, and an unknown entity executes a SQL query that extracts millions of credit card numbers from the [Data Lakehouse](/knowledgebase/data-lakehouse/), the bank does not have to guess what happened. Investigators secure and review the Audit Logs. The logs can state: "At 03:14:22 AM UTC, User Account `admin_john`, utilizing IP Address `192.168.1.45`, executed the explicit query `SELECT * FROM secure_payments`, returning 10,000,000 rows." 

## The Architecture of Immutability

To serve as reliable evidence in a compliance audit (such as SOC 2, HIPAA, or GDPR), an Audit Log architecture must be complete and tamper-resistant.

### 1. WORM Storage (Write Once, Read Many)
If an attacker compromises a server, one common step is to delete the logs to cover their tracks. 
A well-designed Data Lakehouse defends against this by exporting the Audit Logs off the active server in near real time. The logs are streamed into Amazon S3 buckets configured with Object Lock in compliance mode (a WORM model). In compliance mode, no user, including the DBA, an attacker with stolen credentials, or the AWS account root user, can delete or overwrite a locked object version until its retention period (for example, 7 years) expires. 

### 2. Highly Structured Event Payloads
Audit logs should not be vague, unstructured text. They are typically structured JSON payloads designed for machine parsing via SIEM (Security Information and Event Management) tools like Splunk or Datadog. 
Each log entry should capture the "5 W's":
* **Who:** The unique identity of the user or service account and how it authenticated.
* **What:** The API endpoint hit or the SQL statement executed.
* **Where:** The origin IP address and, where available, the approximate location.
* **When:** A precise timestamp from clocks synchronized via NTP.
* **Why:** The authorization rule (RBAC policy) that granted or denied the action.

## Active Monitoring and Anomaly Detection

Audit logs are not only historical records used after an incident; they also feed real-time security monitoring.

Many enterprise architectures pipe the stream of JSON Audit Logs into anomaly detection models. The model establishes a baseline of normal behavior. If an executive typically logs in from New York at 9:00 AM and downloads a few megabytes of data, the model ignores it. If the same executive account logs in at 3:00 AM from an unfamiliar VPN address and attempts to download tens of gigabytes of [Apache Iceberg](/knowledgebase/apache-iceberg/) files, the model flags the anomaly. An automated response can then lock the account and stop the extraction while the security team investigates.

## Summary of Technical Value

Audit Logs are a foundation of enterprise security, accountability, and regulatory compliance. By generating structured, tamper-resistant records of interactions within the Data Lakehouse, organizations gain forensic visibility, support compliance audits, and detect threats earlier using anomaly detection.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
