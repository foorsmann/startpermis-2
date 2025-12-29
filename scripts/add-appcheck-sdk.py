#!/usr/bin/env python3
"""
Script to add Firebase App Check SDK to all HTML files.
Inserts the script tag after firebase-database-compat.js
"""

import os
import re
import glob

# Pattern to find where to insert (after firebase-database-compat.js)
PATTERN = r'(<script src="https://www\.gstatic\.com/firebasejs/10\.10\.0/firebase-database-compat\.js"></script>)'
REPLACEMENT = r'\1\n  <script src="https://www.gstatic.com/firebasejs/10.10.0/firebase-appcheck-compat.js"></script>'

def process_file(filepath):
    """Process a single HTML file."""
    print(f"Processing: {filepath}")

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if appcheck is already included
    if 'firebase-appcheck-compat.js' in content:
        print(f"  - App Check SDK already present")
        return False

    # Add App Check SDK after database SDK
    new_content = re.sub(PATTERN, REPLACEMENT, content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  ✓ Added App Check SDK")
        return True
    else:
        print(f"  - No firebase-database-compat.js found")
        return False

def main():
    """Main function."""
    html_files = glob.glob('*.html')

    modified = 0
    for filepath in sorted(html_files):
        if process_file(filepath):
            modified += 1

    print(f"\n{'='*50}")
    print(f"Summary:")
    print(f"  Files processed: {len(html_files)}")
    print(f"  Files modified: {modified}")

if __name__ == '__main__':
    main()
