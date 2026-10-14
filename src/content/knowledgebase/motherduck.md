---
title: "What is MotherDuck?"
meta_title: "What is MotherDuck? | Expert Data Lakehouse Architecture Guide"
description: "MotherDuck is a serverless cloud analytics service built on DuckDB that runs queries across your laptop and the cloud and reads Parquet in object storage."
---

# What is MotherDuck?

MotherDuck is a serverless cloud analytics platform built around the DuckDB query engine. DuckDB became popular as a fast, in-process analytical database that runs on a laptop with no server to set up, but on its own it has no shared storage or user management for teams. If an analyst processed a large dataset locally using DuckDB, sharing those results or granting access to teammates was a manual process.

MotherDuck fills this gap by combining local DuckDB execution with the shared storage, scaling, and security of a managed cloud service. It lets data teams run SQL in the cloud or locally, share databases with teammates, and query large datasets without provisioning or managing database servers.

## The Hybrid Execution Architecture

A distinctive feature of MotherDuck is its Hybrid Execution model (MotherDuck now calls it dual execution). Traditional cloud data warehouses (like Snowflake or BigQuery) expect data to be loaded into the cloud, and the cloud servers do all of the work for a query before sending results back.

MotherDuck takes a different approach. Because DuckDB runs efficiently on a laptop, MotherDuck can use local compute as part of a query.

When a data scientist writes a SQL query that joins a tiny local CSV file on their MacBook with a large historical table stored in MotherDuck, the planner decides which parts of the query run where. Work on the large cloud table, such as filtering and aggregation, runs in MotherDuck's cloud, the much smaller result is sent to the laptop, and the local DuckDB instance performs the final join against the local CSV. Splitting the work this way reduces how much data crosses the network.

## WebAssembly (Wasm) and the Browser Experience

Part of MotherDuck's web experience relies on WebAssembly (Wasm). Wasm lets compiled code (written in languages like C++ or Rust) run inside standard web browsers (like Chrome or Safari) at speeds close to native code.

DuckDB is available as a Wasm build (DuckDB-Wasm), and the MotherDuck web interface runs it in the browser. When a user opens the MotherDuck web UI, a DuckDB engine loads and runs inside the browser tab. 

When the user queries data in MotherDuck, the browser-based engine can use Hybrid Execution, so the cloud handles the heavy work and some follow-up operations, such as exploring a result, run locally in the browser. This makes interactive exploration in the web interface responsive, because not every click needs a round trip to a server.

## Serverless Data Sharing and Collaboration

In a conventional data environment, granting a colleague access to a dataset involves requesting complex IAM permissions from DevOps, configuring VPN access, and setting up complicated database credentials.

MotherDuck simplifies this with shares. Because the platform manages authentication and storage, a data engineer can create a read-only share of a database and get a share URL. A colleague with a MotherDuck account attaches that share from DuckDB or the web UI and queries the same data, without anyone copying files or setting up separate database credentials. 

## Integration with the Data Ecosystem

MotherDuck is designed to fit into the wider data ecosystem. 

Because it is powered by DuckDB, it can use DuckDB's file readers and extensions. MotherDuck can query Parquet files stored in Amazon S3 and read nested JSON, and DuckDB itself can attach SQLite databases. It also works with analytics engineering tools like dbt and orchestration platforms like Dagster, so organizations can build version-controlled pipelines that run on MotherDuck.

## Summary of Technical Value

MotherDuck brings the performance of local DuckDB execution to a managed cloud platform. With Hybrid Execution and DuckDB running in the browser through WebAssembly, it offers a fast, low-friction analytical experience. It handles infrastructure management so data teams can focus on collaborative SQL analysis.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
