---
title: "What is Unstructured Data?"
meta_title: "What is Unstructured Data? | Data Lakehouse Hub Knowledge Base"
description: "Unstructured data is information with no predefined schema, like text, PDFs, audio, and images, and how lakehouses and AI make it easier to store and analyze."
---

# What is Unstructured Data?

## Introduction to Unstructured Data

If you ask a traditional database administrator what "data" is, they will describe a spreadsheet. They picture organized rows and columns containing names, dates, and currency values. This is **Structured Data**, and it is what relational databases (like PostgreSQL) were built to handle.

However, much of the information organizations hold is not structured this way. 

That information is **Unstructured Data**. This includes raw text files, emails, PDF documents, legal contracts, audio recordings, video surveillance footage, and JPEG images. It has no predefined data model. It does not fit neatly into rows and columns. 

Historically, organizations analyzed little of their unstructured data because the tools to do so were limited. Today, unstructured data is far more useful: it is the main training material for Large Language Models (LLMs), and those models can now extract information from it.

## The Challenge of Unstructured Data

Unstructured data presents three major challenges to enterprise architecture.

### 1. Storage Scale and Cost
Storing 10 million MP4 video files inside a Snowflake or Oracle database is impractical and expensive. Databases are designed for rows and columns, and their storage costs more per gigabyte than object storage. 
Unstructured data is large. It requires low-cost, highly scalable storage. This is why unstructured data is usually stored in **Object Storage** (like [Amazon S3](https://datalakehousehub.com/knowledgebase/amazon-s3/), Azure Blob, or Google Cloud Storage), which serves as the foundation of the Data Lake.

### 2. Search and Retrieval
If you want to find all customers named "Alex" in a structured database, you write a simple SQL query: `SELECT * FROM users WHERE name = 'Alex'`. The database uses a B-Tree index to find the answer in milliseconds.
How do you find all the PDF documents that mention "Alex"? A standard SQL equality filter will not work, because the text is inside files rather than columns. 
Historically, organizations solved this using full-text search engines (like Elasticsearch). Today, they solve it by converting the text into numeric vectors using an Embedding Model, and storing those arrays in a **Vector Database** (like Pinecone or Milvus). 

### 3. Extracting Value (The Rise of AI)
A JPEG image of a receipt is not usable by a financial dashboard as is. Extracting the "Total Amount" from the image is hard to do reliably with traditional rule-based code. 
Extracting value from unstructured data usually requires Artificial Intelligence. 
*   **[Computer Vision](https://datalakehousehub.com/knowledgebase/computer-vision/)** models analyze the receipt to extract the numbers.
*   **Natural Language Processing (NLP)** models read 10,000 customer service emails and categorize them as "Angry" or "Happy" (Sentiment Analysis).
*   **Speech-to-Text** models transcribe call-center recordings into text so they can be searched.

## Unifying the Data: The Lakehouse and AI

A common architectural problem is that structured data lives in the Data Warehouse, and unstructured data lives in the Data Lake. If a data scientist wants to predict customer churn, they need *both* (the user's structured purchase history AND the text of their unstructured complaint emails).

The **[Data Lakehouse](https://iceberglakehouse.com/iceberg/data-lakehouse/)** addresses this. By keeping structured Parquet tables and unstructured files such as PDFs in the same object storage (for example, [Amazon S3](https://datalakehousehub.com/knowledgebase/amazon-s3/)), it provides a single place to work with both. 

With the advent of **[Agentic AI](https://datalakehousehub.com/knowledgebase/agentic-ai/)** and modern SQL functions (like [Dremio](https://opendatalakehouse.com/kb/dremio/)'s AI integrations), analysts can bridge the gap. In Dremio, for example, a SQL query can list files in object storage with `LIST_FILES`, pass their contents to an LLM function such as `AI_CLASSIFY()` or `AI_GENERATE()`, and join the results with the structured purchase history in a single view.

## Conclusion

Unstructured data is a large share of what enterprises store, but it has historically been invisible to traditional analytics. Generative AI has turned unstructured data from a storage cost into a usable source of insight. Organizations that build architectures for ingesting, embedding, and reasoning over text, audio, and video will be able to answer questions their structured data alone cannot.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
