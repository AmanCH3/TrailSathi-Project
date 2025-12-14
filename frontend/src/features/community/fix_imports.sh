#!/bin/bash
# Remove all .js and .jsx extensions from imports in community feature

find . -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i \
  -e "s/from '\\([^']*\\)\\.jsx'/from '\\1'/g" \
  -e "s/from \"\\([^\"]*\\)\\.jsx\"/from \"\\1\"/g" \
  -e "s/from '\\([^']*\\)\\.js'/from '\\1'/g" \
  -e "s/from \"\\([^\"]*\\)\\.js\"/from \"\\1\"/g" \
  {} +

echo "Fixed all imports - removed .js and .jsx extensions"
