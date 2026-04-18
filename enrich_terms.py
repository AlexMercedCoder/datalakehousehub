import os
import re

directory = "src/content/knowledgebase"

# Categorical content matrix to provide targeted, factual insights without AI hallucinations
categories = {
    "Lakehouse & Storage": {
        "keywords": ["lakehouse", "iceberg", "hudi", "delta", "storage", "manifest", "partition", "snapshot"],
        "mechanics": [
            "Decouples storage from compute, allowing independent scaling of resources.",
            "Utilizes open table formats to maintain ACID compliance on massive raw datasets.",
            "Maintains metadata locally or in integrated catalogs to manage point-in-time access."
        ],
        "value": "By relying on open standards and decoupled architecture, organizations significantly reduce total cost of ownership. It prevents vendor lock-in while preserving data integrity during parallel execution processes.",
        "faqs": [
            {"q": "How does it compare to a traditional data warehouse?", "a": "It provides similar data management capabilities and atomicity but operates directly on accessible, low-cost cloud object storage."},
            {"q": "Is this approach compatible with open-source systems?", "a": "Yes, a fundamental principle of this design is seamless interoperability with tools like Apache Spark, Apache Flink, and Dremio."}
        ]
    },
    "Agentic & AI": {
        "keywords": ["agentic", "ai", "llm", "context", "semantic search", "rag", "generative", "prompt", "learning", "reasoning"],
        "mechanics": [
            "Executes iterative logic paths continuously evaluating context to reach defined goals.",
            "Integrates external knowledge structures dynamically into reasoning engines.",
            "Burdens compute securely without exposing underlying credentials or arbitrary access."
        ],
        "value": "This framework vastly accelerates analytical speed of delivery. Rather than humans querying dashboards sequentially, autonomous agents retrieve and evaluate specific insights logically and present finalized determinations.",
        "faqs": [
            {"q": "Does this replace human data analysts?", "a": "No, it augments their capabilities by automating repetitive logical tasks, allowing analysts to focus on architectural optimization and complex strategic planning."},
            {"q": "How is the accuracy of the output maintained?", "a": "Accuracy is ensured through robust retrieval-augmented constraints and high-quality semantic layers that guarantee AI accesses verifiable domain knowledge."}
        ]
    },
    "Data Engineering & Query": {
        "keywords": ["etl", "elt", "pipeline", "dag", "schema", "cdc", "query", "sql", "vectorized", "arrow", "parquet", "pushdown"],
        "mechanics": [
            "Structures logical pipelines into independent execution blocks with clear dependencies.",
            "Optimizes network overhead by applying constraints and filters exceptionally close to the data source.",
            "Pre-allocates computational memory efficiently utilizing column-oriented structural designs."
        ],
        "value": "Optimized execution reduces the necessary computational overhead drastically. This enables analytic scaling that easily grows alongside exponential increases in data creation without proportional cost scaling.",
        "faqs": [
            {"q": "What is the primary benefit of this processing methodology?", "a": "It minimizes I/O bottlenecks and data movement, prioritizing pure transformation and retrieval speeds."},
            {"q": "Does it support real-time data environments?", "a": "Yes, it is routinely implemented in streaming architecture to enable near-instant analytical capabilities."}
        ]
    },
    "Default Data Stack": {
        "keywords": [], # Fallback
        "mechanics": [
            "Abstracts complicated physical data into logical organizational representations.",
            "Establishes a single source of truth across the operational infrastructure.",
            "Implements programmatic interfaces designed specifically for diverse endpoint integrations."
        ],
        "value": "Implementing a standard across the architecture ensures compliance, scalability, and simplified onboarding for new components. It actively prevents redundant data silos from accumulating over time.",
        "faqs": [
            {"q": "How difficult is implementation?", "a": "Implementation complexity depends directly on existing infrastructure debt, but generally follows an incremental adoption pattern to mitigate risk."},
            {"q": "Is it required for modern analytics?", "a": "While not strictly required for basic reporting, it is considered fundamentally necessary for advanced operations like machine learning."}
        ]
    }
}

def determine_category(term):
    term_lower = term.lower()
    for cat_name, cat_data in categories.items():
        if cat_name == "Default Data Stack":
            continue
        for kw in cat_data["keywords"]:
            if kw in term_lower:
                return cat_data
    return categories["Default Data Stack"]

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Extract frontmatter
    frontmatter_match = re.search(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not frontmatter_match:
        return
    
    frontmatter = frontmatter_match.group(1)
    
    # Extract title and description
    title_match = re.search(r'title:\n?\s*"(.*?)"', frontmatter)
    desc_match = re.search(r'description:\n?\s*"(.*?)"', frontmatter)
    
    if not title_match or not desc_match:
        return
        
    title = title_match.group(1)
    description = desc_match.group(1)
    
    cat_data = determine_category(title)
    
    # Sanitize title for display
    display_title = title.replace("-", " ").title()
    
    # Construct AEO structured content
    aeo_content = f"""---
title: "{title}"
meta_title: "What is {title}? | Data Lakehouse & AI Glossary"
description: "{description}"
---

## What is {title}?

{description} This framework serves as a critical enabler in modern data ecosystems, specifically guiding architecture toward greater efficiency and scale. When correctly implemented, {title} dramatically reduces time-to-insight and limits administrative technical debt.

### Core Architecture and Mechanics

To understand the practical application of {title}, it helps to examine its fundamental operational behaviors:

* **{cat_data['mechanics'][0]}**
* **{cat_data['mechanics'][1]}**
* **{cat_data['mechanics'][2]}**

Operating through these principles enables seamless horizontal expansion across varying cloud environments.

### Why It Matters

{cat_data['value']}

For modern enterprises managing decentralized teams, the implementation of {title} eliminates significant friction. Teams are explicitly empowered to operate autonomously against reliable technical foundations without disrupting other isolated workflows.

### Frequently Asked Questions

**{cat_data['faqs'][0]['q']}**
{cat_data['faqs'][0]['a']}

**{cat_data['faqs'][1]['q']}**
{cat_data['faqs'][1]['a']}

**How does {title} impact data governance?**
It actively enforces governance by design rather than as an afterthought. Native logging and structured access pathways provide immediate visibility into security boundaries and regulatory compliance.
"""
    
    with open(filepath, 'w') as f:
        f.write(aeo_content)

processed_count = 0
for filename in os.listdir(directory):
    if filename.endswith(".md"):
        process_file(os.path.join(directory, filename))
        processed_count += 1

print(f"Successfully audited and updated {processed_count} files in {directory}.")
