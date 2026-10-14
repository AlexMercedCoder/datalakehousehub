---
title: "What is Machine Learning?"
meta_title: "What is Machine Learning? | Expert Data Lakehouse Architecture Guide"
description: "Machine learning is a branch of AI where algorithms learn patterns from data instead of fixed rules. See its main types and how lakehouse tables feed training."
---

# What is Machine Learning?

Machine Learning (ML) is a subset of artificial intelligence (AI) focused on algorithms that learn from data and improve their performance on a specific task without being explicitly programmed with the rules for that task.

In traditional software engineering, a human writes rules-based logic: `if customer_balance < 0 then account_status = 'Overdrawn'`. This works well when the rule is known and fixed. Traditional programming struggles with complex, variable problems, like deciding whether a specific credit card transaction is fraudulent. Nobody can write enough `if/then` statements to cover every pattern of fraud.

Machine learning reverses this approach. Instead of giving the computer the rules, the data scientist gives it historical data and the historical answers, and the algorithm infers the rules itself.

## Core Learning Paradigms

Machine learning algorithms generally fall into three categories based on how they learn from data.

### 1. Supervised Learning
This is the most common paradigm in enterprise analytics. In supervised learning, the algorithm is trained on a dataset where the "correct answer" (the label) is provided.
If an organization wants to predict housing prices, it feeds the algorithm historical housing records. The features are the square footage, the zip code, and the number of bedrooms. The label is the final sale price. The algorithm iteratively adjusts its internal parameters to reduce the gap between its predictions and the historical sale prices. Once trained, it can estimate the price of a new, unseen house.

### 2. Unsupervised Learning
In unsupervised learning, the dataset has no labels. The algorithm is given data and asked to find structure in it.
A classic example is customer segmentation. A marketing team feeds the algorithm purchase histories for its customers. The algorithm uses clustering (like k-means) to group the customers into behavioral cohorts, which can surface patterns analysts had not noticed.

### 3. Reinforcement Learning
Reinforcement learning trains algorithms through rewards and penalties in an environment. The algorithm (the agent) takes an action, observes the result, and receives a reward signal based on the outcome. This paradigm is used in robotics, game-playing systems (like chess and Go), resource optimization, and fine-tuning AI models.

## Machine Learning in the Modern Data Stack

Machine learning results depend heavily on the volume and quality of the underlying data. A good algorithm trained on poor data will confidently produce poor predictions.

The modern [Data Lakehouse](/data-lakehouse/) supports machine learning well. With open table formats (like [Apache Iceberg](/apache-iceberg/)), data scientists can use time travel queries to reproduce the exact data used for a past training run. They can use distributed compute such as Apache Spark (via Spark MLlib) to prepare features and train models directly against large datasets in parallel, rather than pulling all of the data down to a local Python environment.

## Summary of Technical Value

Machine learning is the engine behind predictive analytics. By moving from human-authored rules to data-driven models, organizations can tackle complex, multi-variable problems, from real-time fraud detection to personalized product recommendations, at a scale that is hard to reach with hand-written rules.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
