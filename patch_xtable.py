import re

file_path = "update_all_terms.py"

with open(file_path, "r") as f:
    content = f.read()

# 1. Add new matrix item for Interoperability
new_matrix_item = """    "Interoperability & Translation": {
        "keywords": ["xtable", "onetable", "interoperability", "translation", "omni-directional"],
        "mechanics": [
            "Acts as a lightweight metadata translation layer without duplicating or rewriting underlying data files.",
            "Enables bi-directional or omni-directional synchronization between different table formats.",
            "Supports both incremental and full sync modes for flexible performance tuning."
        ],
        "value": "Eliminates vendor lock-in and reduces storage costs by allowing data to be written once and queried everywhere across disparate analytics engines.",
        "faqs": [
            {"q": "Does this require rewriting the actual data files?", "a": "No, it exclusively translates the metadata layer (e.g., schemas, partitioning) while leaving the massive Parquet data files untouched."},
            {"q": "Which formats are typically supported?", "a": "Currently, the major formats supported include Apache Iceberg, Apache Hudi, and Delta Lake, with extensible modular designs for future formats."}
        ]
    },
    "Lakehouse & Storage": {"""

content = content.replace('    "Lakehouse & Storage": {', new_matrix_item)

# 2. Remove xtable from Lakehouse & Storage
content = content.replace('"xtable", ', '')

with open(file_path, "w") as f:
    f.write(content)
