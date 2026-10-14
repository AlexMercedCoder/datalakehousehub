---
title: "What is MLOps?"
meta_title: "What is MLOps? | Expert Data Lakehouse Architecture Guide"
description: "MLOps is the practice of applying DevOps methods to machine learning: versioning code and data, automating training and deployment, and watching for drift."
---

# What is MLOps (Machine Learning Operations)?

MLOps (machine learning operations) is the practice of applying DevOps methods to machine learning: versioning code, data, and models together, automating training and deployment, and monitoring models after they go live. It sits where data science, data engineering, and software operations meet.

A model trained in a notebook is not yet a product. To be useful it has to be packaged with its dependencies, fed production data in the same shape as the training data, served to applications, and watched for decline. Without shared tooling, each handoff from data scientist to engineer is manual and hard to repeat. MLOps applies continuous integration and continuous delivery (CI/CD) and monitoring to that lifecycle.

## How MLOps Differs from DevOps

In ordinary software, behavior changes when someone changes the code. A machine learning model's behavior depends on three inputs: the code, the hyperparameters, and the training data. A model can also lose accuracy with no code change at all, because the world that produces its input data changes. That is why MLOps tracks data versions and watches live predictions, not only code commits.

## The Pillars of MLOps

Platforms such as MLflow, Kubeflow, and Amazon SageMaker cover some or all of these stages.

### 1. Experiment tracking and versioning
Data scientists run many experiments while building a model. Experiment tracking records, for each run, the Git commit of the code, the hyperparameters (for example `learning_rate=0.01`), the metrics, and the version of the training data. On a [data lakehouse](/knowledgebase/data-lakehouse/), the data version can be an [Apache Iceberg](/knowledgebase/apache-iceberg/) snapshot ID, and [time travel](/knowledgebase/time-travel/) lets the team read that exact table state later to reproduce or audit a model. A [feature store](/knowledgebase/feature-store/) helps keep the features used in training consistent with those used at prediction time.

### 2. Automated training pipelines (CI/CD for ML)
In MLOps, the team ships the pipeline that trains the model, not only the trained model file. A commit to the repository triggers a pipeline that pulls data from the lakehouse, builds features, trains the model, and evaluates it against a holdout set and the current production model. If it passes, the pipeline packages the model, often as a container image, and registers it for deployment. Teams decide how much of the promotion step is automatic and where a human approves.

### 3. Deployment and serving
Models reach the business in two common ways:
* **Batch prediction:** a scheduled job scores many rows at once, for example nightly churn scores for every customer, and writes the results to a lakehouse table that dashboards and applications read.
* **Online serving:** the model runs behind an API, often on [Kubernetes](/knowledgebase/kubernetes/), and returns a prediction per request, for example a fraud score while a card payment is being authorized.

### 4. Monitoring and retraining
After deployment, models need monitoring for [model drift](/knowledgebase/model-drift/). Data drift is a change in the distribution of input features; concept drift is a change in the relationship between inputs and the correct answer. A demand forecast trained on 2019 data, for example, did not reflect buying patterns in 2020. Monitoring compares live inputs and, when labels arrive, live accuracy against the training baseline. When a threshold is crossed, the system alerts the team or triggers the training pipeline to retrain on recent data and evaluate the new model before it replaces the old one.

## Summary

MLOps brings version control, automated pipelines, and monitoring to machine learning. By tying each model to its code, hyperparameters, and a specific data snapshot, and by watching live models for drift, it lets teams retrain and redeploy models in a repeatable, auditable way.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
