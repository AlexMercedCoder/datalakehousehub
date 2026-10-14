---
title: "What is Data Product Manager?"
meta_title: "What is Data Product Manager? | Data Lakehouse Hub Knowledge Base"
description: "A data product manager owns a data product the way a PM owns software: finding the real need, setting SLAs, and tracking adoption. Learn the role and skills."
---

# What is Data Product Manager?

## Introduction to the Data Product Manager

In traditional software engineering, the role of the **Product Manager (PM)** has been established for decades. If a company is building a new mobile app, the software engineers write the code, but the product manager decides *what* the app should do. The PM interviews customers, researches the market, defines the feature requirements, and checks that the final app solves a real problem.

Historically, many data engineering teams did not have product managers.
Data engineers often operated as an internal "service desk." A business executive would submit a Jira ticket saying, *"I need a dashboard showing sales by region."* The data engineer would write the SQL, build the dashboard, and close the ticket. A month later, the engineer might discover that the executive never looked at the dashboard because it was too confusing. Engineering time went into building things nobody used.

To address this, organizations created the **Data Product Manager (DPM)** role. This role treats data not as a background IT service, but as a "product" that must be managed, promoted, and continuously improved.

## The Philosophy of "Data as a Product"

The DPM operates on the principle of **Data as a Product** (a core concept of the [Data Mesh](https://iceberglakehouse.com/iceberg/iceberg-data-mesh/) architecture).

A "data product" is not necessarily software sold to external customers. It is any curated, high-quality data asset that is actively consumed by users.
Examples of internal data products include:
*   A clean, well-maintained `360_Customer_Profile` table in the [Data Lakehouse](https://iceberglakehouse.com/iceberg/data-lakehouse/).
*   A machine learning model predicting inventory shortages.
*   A real-time executive dashboard tracking supply chain metrics.

## The Responsibilities of a Data Product Manager

The DPM sits between the business stakeholders (who need insights) and the data engineers (who build the pipelines).

### 1. Discovering the True Need
If an executive asks for a "machine learning model to predict sales," an engineer working from tickets might start writing Python code right away.
A good data product manager will first ask *"Why?"*
Through user interviews, the DPM might discover the executive does not need a predictive model; they need an automated daily email showing the previous day's sales numbers. By identifying the underlying business need, the DPM can save the engineering team months of work.

### 2. Defining the SLA (Service Level Agreement)
The DPM treats the data table like a SaaS product. They define explicit commitments for the users:
*   **Freshness**: The data will be updated every day by 8:00 AM.
*   **Quality**: Null values in key columns stay below an agreed threshold.
If the pipeline breaks and misses the SLA, it is treated as a product outage, with the same urgency the company would give to a customer-facing incident.

### 3. Measuring Adoption and ROI
A traditional data team may measure success by asking: *"Did the SQL query finish running?"*
A data product manager measures success by asking: *"Are people using this?"*
The DPM tracks usage of the dashboard. If they notice the marketing team has not logged into the new analytics platform in three weeks, the DPM interviews the marketing team to find out why the product is not working for them, and works with the engineers to redesign the experience.

## The Skillset

A data product manager needs an uncommon combination of skills. They must be technically literate enough to understand the difference between a Kafka stream and a batch ETL job, so they do not promise the business features the platform cannot deliver. They also need strong communication skills and business acumen to work across departments, interview executives, and align the data roadmap with the company's goals.

## Conclusion

The data product manager role moves data teams away from ticket-taking. By adopting the user-centric methods of software product management, DPMs keep expensive data engineering and AI resources focused on reliable data assets that solve real business problems and deliver measurable value.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
