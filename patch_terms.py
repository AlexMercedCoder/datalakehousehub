import re

file_path = "update_all_terms.py"

with open(file_path, "r") as f:
    content = f.read()

# 1. Add new terms to the dictionary
new_terms = """    ],
    "Advanced Apache Iceberg": [
        ("REST Catalog Specification", "An open standard API defining how compute engines communicate consistently with Apache Iceberg catalogs."),
        ("Project Nessie", "A catalog for data lakes offering Git-like version control, branching, and merging capabilities for tables."),
        ("Write-Audit-Publish", "A data engineering pattern where data is written to a hidden branch, validated, and then published to production."),
        ("Row-Level Deletes", "An advanced table capability allowing individual row removals without requiring entire data file rewrites."),
        ("Puffin Files", "A specialized file format within Apache Iceberg used to store detailed statistics and indexes to accelerate query planning.")
    ],
    "Modern Data Engineering": [
        ("Analytics Engineering", "The discipline bridging data engineering and data analysis, focusing on transforming data into clean, ready-to-use datasets."),
        ("Star Schema", "A dimensional modeling structure where a central fact table is connected directly to multiple normalized dimension tables."),
        ("Snowflake Schema", "An extension of the star schema where dimension tables are highly normalized into multiple related tables."),
        ("Slowly Changing Dimensions", "Techniques used in data warehousing to manage and track historical data modifications over time."),
        ("Micro-batching", "A processing architecture executing data streams as frequent, small batches to simulate near real-time analytics."),
        ("Data Product", "The core concept treating reliable, maintained datasets as formalized products with guaranteed service level agreements.")
    ],
    "AI and Agentic Architecture": [
        ("Arrow Flight SQL", "A high-performance protocol leveraging Apache Arrow to vastly accelerate data transfer between engines and client applications."),
        ("Chain of Thought", "An AI prompting methodology requiring models to explicitly generate step-by-step reasoning before providing a final answer."),
        ("ReAct Framework", "An operational framework allowing autonomous agents to interleave reasoning processes directly with external programmatic tool actions."),
        ("Semantic Caching", "The practice of storing prior AI responses to semantically identical queries to minimize repetitive computational costs."),
        ("Context Window Management", "The engineering practice of chunking, filtering, and prioritizing information to fit within a language model's memory limits.")
    ],
    "Ecosystem Integrations": [
        ("Apache Flink", "An incredibly powerful open-source stream processing framework engineered for stateful computations over unbounded data streams."),
        ("dbt", "Data Build Tool, a popular transformation workflow that enables data analysts and engineers to execute SQL-based ELT."),
        ("Apache Superset", "An enterprise-ready business intelligence web application designed to visually explore and present massive data volumes.")
    ]
}"""

content = content.replace('    ]\n}', new_terms)

# 2. Update keywords in Lakehouse & Storage
content = content.replace(
    '"keywords": ["lakehouse", "iceberg", "hudi", "delta", "storage", "manifest", "partition", "snapshot", "z-ordering", "compaction", "zero-etl", "catalog"],',
    '"keywords": ["lakehouse", "iceberg", "hudi", "delta", "storage", "manifest", "partition", "snapshot", "z-ordering", "compaction", "zero-etl", "catalog", "nessie", "wap", "deletes", "puffin", "flink", "superset"],'
)

# 3. Update keywords in Agentic & AI
content = content.replace(
    '"keywords": ["agentic", "ai", "llm", "context", "search", "rag", "generative", "prompt", "learning", "reasoning", "orchestration", "tool"],',
    '"keywords": ["agentic", "ai", "llm", "context", "search", "rag", "generative", "prompt", "learning", "reasoning", "orchestration", "tool", "react", "thought", "caching", "window"],'
)

# 4. Update keywords in Data Engineering & Query
content = content.replace(
    '"keywords": ["etl", "elt", "pipeline", "dag", "schema", "cdc", "query", "sql", "vectorized", "arrow", "parquet", "pushdown"],',
    '"keywords": ["etl", "elt", "pipeline", "dag", "schema", "cdc", "query", "sql", "vectorized", "arrow", "parquet", "pushdown", "dbt", "batch", "product", "analytics", "dimension"],'
)

with open(file_path, "w") as f:
    f.write(content)
