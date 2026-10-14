---
title: "What is Pub/Sub Architecture?"
meta_title: "What is Pub/Sub Architecture? | Expert Data Lakehouse Architecture Guide"
description: "Pub/sub is a messaging pattern where publishers send events to topics and subscribers read them on their own. See how brokers like Apache Kafka decouple apps."
---

# What is Pub/Sub (Publish/Subscribe) Architecture?

Pub/Sub (Publish/Subscribe) is a scalable, asynchronous messaging pattern used widely in distributed systems and data engineering pipelines. It decouples the applications producing data from the applications consuming that data, so large systems can grow and tolerate failures without one slow or broken service taking down the others.

In a legacy, tightly coupled system, software communicates via point-to-point connections (e.g., synchronous REST API calls). If an E-Commerce website's Payment Service successfully processes a transaction, it must send an API call to the Shipping Service to mail the item, and an API call to the Email Service to send the receipt. If the Email Service is offline due to a network outage, the Payment Service gets an error or waits for a timeout. If it is not designed for that failure, requests back up, the Payment Service slows or fails, and checkout can go down. A failure in a non-critical email system ends up hurting the company's ability to take orders. Pub/Sub reduces this fragility.

## The Architecture of Decoupling

The Pub/Sub model introduces a scalable, fault-tolerant intermediary, the Event Broker (such as Apache Kafka, Google Cloud Pub/Sub, or Apache Pulsar), to carry messages between services.

### The Publishers (Producers)
The applications generating the data (the Publishers) do not need to know who is receiving the data. 
When the Payment Service processes a transaction, it generates a structured JSON message (`Order_Completed`) and "Publishes" it to a named channel (a "Topic") on the Event Broker. Once the broker acknowledges the message, the Payment Service moves on to the next transaction. It does not depend on whether the downstream systems are online.

### The Subscribers (Consumers)
The downstream applications (the Subscribers) independently connect to the Event Broker. They "Subscribe" only to the Topics they care about. 

The Shipping Service and the Email Service both subscribe to the `Order_Completed` topic. As the Broker receives the messages from the Publisher, it pushes them (or allows them to be pulled) to the Subscribers. 

If the Email Service is offline, the Payment Service keeps processing orders. The Event Broker stores the messages durably, within its configured retention period. When the Email Service comes back three hours later, it reconnects to the Broker, reads the backlog of missed messages, and sends the receipts without losing any of them.

## Scalability (One-to-Many Broadcasting)

Beyond fault tolerance, Pub/Sub makes it easier to scale through One-to-Many broadcasting. 

If the enterprise adds a Data Science team that needs the transaction data to train a real-time fraud detection algorithm, the engineering team does not need to rewrite the Payment Service code to add a third API connection. The Payment Service is unchanged. The Data Science team starts a new Apache Spark cluster and subscribes it to the existing `Order_Completed` topic. The Event Broker delivers the same data stream to the new consumer, so new uses of the data can be added without changing existing producers.

## Summary of Technical Value

Pub/Sub architecture is a widely used pattern for managing complex, distributed enterprise systems. By introducing a fault-tolerant event broker to decouple the producers of data from the consumers of data, it replaces many fragile point-to-point API connections. Downstream outages and crashes are much less likely to cascade into critical upstream services, which improves stability and makes the architecture easier to scale.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
