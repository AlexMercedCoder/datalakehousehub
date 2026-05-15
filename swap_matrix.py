import re

with open("update_all_terms.py", "r") as f:
    original_content = f.read()

with open("comprehensive_matrix.py", "r") as f:
    new_matrix_content = f.read()

pattern = r"matrix = \{.*?\n\}(?=\n\ndef determine_category)"
replaced_content = re.sub(pattern, new_matrix_content.strip(), original_content, flags=re.DOTALL)

with open("update_all_terms.py", "w") as f:
    f.write(replaced_content)
