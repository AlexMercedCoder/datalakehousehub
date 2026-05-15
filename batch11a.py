import os

docs = {
    "data-product.md": """---
title: "What is a Data Product?"
meta_title: "What is a Data Product? | Expert Data Lakehouse Architecture Guide"
description: "A comprehensive guide to Data Products. Learn about Data Mesh principles, domain ownership, and treating analytical data like commercial software."
---

# What is a Data Product?

A Data Product is a foundational architectural concept within the Data Mesh paradigm. It dictates that analytical data should no longer be treated as a passive byproduct of operational software (e.g., raw logs dumped blindly into an Amazon S3 bucket). Instead, data must be treated exactly like a formal, commercial software product, engineered specifically to delight its internal consumers (data scientists, business analysts, and executives).

Historically, software engineers building an e-commerce application cared exclusively about making the application run quickly. They routinely generated incredibly messy, chaotic JSON log files because the logs were only meant for temporary debugging. When the centralized data engineering team attempted to use those logs to build a financial dashboard, the pipelines constantly crashed. The software engineers did not care, because the data was just "exhaust." The concept of the Data Product entirely reverses this dynamic, enforcing strict accountability and ownership over the data structure.

## The Characteristics of a Data Product

To officially qualify as a Data Product, a dataset must adhere to specific, rigorous engineering standards defined by Zhamak Dehghani's original Data Mesh architecture.

### 1. Discoverable and Understandable
A Data Product cannot exist silently in a hidden database. It must be explicitly registered in a central Enterprise Data Catalog (like Collibra or Alation). Furthermore, it must be completely self-describing. It requires a detailed Business Glossary, explicitly defining what every column means (e.g., distinguishing between `gross_revenue` and `net_revenue`), ensuring a new data scientist can understand the dataset immediately without interviewing the original engineer.

### 2. Addressable and Secure
A Data Product must possess a permanent, unique global address (like a specific REST API endpoint or a permanent Iceberg table URI). It must also implement rigorous, centralized Role-Based Access Control (RBAC). The owner of the Data Product strictly dictates exactly which internal departments are legally allowed to query it.

### 3. Trustworthy (Strict SLAs)
This is the most critical shift. A Data Product must be backed by strict Service Level Agreements (SLAs). The domain team owning the product guarantees that the data will be updated every day by 8:00 AM, and guarantees that the `user_id` column will never contain a `NULL` value. If the Data Product violates this SLA, automated data observability tools immediately trigger high-severity alerts, exactly as if a production website had crashed.

### 4. Interoperable
Data Products must adhere to global enterprise standards. A single organization might possess a "Sales Data Product" managed by the European team and a "Logistics Data Product" managed by the Asian team. Both products must use the exact same foundational Data Formats (e.g., Apache Parquet) and the exact same naming conventions for cross-cutting concepts (e.g., using standard ISO country codes), guaranteeing that a central analyst can `JOIN` the two disparate products together effortlessly.

## The Anatomy of the Product

A Data Product is not just a table. It is an architectural quantum—the smallest deployable unit in the data mesh. It consists of three components:

1. **The Code:** The dbt SQL models, the Python ingestion scripts, and the Soda data quality YAML configurations required to build and test the data.
2. **The Data and Metadata:** The actual physical Apache Parquet files and the Iceberg manifests storing the data, alongside the rich human descriptions.
3. **The Infrastructure:** The automated CI/CD deployment pipelines and the dedicated compute resources required to physically serve the data to consumers.

## Summary of Technical Value

Treating data as a Product forces a profound organizational shift. By holding specific domain teams strictly accountable for the usability, reliability, and security of the data they generate, organizations eliminate the immense friction caused by centralized data engineering bottlenecks. It ensures that analytical data is engineered with the same extreme rigor, documentation, and automated testing traditionally reserved exclusively for mission-critical software applications.
""",
    "time-travel.md": """---
title: "What is Time Travel?"
meta_title: "What is Time Travel in Data Lakes? | Expert Data Lakehouse Architecture Guide"
description: "A comprehensive guide to Time Travel. Learn how Open Table Formats like Apache Iceberg and Delta Lake enable querying historical data instantly."
---

# What is Time Travel?

Time Travel is an immensely powerful architectural feature introduced by modern Open Table Formats (like Apache Iceberg, Apache Hudi, and Delta Lake). It allows a data engineer, data scientist, or business analyst to execute a standard SQL query against a massive data lakehouse table and view the exact, mathematically perfect state of that table as it existed at a specific microsecond in the past.

Before the invention of Open Table Formats, data lakes were built directly on raw cloud object storage (Amazon S3) or HDFS. If an automated pipeline accidentally executed a massive `DELETE` script that erased 500,000 legitimate customer records, the data was permanently gone. Recovering from this catastrophe required the data engineering team to manually restore massive storage backups from magnetic tape or distant cold-storage archives, a process that frequently took days and resulted in massive organizational downtime. Time Travel completely mitigates this risk by providing instant, localized historical recovery.

## The Architecture of Snapshot Isolation

Time Travel is not magic; it is the direct result of how modern table formats manage metadata through strict Snapshot Isolation.

When a pipeline inserts, updates, or deletes data in an Apache Iceberg table, it never physically overwrites the existing Apache Parquet files on the hard drive. Instead, it writes brand new Parquet files containing the new data. Iceberg then generates a new Metadata Manifest (a "Snapshot"). This snapshot contains explicit pointers to all the new Parquet files *and* all the surviving old Parquet files, while deliberately ignoring the Parquet files that were logically deleted.

Because the old, "deleted" Parquet files remain physically untouched on the cloud storage drive, the history of the table is perfectly preserved. The Iceberg catalog simply maintains a massive, chronological list of every single Snapshot the table has ever possessed.

## Executing a Time Travel Query

Executing a Time Travel query requires absolutely no complex infrastructure restoration; it is handled entirely via standard SQL extensions in engines like Trino, Spark, or Dremio.

An analyst can query the past using two primary mechanisms:

### 1. Timestamp-Based Travel
If an analyst knows a catastrophic pipeline ran at 2:00 AM, they can simply query the table as it existed at 1:59 AM:
`SELECT * FROM customers FOR SYSTEM_TIME AS OF '2026-05-14 01:59:00';`
The query engine reads the timestamp, searches the metadata history, locates the exact Snapshot that was active at that millisecond, and reads the specific underlying Parquet files associated strictly with that snapshot.

### 2. Snapshot ID-Based Travel
Every commit generates a unique cryptographic ID. If a data engineer wants to explicitly compare the current data against the state of the table exactly three commits ago to debug a subtle math error, they query the specific ID:
`SELECT * FROM customers FOR SYSTEM_VERSION AS OF 10984384938;`

## Critical Use Cases

Beyond disaster recovery, Time Travel unlocks profound analytical capabilities:

* **Machine Learning Reproducibility:** If a data scientist trains a fraud detection model on May 1st, and the model suddenly begins failing on June 1st, they must determine why. Using Time Travel, they can point the training algorithm at the exact historical Snapshot from May 1st. This allows them to perfectly reproduce the original mathematical environment, an absolute necessity for strict algorithmic debugging.
* **Audit and Compliance:** In heavily regulated industries (like banking), government auditors frequently demand to see exactly what financial data a company possessed on a specific day three years ago. Time Travel allows analysts to generate legally binding historical reports instantly.

## Managing Storage Costs (Vacuuming)

Because Time Travel requires preserving old, logically deleted files, it will eventually consume massive amounts of expensive cloud storage. Open Table Formats manage this using "Vacuum" or "Expire Snapshots" maintenance routines. A data engineer configures the table to maintain history for exactly 30 days. Every night, an automated job runs, explicitly identifying and physically deleting the raw Parquet files that are older than 30 days and no longer referenced by the active Snapshot tree, perfectly balancing historical agility with strict cost management.

## Summary of Technical Value

Time Travel fundamentally transforms the reliability of the Data Lakehouse. By leveraging immutable files and strict snapshot metadata, it provides instantaneous disaster recovery, absolute mathematical reproducibility for machine learning, and effortless historical auditing. It provides data engineering teams with an absolute safety net, eliminating the catastrophic risks associated with massive data manipulation.
""",
    "schema-evolution.md": """---
title: "What is Schema Evolution?"
meta_title: "What is Schema Evolution? | Expert Data Lakehouse Architecture Guide"
description: "A comprehensive guide to Schema Evolution. Learn how Apache Iceberg safely adds, drops, and renames columns without rewriting multi-terabyte data lakes."
---

# What is Schema Evolution?

Schema Evolution is the architectural capability of a database or data lakehouse to safely and instantly alter its structural definition (adding, dropping, renaming, or changing the data type of columns) without corrupting existing data or requiring massive, expensive table rewrites.

In legacy Apache Hadoop environments built around the Hive Metastore, altering a schema was incredibly dangerous. The Hive Metastore mapped columns based on their absolute physical position in the file. If an engineer decided to drop the third column (`middle_name`), the fourth column (`last_name`) suddenly shifted into the third position. When an analyst queried the data, the engine would attempt to read the `last_name` data using the `middle_name` logic, instantly returning chaotic, corrupted gibberish. To safely change a schema in Hive, organizations were physically forced to execute massive Spark jobs to completely rewrite petabytes of Parquet files, a process that cost tens of thousands of dollars and caused massive system downtime.

Modern Open Table Formats (specifically Apache Iceberg) were engineered explicitly to eliminate this nightmare.

## The Architecture of ID-Based Tracking

Apache Iceberg achieves perfect, instantaneous schema evolution because it completely abandons physical position tracking. Instead, it utilizes strict, immutable Unique Column IDs.

When a table is created in Iceberg, the catalog assigns a permanent internal ID to every column.
* `first_name` = ID 1
* `middle_name` = ID 2
* `last_name` = ID 3

When the engine physically writes a Parquet file to Amazon S3, it embeds these exact IDs directly into the Parquet file's internal metadata footer. 

### Dropping and Renaming Columns safely
If a data engineer executes an `ALTER TABLE DROP COLUMN middle_name` command, Iceberg does absolutely nothing to the physical Parquet files resting on the hard drive. 

Iceberg simply updates its lightweight, central metadata manifest. It removes ID 2 from the active schema definition. When a user queries the table, the query engine reads the manifest, sees that ID 2 is no longer active, and simply ignores it when reading the underlying files. The `last_name` column remains safely bound to ID 3. 

Similarly, if an engineer executes `ALTER TABLE RENAME COLUMN first_name TO given_name`, Iceberg simply updates the string label in the metadata. ID 1 remains completely unchanged. Because the underlying Parquet files map everything to ID 1, the historical files and the newly written files instantly understand that they belong to the exact same column, without moving a single physical byte.

## Type Promotion

Beyond simple renaming, schema evolution must handle changing data types smoothly. Operational systems frequently upgrade their metrics. A system might originally record a `revenue` column as a standard `Integer` (which holds a maximum value of 2 billion). If the company grows and revenue surpasses 2 billion, the operational system upgrades the column to a `BigInt` (Long).

If the Data Lakehouse cannot evolve, the ingestion pipeline will crash instantly due to a strict type mismatch.

Iceberg supports safe Type Promotion. An engineer can execute an `ALTER TABLE ALTER COLUMN revenue TYPE bigint`. Iceberg understands that an `Integer` can be mathematically upcast to a `BigInt` perfectly without any data loss. It updates the central schema. When the query engine reads older Parquet files containing the smaller Integers, it automatically pads them in memory to match the new `BigInt` structure, allowing analysts to query ten years of historical data seamlessly alongside the new data.

## Summary of Technical Value

Schema Evolution completely eradicated one of the most expensive and dangerous operational bottlenecks in data engineering. By utilizing strict, immutable Column IDs rather than physical positioning, Open Table Formats like Apache Iceberg allow organizations to add, drop, rename, and upcast columns instantaneously via simple metadata updates. It guarantees that the Data Lakehouse can rapidly adapt to chaotic, constantly changing upstream operational software without ever requiring massive, multi-terabyte data rewrites.
""",
    "write-audit-publish.md": """---
title: "What is Write-Audit-Publish (WAP)?"
meta_title: "What is Write-Audit-Publish (WAP)? | Expert Data Lakehouse Architecture"
description: "A comprehensive guide to the Write-Audit-Publish (WAP) pattern. Learn how data teams use isolated branches and quality tests to prevent data corruption."
---

# What is the Write-Audit-Publish (WAP) Pattern?

The Write-Audit-Publish (WAP) pattern is a strict architectural methodology used in advanced data engineering to guarantee absolute data quality before new data is exposed to business consumers. It borrows heavily from the software engineering concept of CI/CD (Continuous Integration/Continuous Deployment), ensuring that corrupted data is proactively quarantined and destroyed before it ever reaches a production dashboard.

Historically, data engineering pipelines operated on a highly dangerous "Write-and-Pray" model. A massive ETL job would run at 2:00 AM, extracting data from a third-party API and writing it directly into the live production `Sales_Fact` table. If the API had silently changed its data format (e.g., sending revenue in cents instead of dollars), the pipeline would successfully write mathematically corrupted data directly into production. The CEO would open their dashboard at 8:00 AM, see wildly inaccurate revenue numbers, and lose all trust in the data team. 

The WAP pattern solves this by introducing an isolated staging environment directly into the production deployment flow.

## The Three Phases of WAP

The pattern dictates that data must sequentially pass through three distinct phases, enforced strictly by the pipeline orchestrator (like Apache Airflow or Dagster).

### 1. Write (The Isolated Staging Phase)
When the ingestion pipeline runs, it does NOT write data to the production table. Instead, it writes the data to a completely isolated, invisible environment. 

In a traditional database, this might involve writing to a temporary table (`staging_sales_fact`). In a modern Data Lakehouse utilizing Project Nessie (or the Dremio Open Catalog), this is achieved exponentially faster through zero-copy Branching. The orchestrator creates an isolated Git-like branch off the main catalog, and the pipeline executes its massive multi-terabyte write operations directly onto that invisible branch. The production `main` branch remains entirely untouched and perfectly stable for business users.

### 2. Audit (The Quality Gate)
Once the massive write is complete, the data sits quietly in isolation. The orchestrator triggers the Audit phase.

It deploys rigorous, automated data quality frameworks (like Great Expectations or SodaCL) explicitly against the isolated staging environment. These frameworks run thousands of programmatic assertions:
* `assert max(revenue) < 10000000` (Checking for massive outliers).
* `assert null_count(customer_id) == 0` (Checking for critical missing data).
* `assert row_count > historical_average * 0.8` (Checking for missing API payloads).

If the data fails even a single critical assertion, the orchestrator intentionally crashes the pipeline. The orchestrator alerts the data engineering team immediately. Because the data is isolated on a branch, the corrupted data simply evaporates. The production environment remains perfectly safe.

### 3. Publish (The Atomic Merge)
Only if every single mathematical assertion passes with 100% success does the orchestrator proceed to the Publish phase. 

In a legacy environment, the orchestrator executes a massive SQL `INSERT` statement to move the data from the staging table into the production table. In a modern Nessie-backed Data Lakehouse, the orchestrator simply issues a single `MERGE` command. The isolated branch is instantly and atomically merged into the `main` branch. The new data appears to the business users instantaneously, carrying an absolute, mathematical guarantee of perfect data quality.

## Implementing WAP at Scale

While the logic of WAP is simple, implementing it historically required immense storage duplication (copying terabytes of data into staging tables). 

The modern Open Data Lakehouse entirely removes this friction. Because table formats like Apache Iceberg manage data through metadata manifests rather than physical directories, writing data to an isolated branch only requires generating a few kilobytes of text files. The physical Parquet data files are written to S3 exactly once. When the branch is published, the Iceberg catalog simply points the production manifest at the new Parquet files. This zero-copy architecture allows organizations to implement the highly rigorous WAP pattern across petabyte-scale workloads without incurring any additional cloud storage or computational transfer costs.

## Summary of Technical Value

The Write-Audit-Publish (WAP) pattern is the ultimate architectural defense against data corruption. By physically isolating incoming data, running exhaustive programmatic quality assertions, and demanding perfect compliance before exposing the data to the business, WAP transitions data engineering from a reactive debugging culture into a highly robust, proactive software discipline. It is the absolute standard for ensuring enterprise trust in the data lakehouse.
""",
    "hidden-partitioning.md": """---
title: "What is Hidden Partitioning?"
meta_title: "What is Hidden Partitioning? | Expert Data Lakehouse Architecture Guide"
description: "A comprehensive guide to Hidden Partitioning. Learn how Apache Iceberg solves the massive usability and performance flaws of legacy Hive directories."
---

# What is Hidden Partitioning?

Hidden Partitioning is a highly advanced storage management feature introduced natively by Apache Iceberg. It was explicitly engineered to solve the catastrophic usability flaws, performance bottlenecks, and frequent data corruption issues inherent in the legacy Apache Hive partitioning model that dominated the original Big Data era.

Partitioning is the fundamental strategy used to organize massive datasets to accelerate queries. If a company generates petabytes of server logs, dumping them all into a single massive folder makes querying them impossible. Instead, data engineers partition the data (typically by Date). When an analyst queries the logs for a specific day, the query engine uses the partitions to instantly skip 99% of the irrelevant data, drastically reducing I/O operations. However, how the system physically tracks and manages these partitions dictates the entire usability of the data lake.

## The Flaws of Legacy Hive Partitioning

For a decade, the industry relied entirely on the Hive Metastore. Hive implemented partitioning using explicit, physical directory structures (e.g., `s3://data/logs/year=2026/month=05/day=14/`).

This explicit physical structure created massive, dangerous burdens for both data engineers and business analysts.

### The Analyst Burden (Query Complexity)
If a table was physically partitioned by `year`, `month`, and `day`, the business analyst physically had to know that structure to query it efficiently. 
If an analyst queried: `SELECT * FROM logs WHERE event_timestamp = '2026-05-14 12:00:00'`, Hive would panic. Because `event_timestamp` was not explicitly listed as a partition column, Hive would blindly scan the entire petabyte-scale data lake, taking hours and costing thousands of dollars.

To execute a fast query, the analyst was forced to rewrite their SQL explicitly to match the physical hard drive layout: 
`SELECT * FROM logs WHERE year = 2026 AND month = 05 AND day = 14 AND event_timestamp = '2026-05-14 12:00:00'`. This forced non-technical users to understand the complex physical layout of the infrastructure.

### The Engineering Burden (Partition Evolution)
If the data engineering team decided that the table was growing too massive and they needed to change the partitioning strategy from `daily` to `hourly`, it was impossible to do so seamlessly. Changing the partition scheme in Hive required creating an entirely new physical table and executing a massive, multi-terabyte Apache Spark job to rewrite years of historical data into the new directory structure.

## The Architecture of Hidden Partitioning

Apache Iceberg completely abandoned physical directory partitioning in favor of Metadata Partitioning. 

In Iceberg, the physical files are still organized to optimize reading, but that organization is tracked explicitly in the Iceberg Manifest files, entirely hidden from the end user.

### Seamless Query Optimization
When creating an Iceberg table, the data engineer simply defines a Transform function on the timestamp:
`PARTITIONED BY (days(event_timestamp))`

When the business analyst executes their natural query: `SELECT * FROM logs WHERE event_timestamp = '2026-05-14 12:00:00'`, Iceberg intercepts it. Iceberg natively understands the `days()` transform. It automatically derives the partition value internally and perfectly limits the file scan to exactly the correct physical files. The analyst writes simple, intuitive SQL; the engine handles the complex file pruning automatically.

### Instant Partition Evolution
Because Iceberg tracks partitions strictly via internal metadata manifests rather than rigid physical directories, Partition Evolution is instantaneous.

If the engineering team decides to change the partition strategy from `daily` to `hourly`, they simply issue an `ALTER TABLE` command. Iceberg updates the metadata. All newly ingested data is partitioned hourly. All historical data remains partitioned daily. When an analyst queries the table, Iceberg seamlessly combines both partition strategies in the background, executing a perfectly optimized query across the entire dataset without rewriting a single historical byte.

## Summary of Technical Value

Hidden Partitioning fundamentally decoupled the logical querying of data from the physical layout of the hard drive. By handling complex partition pruning via internal metadata transforms, Apache Iceberg allows business analysts to write highly intuitive SQL without causing catastrophic full-table scans. Furthermore, it empowers data engineers to evolve massive multi-terabyte storage strategies instantly, providing unparalleled agility to the modern Open Data Lakehouse.
"""
}

kb_dir = "src/content/knowledgebase"
for filename, content in docs.items():
    filepath = os.path.join(kb_dir, filename)
    with open(filepath, "w") as f:
        f.write(content)
