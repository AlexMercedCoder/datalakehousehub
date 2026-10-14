---
title: "What is Data Stewardship?"
meta_title: "What is Data Stewardship? | Expert Data Lakehouse Architecture Guide"
description: "Data stewardship assigns people accountability for the quality, meaning, and access rules of specific data domains. See the steward role and its data mesh fit."
---

# What is Data Stewardship?

Data stewardship is the operational discipline of assigning human accountability and ownership over specific data domains within an enterprise. While data engineers are responsible for the infrastructure (pipelines, databases, and code), data stewards are responsible for the *content, quality, and appropriate use* of the data flowing through those pipelines.

In the early days of big data, many organizations built large data lakes and told everyone to "dump their data in." Because nobody was explicitly responsible for the contents of the lake, data went undocumented, broken files went unfixed, and nobody audited who had access. Many of those data lakes turned into hard-to-manage, poorly secured "data swamps." Data stewardship is the organizational framework that helps prevent this.

## The Role of the Data Steward

A data steward is rarely a software developer. Stewards are typically experienced business domain experts (such as a finance manager or a logistics director) who understand the data their department generates.

Data stewards carry out three main functions within the data governance framework:

### 1. Defining Quality and Semantic Standards
If the logistics data pipeline begins reporting that shipping times have increased to 500 days, the data engineers may not know whether that is a data error or a real supply chain problem.
The logistics data steward makes that call. They define the data quality rules. They write the business rule stating, for example: "A shipping duration cannot exceed 45 days." The data engineers then encode that rule into automated quality checks (using tools like Soda or Great Expectations). The steward also maintains the business glossary, so the company agrees on the definition of terms like "Transit Time."

### 2. Access Management and Security
Data stewards are often the approvers for access to their domain's data.
If a marketing analyst requests access to a European customer database to build a dashboard, the data engineer is usually not the right person to decide. The engineer may not know the details of European privacy law or the company's policies.
The request is routed to the data steward responsible for that data. The steward evaluates the request, checks that it complies with GDPR (General Data Protection Regulation) and internal policy, and approves or denies it, often through the enterprise data catalog.

### 3. Remediation and Dispute Resolution
When data breaks, the steward helps lead the remediation. If the sales team and the finance team disagree over conflicting Q3 revenue numbers on their dashboards, the finance data steward can act as the arbiter. They review the data lineage, identify which dashboard uses the incorrect logic, and direct the fix.

## Stewardship in the Data Mesh

The data mesh approach gives data stewardship a larger role.

In a data mesh, ownership of data moves from a central data engineering team to the business domains (marketing, sales, finance), which operate more like autonomous product teams. The data steward often acts as the owner or product manager of the domain's data. They are accountable for making sure their data products meet agreed service level agreements (SLAs) for freshness, accuracy, and security before exposing that data to the rest of the enterprise.

## Summary of Technical Value

Data stewardship is the human side of data governance. By assigning accountability, domain expertise, and policy responsibility to specific individuals, organizations help keep their investments in data lakehouses and analytical infrastructure documented, trustworthy, and secure.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
