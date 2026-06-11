#!/bin/bash
# auto-fill-empty-pages.sh
# This script scans for empty page.tsx files and adds a default placeholder.

DASHBOARD_DIR="./app"

echo "Scanning for empty page.tsx files..."

find "$DASHBOARD_DIR" -type f -name "page.tsx" | while read FILE; do
    if [ ! -s "$FILE" ]; then
        echo "Filling placeholder in: $FILE"
        cat > "$FILE" <<'EOF'
export default function PagePlaceholder() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Page Placeholder</h1>
      <p>This page was empty. Placeholder content added to prevent build errors.</p>
    </div>
  );
}
EOF
    fi
done

echo "Done. All empty page.tsx files now have placeholders."
