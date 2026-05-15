import re

file_path = "update_all_terms.py"
with open(file_path, "r") as f:
    content = f.read()

# This block represents the 67 new terms across 10 new categories
new_categories = """    ],
    "Data Processing Engines": [
        ("Apache Spark", "A unified analytics engine for large-scale data processing, with built-in modules for streaming, SQL, machine learning, and graph processing."),
        ("Trino", "A highly scalable distributed SQL query engine designed to query massive datasets across varied data sources."),
        ("Presto", "An open-source distributed SQL query engine for running interactive analytic queries against data sources of all sizes."),
        ("Apache Doris", "A modern MPP analytical database known for its extreme speed and ease of use in real-time analytics."),
        ("StarRocks", "A high-performance analytical database designed for real-time, multi-dimensional analytics and blazing fast query speeds."),
        ("ClickHouse", "An open-source, column-oriented database management system that allows generating analytical data reports in real time."),
        ("Apache Druid", "A real-time analytics database designed for fast slice-and-dice analytics on large data sets."),
        ("Apache Pinot", "A real-time distributed OLAP datastore purpose-built to provide ultra-low latency analytics."),
        ("DuckDB", "An incredibly fast, in-process analytical SQL database designed specifically for local data analysis and processing.")
    ],
    "Cloud Data Platforms": [
        ("Snowflake", "A fully managed cloud data platform that provides a unified architecture for data warehousing, data lakes, and data application development."),
        ("BigQuery", "Google Cloud's fully managed, serverless enterprise data warehouse designed to ingest, store, and analyze large datasets."),
        ("MotherDuck", "A collaborative, serverless cloud analytics platform built explicitly around the high-performance DuckDB query engine.")
    ],
    "Orchestration & Data Quality": [
        ("Apache Airflow", "An open-source platform to programmatically author, schedule, and monitor data engineering workflows."),
        ("Dagster", "A modern data orchestrator designed for machine learning, analytics, and ETL pipelines."),
        ("Prefect", "A workflow orchestration tool empowering developers to build, observe, and react to data pipelines seamlessly."),
        ("Mage", "An open-source data pipeline tool for integrating and transforming data, designed as a modern alternative to Airflow."),
        ("Great Expectations", "A shared, open standard for data quality that helps data teams profile, test, and document their data."),
        ("Soda", "An open-source data quality and observability platform that allows teams to detect data issues early in the pipeline.")
    ],
    "Data Integration & Ingestion": [
        ("Airbyte", "An open-source data integration platform allowing you to sync data from applications, APIs, and databases to data warehouses."),
        ("Fivetran", "A fully managed automated data movement platform designed to securely centralize data from disparate sources."),
        ("dlt", "Data Load Tool, an open-source Python library that simplifies building data pipelines to load data into lakes and warehouses."),
        ("Debezium", "An open-source distributed platform for change data capture that points to your databases and converts transactions into event streams.")
    ],
    "Streaming Infrastructure": [
        ("Apache Kafka", "An open-source distributed event streaming platform used by thousands of companies for high-performance data pipelines."),
        ("Apache Pulsar", "A cloud-native, distributed messaging and streaming platform designed for massive scale and multi-tenancy."),
        ("Redpanda", "A Kafka-compatible streaming data platform engineered in C++ to provide extremely low latency and high throughput."),
        ("Confluent", "A fully managed Kafka service offering enterprise-grade event streaming and real-time data processing tools."),
        ("Kafka Connect", "A framework included in Apache Kafka that integrates Kafka with other systems such as databases, key-value stores, and file systems.")
    ],
    "Catalogs & Governance Ecosystem": [
        ("Hive Metastore", "The traditional central repository of metadata for Hadoop and modern data lakes, mapping file paths to table structures."),
        ("Amundsen", "A data discovery and metadata engine developed originally by Lyft to improve the productivity of data analysts."),
        ("DataHub", "An extensible metadata platform for modern data stacks that facilitates data discovery, observability, and federated governance."),
        ("Collibra", "An enterprise data governance platform offering deep capabilities for data stewardship, privacy, and cataloging."),
        ("Alation", "A premier enterprise data catalog platform designed to foster a data culture and optimize data discovery."),
        ("OpenLineage", "An open standard for metadata and lineage collection designed to instrument data pipelines regardless of the specific tool."),
        ("Marquez", "An open-source metadata service for the collection, aggregation, and visualization of a data ecosystem's lineage.")
    ],
    "AI & Vector Frameworks": [
        ("LangChain", "A framework for developing applications powered by language models, heavily used in agentic and RAG architectures."),
        ("LlamaIndex", "A flexible data framework connecting custom data sources to large language models for advanced retrieval and routing."),
        ("DSPy", "A framework for algorithmically optimizing language model prompts and weights rather than relying on manual prompt engineering."),
        ("Milvus", "An open-source vector database built to power embedding similarity search and AI applications."),
        ("Qdrant", "A vector similarity search engine and database offering production-ready APIs for advanced AI search applications."),
        ("Pinecone", "A fully managed vector database designed for building highly scalable vector search into machine learning applications."),
        ("Weaviate", "An open-source vector database that stores both objects and vectors, allowing for combining vector search with structured filtering."),
        ("Chroma", "The AI-native open-source embedding database designed to make it extremely easy to build LLM applications.")
    ],
    "Architectural Patterns": [
        ("Medallion Architecture", "A data design pattern used to logically organize data in a lakehouse into Bronze, Silver, and Gold layers."),
        ("Bronze Layer", "The foundational layer of a medallion architecture containing raw, unprocessed data exactly as it was ingested from source systems."),
        ("Silver Layer", "The intermediate layer of a medallion architecture where raw data is filtered, cleaned, and structurally validated."),
        ("Gold Layer", "The final presentation layer of a medallion architecture featuring highly refined, aggregated data optimized for business intelligence."),
        ("Lambda Architecture", "A data processing architecture designed to handle massive quantities of data by taking advantage of both batch and stream processing."),
        ("Kappa Architecture", "A simplified data processing architecture where all data flows exclusively through a single streaming pipeline rather than separate batch and stream layers."),
        ("Type 1 SCD", "A Slowly Changing Dimension methodology where old data is simply overwritten with new data, losing historical tracking entirely."),
        ("Type 2 SCD", "A Slowly Changing Dimension methodology preserving unlimited history by inserting a new record for every distinct change over time."),
        ("Type 3 SCD", "A Slowly Changing Dimension methodology keeping partial history by adding a new column to track previous values alongside current values.")
    ],
    "System Concepts & Optimizations": [
        ("Materialized Views", "Precomputed data tables containing the results of a query, vastly accelerating access times for complex aggregations."),
        ("Continuous Aggregates", "Dynamic materialized views that automatically update their calculations in the background as new data streams into the system."),
        ("Event Sourcing", "A software architectural pattern where every change to an application's state is captured in an append-only event log."),
        ("CQRS", "Command Query Responsibility Segregation, a pattern separating the operations that read data from the operations that update data."),
        ("Data Locality", "The architectural principle of moving computation extremely close to where the data physically resides to minimize network latency."),
        ("Spill to Disk", "A memory management behavior where engines temporarily write excess data to storage drives when available RAM is completely exhausted."),
        ("Bloom Filters", "Space-efficient probabilistic data structures used to test whether an element is a member of a set, massively speeding up search exclusion."),
        ("Run-Length Encoding", "A very simple form of lossless data compression where runs of data are stored as a single data value and count."),
        ("Dictionary Encoding", "A compression technique replacing repetitive high-cardinality values with small integer keys referencing a lookup dictionary."),
        ("Late Materialization", "A database execution optimization where the engine delays fetching full record attributes until after all heavy filtering has occurred.")
    ],
    "Additional Storage Ecosystem": [
        ("Apache XTable", "An Apache Incubator project allowing users to omni-directionally translate metadata between Iceberg, Delta, and Hudi without rewriting files."),
        ("Apache Kudu", "A columnar storage manager developed for the Hadoop platform, built to enable fast analytics on fast data."),
        ("Apache ORC", "Optimized Row Columnar, a highly efficient columnar data storage format often used alongside Hive and Spark."),
        ("Apache Avro", "A data serialization system providing rich data structures and a compact, fast, binary data format."),
        ("MinIO", "A high-performance, S3-compatible object storage server designed for large-scale AI/ML and data lake applications.")
    ]
}"""

content = content.replace('    ]\n}', new_categories)

# Let's add some of these new keywords to the keyword arrays so they don't all just fall to "Default Data Stack".

# Add AI framework keywords to Agentic & AI
ai_kws = ["langchain", "llamaindex", "dspy", "milvus", "qdrant", "pinecone", "weaviate", "chroma"]
for kw in ai_kws:
    content = content.replace('"keywords": ["agentic", "ai", "llm", "context", "search", "rag", "generative", "prompt", "learning", "reasoning", "orchestration", "tool", "react", "thought", "caching", "window"', 
                              f'"keywords": ["agentic", "ai", "llm", "context", "search", "rag", "generative", "prompt", "learning", "reasoning", "orchestration", "tool", "react", "thought", "caching", "window", "{kw}"')

# Add DE keywords
de_kws = ["airflow", "dagster", "prefect", "mage", "soda", "fivetran", "airbyte", "debezium", "spark", "trino", "presto", "snowflake", "bigquery", "clickhouse", "duckdb", "medallion", "bronze", "silver", "gold", "lambda", "kappa", "scd", "kafka", "pulsar", "redpanda", "confluent", "materialized"]
for kw in de_kws:
    if "dbt" in content: # Just checking to anchor
        # Find the exact array and replace
        # We will use regex
        pass

# Actually regex replacement is safer
de_pattern = r'("keywords": \["etl", "elt", "pipeline", "dag", "schema", "cdc", "query", "sql", "vectorized", "arrow", "parquet", "pushdown", "dbt", "batch", "product", "analytics", "dimension", "datafusion", "paimon", "fluss", "vortex", "lance")\]'
content = re.sub(de_pattern, r'\1, ' + ', '.join([f'"{k}"' for k in de_kws]) + ']', content)

ls_kws = ["kudu", "orc", "avro", "minio", "xtable", "metastore", "amundsen", "datahub", "collibra", "alation", "openlineage"]
ls_pattern = r'("keywords": \["lakehouse", "iceberg", "hudi", "delta", "storage", "manifest", "partition", "snapshot", "z-ordering", "compaction", "zero-etl", "catalog", "nessie", "wap", "deletes", "puffin", "flink", "superset")\]'
content = re.sub(ls_pattern, r'\1, ' + ', '.join([f'"{k}"' for k in ls_kws]) + ']', content)

with open(file_path, "w") as f:
    f.write(content)
