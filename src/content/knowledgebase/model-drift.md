---
title: "What is Model Drift?"
meta_title: "What is Model Drift? | Data Lakehouse Hub Knowledge Base"
description: "Model drift is the drop in a machine learning model's accuracy as real-world data changes. Learn data drift versus concept drift and how to detect and fix each."
---

# What is Model Drift?

## Introduction to Model Drift

A common misconception in corporate AI is that a machine learning model behaves like ordinary software.
If you write a function to calculate 2 + 2, it will return 4 every time. You deploy it, and unless requirements change, you do not need to revisit it.

A machine learning model, however, is not a set of hand-written rules; it is a statistical reflection of the world at the time the training data was collected.
Because human behavior, economics, and language keep changing, the world the model was trained on gradually stops matching the present. When real-world data deviates from the historical training data, the model's predictions become less accurate.

This gradual, often unnoticed loss of accuracy over time is known as **Model Drift**. Managing it is a central concern of MLOps.

## The Two Types of Drift

Model drift is a broad term that generally breaks down into two statistical phenomena: data drift and concept drift.

### 1. Data Drift (Feature Drift)
Data drift occurs when the statistical distribution of the *input data* changes, but the underlying relationship between inputs and outcomes stays the same.
*   **Example**: An e-commerce company trains a model to recommend products. The model is trained during the summer, so the input data is skewed toward users searching for "swimsuits" and "sunglasses." Six months later, it is December. Users are now searching for "winter coats."
*   The model has not "broken," but the incoming data looks different from the summer data it was trained on. It will struggle to make accurate predictions on feature distributions it has rarely seen.

### 2. Concept Drift
Concept drift is often harder to catch. It occurs when the relationship between the input data and the target output changes. The rules of the game have shifted.
*   **Example**: A bank trains a model to detect credit card fraud. The model learns that transactions originating from a specific foreign IP range at 3:00 AM are very likely to be fraud.
*   The fraud ring notices it is being caught. They change tactics, using VPNs to route their 3:00 AM transactions through local US IP addresses.
*   The input data (time of day, location) may look normal to the model, but what that data means has changed. The model may now approve fraudulent transactions because its learned patterns are out of date.

## How to Detect and Fix Model Drift

Because model drift happens quietly (the API does not crash; it returns worse answers), it must be monitored statistically.

### 1. Continuous Monitoring
MLOps platforms monitor the statistical distribution of incoming live data and compare it to the distribution of the original training data. If the system detects a significant divergence (e.g., using statistical tests like the Kolmogorov-Smirnov test), it raises an alert that data drift has occurred.

### 2. Ground Truth Evaluation
Concept drift is best detected by comparing the model's predictions to reality (ground truth).
If the model predicts a customer will default on a loan, the bank may have to wait months to see whether the customer *actually* defaulted. Once that ground truth data is available, it is fed back into the MLOps platform to calculate the model's real-world accuracy.

### 3. Automated Retraining
When drift is detected, the usual fix is retraining.
The MLOps pipeline is triggered. It pulls recent data (capturing the new winter coat trends or the new fraud tactics), trains a new version of the model, validates it, and promotes it to production if it performs better than the current version.

## Conclusion

Model drift is a practical reality of deploying AI. An organization cannot "deploy AI" and walk away. A model deployed without monitoring and retraining will usually lose accuracy over time, sometimes with significant financial consequences. Understanding and managing drift is a large part of what separates an AI prototype from a reliable production AI product.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
