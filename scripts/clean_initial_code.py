import re

path = '/Users/lucaspasqualis/quant-econ-lab/scripts/generate_courses_ts.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Split by module id
sql_part, py_part = content.split('id: "python-econometrie"', 1)

# Replace initialCode in sql_part
sql_replaced = re.sub(
    r'initialCode:\s*`[^`]*`',
    r'initialCode: `-- Écrivez votre requête SQL ci-dessous :\n`',
    sql_part
)

# Replace initialCode in py_part
py_replaced = re.sub(
    r'initialCode:\s*`[^`]*`',
    r'initialCode: `# Écrivez votre code Python ci-dessous :\n`',
    py_part
)

new_content = sql_replaced + 'id: "python-econometrie"' + py_replaced

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated generate_courses_ts.py successfully!")
