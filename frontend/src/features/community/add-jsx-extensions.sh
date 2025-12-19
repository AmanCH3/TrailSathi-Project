#!/bin/bash
# Script to add .jsx extensions to all component imports in the community feature

# Navigate to community components directory
cd "$(dirname "$0")"

# Function to add .jsx extension to component imports
add_jsx_extensions() {
    local file="$1"
    
    # Add .jsx to imports from ../ui/
    sed -i "s/from '\.\.\/ui\/\([^']*\)'/from '..\/ui\/\1.jsx'/g" "$file"
    
    # Add .jsx to imports from ./
   sed -i "s/from '\.\/\([^']*\)'/from '.\/\1.jsx'/g" "$file"
    
    # Add .jsx to imports from ../
    sed -i "s/from '\.\.\/\([^\/]*\)\/\([^']*\)'/from '..\/\1\/\2.jsx'/g" "$file"
}

# Find all .jsx files and process them
find components -name "*.jsx" -type f | while read file; do
    echo "Processing: $file"
    add_jsx_extensions "$file"
done

echo "Done! All .jsx extensions added."
