import os
import re

FILES = [
    "src/content/blog/2026/2026-05-automating-table-maintenance.md",
    "src/content/blog/2026/2026-05-choosing-iceberg-control-plane.md",
    "src/content/blog/2026/2026-05-clean-rooms-privacy.md",
    "src/content/blog/2026/2026-05-composable-query-engines.md",
    "src/content/blog/2026/2026-05-data-mesh-after-hype.md",
    "src/content/blog/2026/2026-05-dbt-fusion-analytics-engineering.md",
    "src/content/blog/2026/2026-05-duckdb-polars-iceberg.md",
    "src/content/blog/2026/2026-05-finops-warehouse-cost.md",
    "src/content/blog/2026/2026-05-governed-rag-data-products.md",
    "src/content/blog/2026/2026-05-iceberg-cdc-pipelines.md",
    "src/content/blog/2026/2026-05-kafka-streaming-operations.md",
    "src/content/blog/2026/2026-05-lance-iceberg-multimodal.md",
    "src/content/blog/2026/2026-05-mlflow-data-pipelines.md",
    "src/content/blog/2026/2026-05-modern-feature-stores.md",
    "src/content/blog/2026/2026-05-openlineage-observability.md",
    "src/content/blog/2026/2026-05-paimon-vs-iceberg-mutable-streams.md",
    "src/content/blog/2026/2026-05-policy-as-code-governance.md",
    "src/content/blog/2026/2026-05-real-time-lakehouse-flink.md",
    "src/content/blog/2026/2026-05-semantic-layers-text-to-sql.md",
    "src/content/blog/2026/2026-05-vector-stores-retrieval.md"
]

def replace_em_dashes(line):
    # If the line has code block start/end, we do not touch it (handled at file level)
    # Check for two em dashes (parenthetical)
    # e.g., "Dremio's integrated approach -- native semantic layer... and governance -- offers..."
    if line.count(" -- ") == 2:
        parts = line.split(" -- ")
        return f"{parts[0]} ({parts[1]}) {parts[2]}"
    
    # If there is one em dash
    if line.count(" -- ") == 1:
        # Check the word after the dash
        parts = line.split(" -- ")
        before = parts[0].strip()
        after = parts[1].strip()
        
        first_word = after.split()[0].lower() if after else ""
        
        # Heuristics for replacement
        if first_word in ["which", "that", "where", "when", "who", "specifically", "such as", "whether", "meaning", "not", "but", "and", "as"]:
            return f"{before}, {after}"
        elif first_word in ["the", "this", "these", "they", "it", "new", "old", "failed", "compaction", "manifest", "snapshot"]:
            # If the clause before ends with certain nouns, maybe colon or semicolon
            if before.endswith(("metrics", "operations", "indicators", "layer", "options", "engine", "runtimes", "runtimes", "API", "APIs", "features", "categories", "stages", "dimensions", "databases", "stores", "systems")):
                return f"{before}: {after}"
            else:
                return f"{before}; {after}"
        else:
            return f"{before}, {after}"
            
    return line

def main():
    for file_path in FILES:
        if not os.path.exists(file_path):
            continue
            
        with open(file_path, "r", encoding="utf-8") as f:
            lines = f.readlines()
            
        in_code_block = False
        new_lines = []
        
        for line in lines:
            if line.strip().startswith("```"):
                in_code_block = not in_code_block
                new_lines.append(line)
                continue
                
            if in_code_block:
                new_lines.append(line)
                continue
                
            if " -- " in line:
                new_line = replace_em_dashes(line)
                new_lines.append(new_line)
            else:
                new_lines.append(line)
                
        # Dry run: print some changes to verify
        for old, new in zip(lines, new_lines):
            if old != new:
                print(f"File: {file_path}")
                print(f"  OLD: {old.strip()}")
                print(f"  NEW: {new.strip()}\n")

if __name__ == "__main__":
    main()
