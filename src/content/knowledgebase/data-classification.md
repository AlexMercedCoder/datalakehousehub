---
title: "What is Data Classification?"
meta_title: "What is Data Classification? | Data Lakehouse Hub Knowledge Base"
description: "Data classification is the process of finding and labeling data by sensitivity, from public to restricted, so tag-based security can protect lakehouse tables."
---

# What is Data Classification?

## Introduction to Data Classification

In a large enterprise [Data Lakehouse](https://iceberglakehouse.com/iceberg/data-lakehouse/) containing large volumes of data, not all rows and columns are created equal. 

If a hacker steals a table containing `website_click_coordinates`, it is a minor problem. If a hacker steals a table containing `customer_credit_card_numbers`, the company can face lawsuits, regulatory fines, and lasting brand damage. Furthermore, internal employees (like junior data analysts) should have free access to the click data, but should be blocked from viewing the credit card data.

**Data Classification** is the foundational governance process of scanning an organization's entire data estate, identifying the specific types of data being stored, and assigning a standardized "Tag" or "Label" to that data based on its business value, legal requirements, and sensitivity.

## The Classification Levels

Organizations typically implement a hierarchical classification taxonomy. While the specific names vary by company, a standard taxonomy looks like this:

### 1. Public Data
Data that is freely available to the world and carries little or no risk if exposed. 
*   *Examples*: Press releases, public product catalogs, open job listings. 
*   *Access*: Unrestricted.

### 2. Internal / Business General
Data that is not public, but would cause minimal damage if leaked. It is standard operational data used by employees daily.
*   *Examples*: Internal corporate memos, aggregate sales dashboards, unreleased product roadmaps.
*   *Access*: Available to all authenticated employees.

### 3. Confidential
Data that is highly sensitive and would cause significant financial or reputational harm to the company or its partners if exposed.
*   *Examples*: Unreleased financial earnings reports, M&A strategy documents, vendor contracts, proprietary source code.
*   *Access*: Restricted to specific departments (e.g., Legal, Finance) on a strict "Need to Know" basis.

### 4. Restricted / Highly Confidential (PII, PHI, PCI)
The most sensitive data in the enterprise. Its handling is governed by laws and standards (like GDPR, HIPAA, or PCI DSS), and exposure can trigger legal penalties.
*   **PII (Personally Identifiable Information)**: Social Security Numbers, exact dates of birth, home addresses.
*   **PHI (Protected Health Information)**: Medical diagnoses, prescription records.
*   **PCI (Payment Card Industry)**: Credit card numbers, bank account routing numbers.
*   *Access*: Severely restricted. Even database administrators are often blocked from viewing this data in plaintext.

## Automation and the Data Catalog

Historically, Data Classification was a slow manual task. A data steward had to look at every table in a database with thousands of tables and manually type "Confidential" next to the columns.

Today, classification is often automated using **[Active Metadata](https://datalakehousehub.com/knowledgebase/active-metadata/)** platforms and AI.
Tools like BigID, Securiti.ai, or Collibra can scan the [Apache Iceberg](https://iceberglakehouse.com/iceberg/iceberg-catalog/) tables in [Amazon S3](https://datalakehousehub.com/knowledgebase/amazon-s3/). They use Machine Learning and Regular Expressions to analyze the actual data in the columns. 
If the scanner detects a column filled with card-length numbers that pass the Luhn checksum (used to validate credit card numbers), it applies the `PCI_RESTRICTED` tag to that column in the centralized Data Catalog.

## Driving Policy (Tag-Based Security)

Classification has limited value if it doesn't drive security. 
Some platforms (like Snowflake, with tag-based masking policies) support **Tag-Based Security**. 

Instead of an administrator writing hundreds of separate SQL rules saying "Bob cannot see Table A, Table B, Table C...", the administrator writes a single policy: *"No employee below the rank of VP can view any column tagged `PCI_RESTRICTED`."* 

Because the columns were classified automatically, the policy applies to every tagged column across the enterprise, which reduces human error.

## Conclusion

Data Classification is a prerequisite for enterprise data security and regulatory compliance. You cannot protect what you do not know you have. By utilizing automated ML scanning and standardized taxonomies to map where sensitive data lives, organizations can open their data lakehouses to analysts while keeping sensitive information protected.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
