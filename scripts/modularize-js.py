#!/usr/bin/env python3
"""
Script pentru modularizarea JavaScript-ului din fisierele HTML.
Inlocuieste scripturile inline cu referinte externe.
"""

import os
import re
import glob

# Patterns pentru identificarea scripturilor inline
PATTERNS = {
    'auth_guard_head': {
        'start': r'<!--\s*✅\s*GLOBAL AUTH GUARD \(HEAD\)[^>]*-->\s*<script>',
        'end': r'\}\)\(\);\s*</script>',
        'replacement': '<!-- Auth Guard (HEAD) -->\n  <script src="js/auth-guard-head.js"></script>'
    },
    'firebase_config': {
        'start': r'<script>\s*\n?\s*const firebaseConfig\s*=\s*\{',
        'end': r'console\.log\(["\']Firebase\s+initializat:["\'].*?\);\s*</script>',
        'replacement': '<!-- Firebase Configuration -->\n  <script src="js/firebase-config.js"></script>'
    },
    'auth_guard_footer': {
        'start': r'<!--\s*✅\s*GLOBAL AUTH GUARD \(FOOTER\)[^>]*-->\s*<script>',
        'end': r'\}\)\(\);\s*</script>',
        'replacement': '<!-- Auth Guard (FOOTER) -->\n  <script src="js/auth-guard-footer.js"></script>'
    },
    'single_active_lock': {
        'start': r'<!--\s*=+\s*Helper global:\s*single-active lock[^>]*-->\s*<script>',
        'end': r'\}\)\(\);\s*</script>\s*<!--\s*=+\s*/Helper global\s*=+\s*-->',
        'replacement': '<!-- Single Active Lock Helper -->\n  <script src="js/single-active-lock.js"></script>'
    },
    'theme': {
        'start': r'<script>\s*\n?\s*\(function\s*\(\)\s*\{\s*\n?\s*const STORAGE_KEY\s*=\s*[\'"]sp-theme[\'"]',
        'end': r'}\)\(\);\s*</script>',
        'replacement': '<!-- Theme Manager -->\n  <script src="js/theme.js"></script>'
    }
}

def process_file(filepath):
    """Proceseaza un singur fisier HTML."""
    print(f"Processing: {filepath}")

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    replacements_made = []

    # Procesam fiecare pattern
    for name, pattern in PATTERNS.items():
        # Construim regex-ul complet
        full_pattern = f"({pattern['start']})(.*?)({pattern['end']})"

        match = re.search(full_pattern, content, re.DOTALL)
        if match:
            # Inlocuim intregul match cu replacement-ul
            content = re.sub(full_pattern, pattern['replacement'], content, count=1, flags=re.DOTALL)
            replacements_made.append(name)

    # Salvam doar daca am facut modificari
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ Replaced: {', '.join(replacements_made)}")
        return len(replacements_made)
    else:
        print(f"  - No changes needed")
        return 0

def main():
    """Functia principala."""
    # Gasim toate fisierele HTML
    html_files = glob.glob('*.html')

    total_replacements = 0
    files_modified = 0

    for filepath in sorted(html_files):
        count = process_file(filepath)
        if count > 0:
            files_modified += 1
            total_replacements += count

    print(f"\n{'='*50}")
    print(f"Summary:")
    print(f"  Files processed: {len(html_files)}")
    print(f"  Files modified: {files_modified}")
    print(f"  Total replacements: {total_replacements}")

if __name__ == '__main__':
    main()
