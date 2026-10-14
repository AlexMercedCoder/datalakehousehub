---
title: "Model Inference: Batch vs Real-Time Scoring on a Lakehouse"
meta_title: "Model Inference: Batch vs Real-Time in Lakehouses | Glossary"
description: "Model inference is running a trained model on new data to get predictions. See how batch, streaming, and real-time inference differ and where Iceberg fits."
---

Model inference is the step where a trained machine learning model is applied to new data to produce predictions, scores, classifications, or generated text. Training learns the model's parameters from historical data; inference uses those fixed parameters on inputs the model has not seen.

Training is usually an occasional, expensive job. Inference runs continuously and often dominates cost over a model's life, because every scored row, API request, or LLM token is an inference.

## Three Ways to Run Inference

### Real-Time (Online) Inference
The model runs behind an API, usually a container on Kubernetes or a managed endpoint, and answers one request at a time. A card payment service sends transaction details and gets a fraud probability back in tens of milliseconds. Real-time models typically read precomputed inputs from a [feature store](/knowledgebase/feature-store/) online store, because there is no time to run analytical queries per request.

### Batch Inference
A scheduled job scores many rows at once. A churn model scores every active customer overnight, and the marketing system reads the results in the morning. This is cheaper per prediction and needs no always-on service.

### Streaming Inference
A stream processor such as Flink or Spark Structured Streaming scores events as they arrive and writes results to a topic or table. It sits between the other two: seconds of latency, without a request-response API.

| | Real-time | Streaming | Batch |
|---|---|---|---|
| Latency | Milliseconds | Seconds | Minutes to hours |
| Input | One request | Event stream | Whole table or partition |
| Output | API response | Topic or table | Table |
| Infrastructure | Always-on serving endpoint | Streaming job | Scheduled Spark or SQL job |
| Typical use | Fraud checks, recommendations, chat | Alerting, live scoring | Churn, forecasting, document tagging |

## Batch Inference on an Iceberg Lakehouse

Batch inference is where the lakehouse does most of the work. A common pattern:

1. Read the Gold feature table, an [Apache Iceberg](/knowledgebase/apache-iceberg/) table, with Spark.
2. Load the registered model as a Spark UDF (for example with MLflow's `mlflow.pyfunc.spark_udf`) and apply it to every row in parallel.
3. Write predictions to a scores table partitioned by run date, with the model version and the input table's snapshot ID as columns.

Recording the snapshot ID matters: Iceberg time travel lets you rerun the same model on exactly the same input later to explain or audit a prediction. BI tools and agents then query the scores table like any other table.

LLM inference increasingly runs the same way. Several platforms expose model calls as SQL functions, such as Databricks `ai_query` and Snowflake Cortex AI functions, so classifying or summarizing a text column becomes a batch query over a table. For small, high-volume tasks, a compact classification model is often far cheaper than an LLM call per row.

## Making Inference Cheaper

Inference cost is driven by model size and hardware. Quantization stores weights at lower precision (for example 8-bit or 4-bit instead of 16- or 32-bit), shrinking memory use and speeding up execution, usually with a small accuracy loss that should be measured. Runtimes such as ONNX Runtime and NVIDIA TensorRT optimize models for specific hardware, and LLM servers such as vLLM batch many requests together to keep GPUs busy.

For lakehouse-specific examples, see [Fast Classification Models, LLMs, and the Apache Iceberg Lakehouse](/blog/jev-classification-models-iceberg-lakehouse/) and [Bringing MLflow and Data Pipelines Closer Together](/blog/2026-05-mlflow-data-pipelines/).

## Summary

Model inference applies a trained model to new data, in real time, in streams, or in batches. On a lakehouse, batch and streaming inference read from and write to Iceberg tables, which makes predictions queryable, versioned, and reproducible alongside the data that produced them.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
