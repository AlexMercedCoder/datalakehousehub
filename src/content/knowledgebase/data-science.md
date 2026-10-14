---
title: "What is Data Science?"
meta_title: "What is Data Science? | Expert Data Lakehouse Architecture Guide"
description: "Data science combines statistics, computing, and domain knowledge to predict outcomes from data. Learn its lifecycle and why it relies on lakehouse data access."
---

# What is Data Science?

Data Science is a multidisciplinary field that combines statistics, computer science, and business domain expertise to extract actionable insights from large, messy datasets. While Data Engineering focuses on building the resilient infrastructure to securely transport and store data, and Data Analytics focuses on reporting what happened in the past (descriptive analytics), Data Science focuses largely on predicting the future (predictive analytics) and recommending actions (prescriptive analytics).

In the context of the modern enterprise, Data Science is one of the main ways stored data turns into business value. A data warehouse can accurately report that 5,000 customers canceled their subscriptions last month. That is useful, but it does not prevent future cancellations. A Data Scientist utilizes the historical data residing in the Open [Data Lakehouse](/data-lakehouse/) to train machine learning models that analyze subtle behavioral patterns (like a user logging in less often over a two-week period) to predict *which* customers will likely cancel *next* month, allowing the business to proactively intervene.

## The Core Lifecycle

The Data Science workflow is experimental and iterative. 

### 1. Exploratory Data Analysis (EDA)
Before training any predictive algorithms, Data Scientists need to understand the statistical shape of the data. They connect Jupyter Notebooks to the Data Lakehouse (often utilizing tools like Pandas or PySpark) to execute Exploratory Data Analysis (EDA). They build visualizations to identify correlations (e.g., discovering that product sales rise during local weather events).

### 2. Feature Engineering
Raw data is rarely suitable for machine learning. Feature Engineering is the process of transforming raw data into explicit signals (features) that algorithms can understand. If a dataset contains a `Timestamp` column, the algorithm might not understand it. The Data Scientist engineers new features, extracting `Is_Weekend`, `Is_Holiday`, or `Time_Since_Last_Purchase` from that single timestamp, providing the algorithm with context it needs to learn effectively.

### 3. Model Selection and Training
The Data Scientist applies algorithms (like Random Forests, Gradient Boosting Machines, or Deep Neural Networks) to the engineered features. The algorithm processes the historical data (the training set), learning the patterns that led to specific historical outcomes.

### 4. Validation and Deployment
A model is useless if it simply memorizes the historical data (overfitting). The scientist validates the model against an unseen dataset (the holdout set) to check that it generalizes. Once validated, the model is deployed into production via MLOps pipelines, generating predictions for the business.

## The Dependency on the Data Lakehouse

Historically, Data Scientists were often bottlenecked by Data Warehouses. Warehouses required strict Schema-on-Write, meaning raw, messy anomalies were often deleted by the ETL pipeline before the Data Scientist ever saw them. Because many machine learning use cases depend on those rare anomalies, this sanitized data hurt model accuracy.

The Open Data Lakehouse addresses this. It allows Data Scientists to access raw, untransformed data (Bronze layer) for experimental discovery, while also allowing them to join that data against the cleaned financial metrics (Gold layer). Because compute is separate from storage, teams can scale compute to train models without copying the data out of the cloud storage layer.

## Summary of Technical Value

Data Science is a major driver of enterprise modernization. By applying statistical modeling and machine learning to the datasets prepared by data engineering, Data Scientists help an organization move from a reactive, backward-looking posture to a proactive, predictive one, improving operational efficiency and revenue.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
