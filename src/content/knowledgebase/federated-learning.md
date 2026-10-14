---
title: "What is Federated Learning?"
meta_title: "What is Federated Learning? | Data Lakehouse Hub Knowledge Base"
description: "Federated learning trains an ML model across many devices or sites without moving the raw data. Covers local training, gradient aggregation, and tradeoffs."
---

# What is Federated Learning?

## Introduction to Federated Learning

In traditional machine learning, data is centralized. If a phone maker wanted to train a model on how people use their phones, it would traditionally collect the data from every device, upload it to a central server, and train the neural network there.

This centralized approach raises serious privacy concerns. Users do not want their personal photos, private messages, or medical records uploaded to a corporate server. Laws like GDPR also make it legally risky for companies to accumulate large amounts of personally identifiable information (PII) in one place.

**Federated Learning** is an architectural answer to this problem. It flips the usual approach: **instead of bringing the data to the model, you bring the model to the data.**

## How Federated Learning Works

Federated learning is a decentralized training architecture.

Google's Gboard keyboard is a well-known example. Google used federated learning to improve Gboard's suggestions without uploading users' typing data to its servers. The process works like this:

### 1. The Global Model Broadcast
The coordinator creates a global model on its central server and sends a copy to a selection of participating devices (the "edge devices").

### 2. Local Training on the Edge
When a phone is idle, charging, and on Wi-Fi, it trains the downloaded model on data stored locally on the device.
**The raw training data does not leave the phone.**

### 3. The Model Update
After training, the model's weights have changed. The phone sends *only the model update* (the weight changes) back to the coordinator, typically protected in transit and often combined with secure aggregation so the server cannot inspect any single device's update. It does not send the raw text.

### 4. Aggregation
The server receives updates from many devices and combines them (using an algorithm like Federated Averaging) to produce an improved global model.

The cycle then repeats. The coordinator sends the updated global model back to devices for the next round.

## The Core Advantages

Federated learning enables AI use cases in regulated and privacy-sensitive settings.

1.  **Stronger Privacy**: Because the raw data (photos, texts, medical scans) stays on the device or site where it was generated, a breach of the central server does not expose that raw data. Model updates can still leak some information, so production systems often add secure aggregation and differential privacy.
2.  **Medical Collaboration**: Several hospitals want to train a model to detect lung cancer, but privacy rules such as HIPAA restrict sharing patient records. With federated learning, each hospital trains the model locally on its own servers and shares only model updates with a central coordinator, producing a shared model without pooling patient records.

## The Engineering Challenges

Federated learning is useful in theory but hard to operate.

*   **Communication Overhead**: Sending model weights back and forth between a server and large numbers of phones consumes network bandwidth and battery life.
*   **Data Heterogeneity**: In traditional ML, data scientists clean and standardize the data before training. In federated learning, each device's data is different. Phone A might have thousands of messages in English, while Phone B has a handful in Spanish. This imbalance (non-IID data) can make training unstable and slow to converge.

## Conclusion

Federated learning is an important approach to privacy-preserving AI. By separating model training from data centralization, it lets organizations learn from many edge devices, from smartphones to IoT sensors to hospital servers, while keeping raw data local and supporting compliance with privacy regulations.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
