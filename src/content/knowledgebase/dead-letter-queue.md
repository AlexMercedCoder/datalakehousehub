---
title: "Dead Letter Queue (DLQ): Handling Bad Records in Lakehouse Pipelines"
meta_title: "Dead Letter Queue (DLQ) for Kafka and Iceberg | Glossary"
description: "A dead letter queue holds messages a consumer could not process so the rest keep flowing. See how DLQs work in Kafka Connect, SQS, and Iceberg pipelines."
---

A Dead Letter Queue (DLQ) is a separate queue or topic where a messaging system or consumer puts messages it could not process, so that one bad message does not block the messages behind it. The failed message is kept, with information about why it failed, so engineers can inspect it, fix the cause, and replay it.

Most failures come from the data, not the infrastructure: a producer sends the string `"APPLE"` in a field the consumer expects to be an integer, a schema changes without warning, or a record references a key that does not exist yet.

## The Poison Message Problem

Without a DLQ, a single unprocessable message (often called a poison message or poison pill) can stall a pipeline:

1. The consumer reads the message and throws an exception.
2. It never acknowledges the message, or never commits its offset.
3. The queue redelivers the message, or the consumer restarts from the same offset.
4. The same failure happens again, and every valid message behind it waits.

## How a DLQ Breaks the Loop

The usual fix is a retry limit followed by redirection.

- **Amazon SQS:** a redrive policy sets `maxReceiveCount`. After a message has been received that many times without being deleted, SQS moves it to the configured dead-letter queue.
- **RabbitMQ:** a queue can name a dead letter exchange. Rejected, expired, or overflowed messages are republished there and routed to a DLQ.
- **Apache Kafka:** the broker has no built-in DLQ, because consumers track their own offsets. Applications implement the pattern by producing failed records to a separate topic. Kafka Connect does this for sink connectors with `errors.tolerance=all` and `errors.deadletterqueue.topic.name`, and `errors.deadletterqueue.context.headers.enable=true` adds headers describing the original topic, partition, offset, and error.

Once the bad message is moved aside, the consumer continues with the next one.

## Working the DLQ

A DLQ is only useful if someone looks at it. Good practice:

- Alert when the DLQ receives messages or when its depth grows.
- Store the error reason, source location, and timestamp with each message.
- Fix the producer or the consumer, then replay messages back to the main topic or queue. Make the consumer idempotent so replays do not create duplicates.
- Set a retention period that gives the team time to act before messages expire.

## DLQs in Lakehouse Pipelines

In a lakehouse, the same idea applies at two levels.

| Pattern | Where it applies | What happens to bad data |
|---|---|---|
| Message DLQ topic | Streaming ingestion with Kafka Connect, Flink, or Spark Structured Streaming | Failed records go to a separate topic; good records keep landing in the Bronze [Apache Iceberg](/knowledgebase/apache-iceberg/) table |
| Quarantine table | Batch or streaming jobs that validate rows | Rows that fail checks are written to a `_quarantine` Iceberg table with an error column, queryable with SQL |
| [Write-audit-publish](/knowledgebase/write-audit-publish/) | Whole batches | The batch is written to an Iceberg branch, checked, and merged to `main` only if it passes |

A quarantine table is often more practical than a DLQ topic for analytics teams, because bad rows can be counted, grouped by error, and fixed with the same SQL engines used for the rest of the lakehouse. The DLQ topic still matters upstream, where a record that cannot even be deserialized never reaches a table.

For related patterns, see [Kafka Connect to Iceberg: How the Commit Actually Works](/blog/kafka-connect-iceberg-commits/), [Write-Audit-Publish with Apache Iceberg Branches](/blog/write-audit-publish-iceberg-branches/), and [Anomaly Quarantine on Apache Iceberg](/blog/goal-directed-data-quality-agents-iceberg/).

## Summary

A dead letter queue keeps one unprocessable message from blocking a pipeline by moving it aside after a set number of failures and preserving it for diagnosis and replay. In lakehouse pipelines it pairs with quarantine tables and write-audit-publish so bad data is isolated at every stage instead of silently dropped.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
