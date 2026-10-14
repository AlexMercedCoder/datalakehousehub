---
title: "What is a Webhook?"
meta_title: "What is a Webhook? | Expert Data Lakehouse Architecture Guide"
description: "A webhook is an HTTP callback that pushes an event payload to another app when something happens, and how it feeds real-time lakehouse ingestion with retries."
---

# What is a Webhook?

A Webhook is an event-driven mechanism that lets a software application automatically send a data payload to another application shortly after a specific event occurs. Often called a "Reverse API," Webhooks avoid much of the wasted work and delay of traditional API polling, which makes them a useful ingestion strategy for a near real-time [Data Lakehouse](/data-lakehouse/).

To understand the value of a Webhook, it helps to look at the inefficiency of traditional API Polling. 
If an e-commerce company wants to update their dashboard the moment a customer processes a refund in Stripe, a traditional pipeline uses a script that "polls" (asks) the Stripe API every minute: "Did a refund happen? Did a refund happen? Did a refund happen?" 

If only one refund happens per day, the pipeline makes 1,439 API calls a day that return nothing new. Those calls waste compute and count against the provider's API Rate Limits. Webhooks reverse this dynamic. 

## The Architecture of the Reverse API

With a Webhook, the data pipeline does not ask the source system for data. It waits for the source to send it.

### 1. The Subscription
The data engineer opens the Stripe Dashboard (or uses its API) and registers a specific URL endpoint owned by the enterprise data engineering team (e.g., `https://data.company.com/ingest/stripe/refunds`). This endpoint is configured to accept incoming `HTTP POST` requests.

### 2. The Event Trigger
When a refund is issued, Stripe records the change and creates an event for it. 

### 3. The Real-Time Push
Without being asked, Stripe's servers send a structured JSON payload describing the event (amount, customer ID, timestamp, and an event ID) as an HTTP POST to the data engineering team's endpoint, usually within seconds. 

The receiving service verifies the request's signature, quickly returns a success response, writes the payload to a durable message queue (like Apache Kafka), and downstream jobs load it into the Data Lakehouse.

## Idempotency and Retry Complexity

While Webhooks provide near real-time visibility, they add operational complexity for the receiving team.

Because the source system (Stripe) pushes data over the public internet, the receiving endpoint must be highly available and must authenticate requests. If the receiving server is down for five minutes, deliveries during that window fail. 

Well-designed source systems retry failed deliveries later (Stripe retries with exponential backoff for up to three days), but retries mean the same event can arrive more than once. The receiving pipeline must be idempotent. It reads the unique event ID in the payload, checks whether that ID has already been processed, and ignores duplicates, so a network glitch does not count the same refund twice. Events can also arrive out of order, so pipelines should not assume delivery order.

## Summary of Technical Value

Webhooks are a common building block for event-driven, near real-time data ingestion. By replacing constant API polling with server-to-server push notifications, Webhooks reduce wasted computation, ease pressure on API rate limits, and let the Data Lakehouse react to business events within seconds of when they occur.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
