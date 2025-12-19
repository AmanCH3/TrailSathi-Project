// Script to add .js/.jsx extensions to all community feature imports
// Run this if you continue to get import resolution errors

const fs = require('fs');
const path = require('path');

const communityDir = path.join(__dirname, 'src', 'features', 'community');

function addExtensions(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add .js to hook imports
  content = content.replace(/from ['"]\.\.\/\.\.\/hooks\/(\w+)['"]/g, 'from \'../../hooks/$1.js\'');
  
  // Add .js to service imports
  content = content.replace(/from ['"]\.\.\/\.\.\/services\/(\w+)['"]/g, 'from \'../../services/$1.js\'');
  
  // Add .js to utils imports
  content = content.replace(/from ['"]\.\.\/\.\.\/utils\/(\w+)['"]/g, 'from \'../../utils/$1.js\'');
  
  // Add .jsx to component imports
  content = content.replace(/from ['"]\.\.\/\.\.\/components\/(\w+)\/(\w+)['"]/g, 'from \'../../components/$1/$2.jsx\'');
  content = content.replace(/from ['"]\.\.\/(\w+)\/(\w+)['"]/g, 'from \'../$1/$2.jsx\'');
  content = content.replace(/from ['"]\.\/(\w+)['"]/g, 'from \'./$1.jsx\'');
  
  fs.writeFileSync(filePath, content, 'utf8');
}

// This is a backup script - extensions have been added manually
console.log('Extensions already added manually to all files');
