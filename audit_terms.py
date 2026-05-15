import sys
import importlib.util

spec = importlib.util.spec_from_file_location("update_all_terms", "update_all_terms.py")
module = importlib.util.module_from_spec(spec)
sys.modules["update_all_terms"] = module
spec.loader.exec_module(module)

terms = module.terms
matrix = module.matrix
determine_category = module.determine_category

misaligned = []
category_counts = {k: 0 for k in matrix.keys()}

for cat, items in terms.items():
    for term_name, desc in items:
        mapped_cat = determine_category(term_name)
        # We find the name of the matched matrix category.
        # Wait, determine_category returns the dictionary data, not the name.
        # Let's re-implement the check to get the name.
        matched_name = "Default Data Stack"
        term_lower = term_name.lower()
        for matrix_name, matrix_data in matrix.items():
            if matrix_name == "Default Data Stack": continue
            if any(kw in term_lower for kw in matrix_data["keywords"]):
                matched_name = matrix_name
                break
        
        category_counts[matched_name] += 1
        
        if matched_name == "Default Data Stack":
            misaligned.append((term_name, desc))

print("=== MATRIX CATEGORY DISTRIBUTION ===")
for k, v in category_counts.items():
    print(f"{k}: {v} terms")

print("\n=== TERMS FALLING TO DEFAULT (Needs Keywords) ===")
for name, desc in misaligned:
    print(f"- {name}: {desc[:50]}...")
