---
title: "What is API Integration?"
meta_title: "What is API Integration? | Expert Data Lakehouse Architecture Guide"
description: "API integration is how systems exchange data through APIs; for data teams it means pulling SaaS data into a lakehouse while handling auth, paging, and limits."
---

# What is API Integration?

API Integration is the use of standardized, programmatic interfaces that let separate software systems authenticate, communicate, and exchange data over a network. In data engineering and the [Data Lakehouse](/data-lakehouse/), API Integration is a primary method for extracting business data held in third-party SaaS platforms (such as Salesforce, Stripe, Zendesk, or Google Analytics).

Extracting data from an internal PostgreSQL database is different: there, a data engineer can often query the underlying tables directly. With a SaaS platform like Salesforce, the engineer has no access to the underlying databases. The supported way to extract that data is to build a pipeline that calls the vendor's official API (Application Programming Interface) and follows its rules for authentication, paging, and usage limits.

## The Mechanics of Extraction

A modern API Integration pipeline (often built with Python, dlt, Fivetran, or Airbyte) has to handle several concerns when talking to a source system.

### 1. Authentication (OAuth 2.0 and Bearer Tokens)
An API rejects unauthorized requests. The pipeline typically authenticates using the OAuth 2.0 protocol: it presents credentials such as a Client ID and Client Secret, and the authorization server returns a short-lived access token, commonly used as a Bearer Token. The pipeline attaches this token to the header of each subsequent request.

### 2. Pagination and State Management
When extracting a large `Customers` object from a CRM via API, the pipeline cannot request millions of records in one response. APIs cap response sizes to protect both sides.

APIs use pagination. The pipeline requests the first page, and the API returns a batch of records along with a "cursor" or next-page token (a bookmark). The pipeline processes the batch, saves it to the Lakehouse, and sends a new request with the cursor to get the next page. It repeats this loop until there are no more pages, and it stores its progress so an interrupted run can resume instead of starting over.

### 3. Rate Limiting and Backoff Logic
SaaS platforms protect their infrastructure with rate limits. If an API allows a set number of requests per minute and the pipeline exceeds it, the API typically returns an `HTTP 429 Too Many Requests` error.

A naive pipeline fails at that point. A well-built integration uses retry logic with exponential backoff: when it receives a 429 (honoring a `Retry-After` header if the API provides one), it pauses, waits progressively longer between retries, and resumes the loop, so long extractions can finish over hours without human intervention.

## Summary of Technical Value

API Integration is a foundational capability for a modern, cloud-based data ecosystem. By handling authentication, pagination, and rate limits reliably, API Integration pipelines break down third-party data silos, extracting data from many SaaS tools and bringing it together in the Open Data Lakehouse.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
