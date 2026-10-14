---
title: "What is Data Serialization Formats (Protobuf, Thrift)?"
meta_title: "What is Data Serialization Formats (Protobuf, Thrift)? | Data Lakehouse Hub Knowledge Base"
description: "Protobuf and Thrift are schema-based binary serialization formats that encode data more compactly than JSON. Learn how Protobuf works and evolves its schemas."
---

# What is Data Serialization Formats (Protobuf, Thrift)?

## Introduction to Serialization

When a Python application running on Server A needs to send a customer profile (like a `User` object containing a name and age) to a Java application running on Server B, it cannot simply push its computer memory over the internet. Memory structures are unique to specific programming languages and CPU architectures.

The data must be translated into a universal format (like a string of characters or a stream of raw bytes) that can be transmitted over a network wire. This translation process is called **Serialization** (or Encoding). When Server B receives the stream and reconstructs the `User` object in Java, it is called **Deserialization** (or Decoding).

## The Inefficiency of JSON

For most web development, **JSON (JavaScript Object Notation)** is the default serialization format. 

```json
{"user_id": 12345, "name": "Alex", "is_active": true}
```

JSON is popular because it is human-readable. You can open a JSON file in a text editor and immediately understand the data.
However, JSON is **inefficient** for high-performance, internal microservice communication. 
1.  **Size Overhead**: To send the number `12345`, JSON sends the literal characters `1`, `2`, `3`, `4`, `5`. It also sends all the quotation marks, colons, and curly braces. This consumes extra network bandwidth.
2.  **Slow Parsing**: Server B has to read the text character by character, figure out where the strings end, and convert the text "12345" back into an actual integer in CPU memory. This consumes significant CPU cycles.

## The Solution: Binary Serialization

For large, high-throughput distributed systems (like Google's internal microservices or an [Apache Kafka](https://datalakehousehub.com/knowledgebase/apache-kafka/) stream), engineers use **Binary Serialization Formats** like **Protocol Buffers (Protobuf)** (developed by Google) or **Apache Thrift** (originally developed at Facebook).

These formats give up human readability in exchange for compact size and faster parsing.

### How Protobuf Works
Instead of sending the field names in every single message (like `"user_id":`), Protobuf uses a **Schema Contract**.
The developer writes a `.proto` file defining the structure:
```protobuf
message User {
  int32 user_id = 1;
  string name = 2;
  bool is_active = 3;
}
```
Using a compiler, this schema generates native Python and native Java code.
When Server A sends the data, it does not send the string `"user_id"`. It sends a small binary key containing field number `1` (and its wire type), followed by the varint-encoded integer `12345`. 

*   **Bandwidth**: The payload is typically much smaller than the equivalent JSON.
*   **Speed**: Because there is no text parsing required, the CPU deserializes the binary stream into a native Java object quickly.

## Schema Evolution

A key strength of Protobuf and Thrift is **Forward and Backward Compatibility**.

In a company with hundreds of microservices, if Team A decides to add a "phone_number" field to the User object, they cannot update every microservice at the same time. 

With JSON, adding a field might break older services that use strict parsing. 
With Protobuf, schemas use numeric tags (`user_id = 1`, `phone_number = 4`). If an old Java service receives a message containing Tag 4, it skips that field and processes the rest of the message normally. This allows large engineering organizations to upgrade microservices independently without breaking the rest of the architecture.

## Conclusion

While JSON remains the dominant format for public-facing REST APIs and web browsers, Binary Serialization formats (Protobuf, Thrift, Avro) are the invisible plumbing of the modern backend. By enforcing schema contracts and encoding data into compact binary streams, these formats provide the performance and safe schema evolution needed to run large, heavily trafficked microservice and big data architectures.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
