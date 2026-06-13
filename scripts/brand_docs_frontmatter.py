#!/usr/bin/env python3
"""Branding selectivo en docs/: solo frontmatter (title, description, tags) y H1."""

import os
import re

DOCS_DIR = os.path.join(os.path.dirname(__file__), '..', 'docs')
EXCLUDE_DIRS = {'node_modules', '.git'}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    lines = content.split('\n')

    in_frontmatter = False
    frontmatter_end = 0
    changes = 0

    for i, line in enumerate(lines):
        stripped = line.strip()

        # Detect frontmatter boundaries
        if i == 0 and stripped == '---':
            in_frontmatter = True
            continue

        if in_frontmatter and stripped == '---':
            in_frontmatter = False
            frontmatter_end = i + 1
            continue

        if in_frontmatter:
            # Replace in title, description, tags, and other frontmatter values
            if '"LobeHub"' in line or "'LobeHub'" in line:
                old = line
                lines[i] = line.replace('"LobeHub"', '"Agentes"').replace("'LobeHub'", "'Agentes'")
                if lines[i] != old:
                    changes += 1
            elif 'LobeHub' in line and (': ' in line or '- ' in stripped):
                old = line
                lines[i] = line.replace('LobeHub', 'Agentes')
                if lines[i] != old:
                    changes += 1

    # Process H1 headings (after frontmatter)
    for i in range(frontmatter_end, len(lines)):
        stripped = lines[i].strip()
        if stripped.startswith('# ') and 'LobeHub' in stripped:
            old = lines[i]
            lines[i] = lines[i].replace('LobeHub', 'Agentes')
            if lines[i] != old:
                changes += 1
        elif stripped.startswith('# ') and 'LobeChat' in stripped:
            old = lines[i]
            lines[i] = lines[i].replace('LobeChat', 'Agentes')
            if lines[i] != old:
                changes += 1

    if changes > 0:
        new_content = '\n'.join(lines)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  ✓ {changes} cambios — {os.path.relpath(filepath, DOCS_DIR)}")

    return changes


def main():
    total_changes = 0
    total_files = 0

    for root, dirs, files in os.walk(DOCS_DIR):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for f in files:
            if f.endswith(('.mdx', '.md')):
                filepath = os.path.join(root, f)
                changes = process_file(filepath)
                if changes > 0:
                    total_files += 1
                    total_changes += changes

    print(f"\n✅ Total: {total_files} archivos modificados, {total_changes} cambios")


if __name__ == '__main__':
    main()
