from pathlib import Path
import re

root = Path(".").resolve()
files = sorted([p for p in root.rglob("*.tsx") if "node_modules" not in p.parts and "scripts" not in p.parts])

api_import = 'import api, { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/utils/api";'

def ensure_api_import(text):
    if 'from "@/utils/api"' in text or "from '@/utils/api'" in text:
        return text
    lines = text.splitlines()
    insert_idx = 0
    for i, line in enumerate(lines):
        if line.startswith("import "):
            insert_idx = i + 1
        elif insert_idx and line.strip() == "":
            break
    lines.insert(insert_idx, api_import)
    return "\n".join(lines)

for path in files:
    text = path.read_text(encoding="utf-8")
    orig = text
    if path.name == "api.ts":
        continue
    if 'axios.' in text or 'fetch(' in text:
        if 'axios.' in text:
            text = re.sub(r'\bawait\s+axios\.get\(', 'await api.get(', text)
            text = re.sub(r'\bawait\s+axios\.post\(', 'await api.post(', text)
            text = re.sub(r'\bawait\s+axios\.put\(', 'await api.put(', text)
            text = re.sub(r'\bawait\s+axios\.patch\(', 'await api.patch(', text)
            text = re.sub(r'\bawait\s+axios\.delete\(', 'await api.delete(', text)
            text = ensure_api_import(text)
        if 'fetch(' in text:
            # auth related fetch replacements
            text = text.replace('await fetch("/api/auth/register"', 'await apiPost("/auth/register"')
            text = text.replace('await fetch("/auth/forgot-password"', 'await apiPost("/auth/forgot-password"')
            text = text.replace('await fetch("/auth/verify-otp"', 'await apiPost("/auth/verify-otp"')
            text = text.replace('await fetch("/auth/reset-password"', 'await apiPost("/auth/reset-password"')
            text = text.replace('await fetch("/auth/change-password"', 'await apiPost("/auth/change-password"')
            text = text.replace('await fetch("/admin/upload-excel"', 'await api.post("/admin/upload-excel"')
            # remove problematic multipart header blocks in UploadDatasetPage if present
            if path.name == 'UploadDatasetPage.tsx':
                text = re.sub(
                    r'const response =\s*await api\.post\(\s*"/admin/upload-excel",\s*formData,\s*\{\s*headers:\s*\{[^}]*\},',
                    'const response = await api.post("/admin/upload-excel", formData, {',
                    text,
                    flags=re.S,
                )
    if text != orig:
        path.write_text(text, encoding="utf-8")
        print(f"UPDATED {path}")
