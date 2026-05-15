import re

with open("update_all_terms.py", "r") as f:
    original_content = f.read()

with open("new_matrix.py", "r") as f:
    new_matrix_content = f.read()

# The original matrix starts at 'matrix = {' and ends before 'def determine_category(term):'
# We can use regex to replace it
pattern = r"matrix = \{.*?\n\}(?=\n\ndef determine_category)"

# Let's replace the whole block
replaced_content = re.sub(pattern, new_matrix_content.strip(), original_content, flags=re.DOTALL)

with open("update_all_terms.py", "w") as f:
    f.write(replaced_content)
