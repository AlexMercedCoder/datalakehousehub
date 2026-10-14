---
title: "Feature Store on a Lakehouse: Offline Iceberg Tables, Online Serving"
meta_title: "Feature Store on an Iceberg Lakehouse | Glossary"
description: "A feature store manages ML features for both training and real-time serving. See how its offline store maps to Iceberg tables and how Feast and others compare."
---

A feature store is a system for defining, storing, and serving machine learning features, the computed input signals a model uses, so the same feature values are available for model training and for real-time predictions. It pairs a historical (offline) store with a low-latency (online) store and keeps a registry of feature definitions.

The problem it addresses is training-serving skew. A data scientist computes `customer_90d_avg_spend` in a notebook to train a fraud model. When the model goes to production, an application team reimplements that calculation in another language for the live service, and the two versions disagree in small ways. The model then sees different inputs in production than it was trained on, and accuracy drops. A feature store defines the feature once and serves it to both paths.

## Offline Store, Online Store, and Registry

### Offline Store (Training)
The offline store holds the full history of feature values with timestamps. Training jobs pull from it to build datasets. It is usually a warehouse or a lakehouse table format such as [Apache Iceberg](/knowledgebase/apache-iceberg/) on object storage.

### Online Store (Serving)
The online store holds only the latest value per entity in a key-value database such as Redis or DynamoDB. When a card transaction arrives, the scoring service looks up the customer's features by key in a few milliseconds instead of running an analytical query.

### Materialization
A scheduled or streaming job copies the latest values from the offline store to the online store. Streaming feature pipelines, often built on Kafka and Flink, update the online store within seconds for features like "transactions in the last 10 minutes."

### Registry
The registry records each feature's definition, owner, source, and entity key, so teams can find and reuse existing features instead of rebuilding them.

## Point-in-Time Correct Training Data

The most important job of the offline store is building training sets without data leakage. For each labeled event (say, a transaction at 14:05 on March 3), the training row must use feature values as they were known at 14:05, not values computed later. Feature stores perform this point-in-time join automatically. Doing it by hand with a plain `JOIN` on customer ID quietly leaks future information into training and makes offline metrics look better than production results.

## Feature Stores on a Lakehouse

Lakehouse tables already provide much of what an offline store needs: cheap storage of long history, Parquet files that ML tools read directly, and Iceberg snapshots and time travel that let you reproduce exactly which data a model was trained on.

| Approach | Offline store | Online serving | Fits when |
|---|---|---|---|
| Feast (open source) | Pluggable: warehouses, Spark, Trino, files on object storage | Redis, DynamoDB, PostgreSQL, and others | You want an open source registry and serving layer on your own lakehouse |
| Managed platform feature stores (Databricks, which announced its acquisition of Tecton in 2025; SageMaker; Vertex AI) | The vendor's tables | Managed online store | You are standardized on that platform |
| Plain Iceberg tables plus a cache | Iceberg feature tables built with Spark or SQL | Your own key-value store | Few models, or batch-only scoring where no online store is needed |

If all your models score in batch, you may not need an online store at all: write predictions back to an Iceberg table, as described in [Model Inference](/knowledgebase/model-inference/). Add a full feature store when several models share features or when real-time serving makes skew a real risk.

For more on current designs, see [Modern Feature Stores Beyond Batch Pipelines](/blog/2026-05-modern-feature-stores/) and [Bringing MLflow and Data Pipelines Closer Together](/blog/2026-05-mlflow-data-pipelines/).

## Summary

A feature store keeps one definition of each feature and serves it from an offline store for training and an online store for live predictions, with point-in-time joins to prevent leakage. On a lakehouse, Iceberg tables make a natural offline store, and the online layer is added only when real-time scoring requires it.


## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
