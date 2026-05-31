import re
from pathlib import Path

base = Path("src")
files = [p for p in base.rglob("*.tsx") if "node_modules" not in str(p)]
changed = []

for p in files:
    text = p.read_text(encoding="utf-8")
    if 'http://localhost:5000' not in text:
        continue
    orig = text

    text = re.sub(r'import\s+axios\s+from\s+"axios";\s*\n', 'import api, { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/utils/api";\n', text)

    text = re.sub(r'await\s+axios\.get\(\s*`?"?http://localhost:5000([^"`]+)`?"?\s*,\s*\{[^}]*\}\s*\)', r'await apiGet("\1")', text, flags=re.S)
    text = re.sub(r'await\s+axios\.delete\(\s*`?"?http://localhost:5000([^"`]+)`?"?\s*,\s*\{[^}]*\}\s*\)', r'await apiDelete("\1")', text, flags=re.S)
    text = re.sub(r'await\s+axios\.post\(\s*`?"?http://localhost:5000([^"`]+)`?"?\s*,\s*([^,]+?),\s*\{[^}]*\}\s*\)', r'await apiPost("\1", \2)', text, flags=re.S)
    text = re.sub(r'await\s+axios\.put\(\s*`?"?http://localhost:5000([^"`]+)`?"?\s*,\s*([^,]+?),\s*\{[^}]*\}\s*\)', r'await apiPut("\1", \2)', text, flags=re.S)
    text = re.sub(r'await\s+axios\.patch\(\s*`?"?http://localhost:5000([^"`]+)`?"?\s*,\s*([^,]+?),\s*\{[^}]*\}\s*\)', r'await apiPatch("\1", \2)', text, flags=re.S)

    def replace_fetch(m):
        method = m.group('method').upper()
        path = m.group('path')
        body = m.group('body').strip()
        if method == 'POST':
            return f'await apiPost("{path}", {body})'
        if method == 'PUT':
            return f'await apiPut("{path}", {body})'
        if method == 'PATCH':
            return f'await apiPatch("{path}", {body})'
        if method == 'DELETE':
            return f'await apiDelete("{path}")'
        return f'await apiGet("{path}")'

    text = re.sub(
        r'await\s+fetch\(\s*"http://localhost:5000(?P<path>[^\"]+)"\s*,\s*\{[^}]*method:\s*"(?P<method>[A-Z]+)"[^}]*body:\s*JSON\.stringify\((?P<body>[^)]+)\)[^}]*\}\s*\)',
        replace_fetch,
        text,
        flags=re.S,
    )
    text = re.sub(
        r'await\s+fetch\(\s*"http://localhost:5000(?P<path>[^\"]+)"\s*,\s*\{[^}]*method:\s*"(?P<method>GET|DELETE)"[^}]*\}\s*\)',
        lambda m: f'await apiGet("{m.group(1)}")' if m.group('method') == 'GET' else f'await apiDelete("{m.group(1)}")',
        text,
        flags=re.S,
    )

    text = text.replace('http://localhost:5000', '')

    if text != orig:
        p.write_text(text, encoding="utf-8")
        changed.append(str(p))

print(f'changed {len(changed)} files')
for p in changed:
    print(p)
