---
title: "What is Serverless Computing?"
meta_title: "What is Serverless Computing? | Expert Data Lakehouse Architecture Guide"
description: "Serverless computing runs code or queries without managing servers, scaling on demand and billing per use. See how serverless engines query Iceberg data."
---

# What is Serverless Computing?

Serverless Computing is a cloud execution model where the cloud provider (AWS, Google Cloud, Azure) handles the management of servers, operating systems, and infrastructure scaling on behalf of the software or data engineer. Despite the name, physical servers still exist; the engineer is simply not responsible for provisioning, patching, scaling, or managing them.

In a traditional cloud environment (Infrastructure as a Service or IaaS), if a data engineer needs to run a Python script to ingest API data, they must manually provision a Virtual Machine (like an Amazon EC2 instance). They must choose the operating system, allocate the exact amount of RAM and CPU, install Python, and size the machine (or configure autoscaling) so it can handle spikes in the API payload. If the script only runs for 5 minutes a day, the company still pays for the server running idly for the other 23 hours and 55 minutes. Serverless computing addresses this inefficiency.

## The Architecture of Event-Driven Execution

Serverless architectures (like AWS Lambda or Google Cloud Functions) operate on an elastic, event-driven model.

### Automatic Scaling and Execution
The data engineer writes their Python code (the "Function") and uploads it to the serverless platform. They define a specific trigger, such as "Execute this code every time a new CSV file lands in this S3 bucket."

When the CSV file lands, the cloud provider starts an isolated execution environment to run the Python code. The code processes the file, and the environment is either reused for later events or shut down. A new environment adds some startup delay, known as a cold start.

If thousands of CSV files land in the bucket at once, the platform runs many copies of the function in parallel, up to the account's concurrency limit (AWS Lambda's default is 1,000 concurrent executions per Region), and then scales back to zero when the work is done. The engineer does not configure a load balancer or a server cluster, though they still choose memory settings and watch concurrency and timeout limits.

### Pay-for-Value Pricing
The economic model of serverless computing is usage-based. Organizations do not pay for idle servers. AWS Lambda, for example, bills by request count and by duration in 1-millisecond increments, scaled by the memory allocated. For steady, high-volume workloads, provisioned servers can still be cheaper.

## Serverless in the Data Lakehouse

Serverless computing has expanded beyond simple scripts into analytical engines. 

Platforms like Amazon Athena and Google BigQuery operate as serverless query engines, and managed lakehouse platforms such as Dremio Cloud offer autoscaling engines that grow and shrink with demand. A business analyst connects a dashboard to the platform and runs a complex SQL query against large [Apache Iceberg](/apache-iceberg/) tables. The service allocates distributed compute for the query, executes it, returns the results, and releases the capacity. The analyst gets on-demand compute without configuring nodes.

## Summary of Technical Value

Serverless Computing reduces the infrastructure work engineers have to do. By abstracting the physical infrastructure layer, it lets data engineers spend more of their time on business logic and data pipelines. It scales automatically within platform limits to handle traffic spikes, and its usage-based pricing removes the cost of idle servers, though cold starts, execution time limits, and per-request pricing make it a poor fit for some workloads.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
