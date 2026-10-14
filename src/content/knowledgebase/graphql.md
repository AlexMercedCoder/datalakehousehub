---
title: "What is GraphQL?"
meta_title: "What is GraphQL? | Expert Data Lakehouse Architecture Guide"
description: "GraphQL is an open-source query language for APIs that lets clients request only the fields they need from one endpoint. Learn its tradeoffs for data ingestion."
---

# What is GraphQL?

GraphQL is an open-source query and manipulation language for APIs. Facebook developed it internally in 2012 and released it publicly in 2015 to address data transfer inefficiencies common in REST architectures; it is now maintained under the GraphQL Foundation. While REST APIs let the server decide what data each endpoint returns, GraphQL lets the client (for example, a data engineering pipeline) request the specific fields it needs, and nothing else.

For mobile applications and large-scale data engineering, network bandwidth matters. If a traditional REST pipeline needs to extract a list of Customers, it hits the `/customers` endpoint. The server returns a large JSON payload containing dozens of fields for every customer, even if the pipeline only needs a single column (`email_address`). This waste (Over-fetching) slows down ingestion pipelines and can add cloud egress fees. 

## The Architecture of GraphQL

GraphQL typically replaces multiple URL endpoints (like `/customers` and `/orders`) with a single endpoint (e.g., `/graphql`).

### Surgical Querying
To extract data, the data pipeline sends a specific, nested query to the single endpoint. 
If the pipeline only needs the customer's name and the specific titles of the books they ordered, it crafts a query:
```graphql
{
  customer(id: "1045") {
    name
    orders {
      book_title
    }
  }
}
```
The GraphQL server parses this request and returns a JSON payload that mirrors the structure of the query, containing only those two requested fields. The pipeline downloads a much smaller payload, which speeds up ingestion.

### Solving Under-fetching (The N+1 Problem)
Traditional REST APIs also suffer from Under-fetching. If a pipeline needs a list of customers *and* their recent orders, it may first hit the `/customers` endpoint to get the list of 1,000 IDs, then make 1,000 separate network requests to the `/orders/{id}` endpoint to get the details. The round trips add up to significant latency.

GraphQL addresses this. Because the query is nested, the GraphQL server resolves the related data on the backend. The data pipeline issues a single network request, and the server returns the resolved, nested data in one response, cutting down chatty network traffic. (The N+1 problem can still occur inside the server's resolvers, which is why tools like DataLoader batch backend lookups.)

## Complexities in Data Engineering

While GraphQL improves network efficiency, it shifts computational complexity onto the backend server.

Because clients can request deeply nested queries, a poorly designed query can overwhelm the backend operational database with expensive lookups and bring the server down. To protect against this, organizations implement query depth limits and Query Cost Analysis to intercept and block overly complex GraphQL queries before they hit the database.

Furthermore, unlike REST, which works naturally with standard HTTP caching, GraphQL's single endpoint and use of POST requests make standard HTTP caching much less effective, so teams often rely on client-side caches (like Apollo Client's normalized cache) or techniques such as persisted queries sent over GET.

## Summary of Technical Value

GraphQL gives API clients precise control over the data they receive. By reducing the Over-fetching and Under-fetching common in REST architectures, it allows data engineering pipelines and front-end applications to extract complex, relational datasets over the internet with fewer requests and less wasted data.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
