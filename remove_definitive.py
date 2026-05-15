import os
import glob

kb_dir = "src/content/knowledgebase"
for filepath in glob.glob(os.path.join(kb_dir, "*.md")):
    with open(filepath, "r") as f:
        content = f.read()
    
    # Replace in title frontmatter
    content = content.replace(' The Definitive Guide"', '"')
    # Replace in H1 (if present)
    content = content.replace(' The Definitive Guide\n', '\n')
    
    with open(filepath, "w") as f:
        f.write(content)

# Also update the python script so it doesn't do it again
with open("update_all_terms.py", "r") as f:
    script_content = f.read()

script_content = script_content.replace('title: "What is {title}? The Definitive Guide"', 'title: "What is {title}?"')
with open("update_all_terms.py", "w") as f:
    f.write(script_content)
