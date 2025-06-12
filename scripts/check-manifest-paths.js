#!/usr/bin/env node

/**
 * Validation script to check that manifest.json only references flat file paths
 * This is critical because the build process flattens all files into one directory
 */

const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, '../Shared (Extension)/Resources/manifest.json');
const RESOURCES_DIR = path.join(__dirname, '../Shared (Extension)/Resources');

function checkManifestPaths() {
  console.log('🔍 Checking manifest file paths...');

  // Check if manifest exists
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error('❌ manifest.json not found at:', MANIFEST_PATH);
    process.exit(1);
  }

  let manifest;
  try {
    const manifestContent = fs.readFileSync(MANIFEST_PATH, 'utf8');
    manifest = JSON.parse(manifestContent);
  } catch (error) {
    console.error('❌ Invalid JSON in manifest.json:', error.message);
    process.exit(1);
  }

  const errors = [];
  const warnings = [];
  const allReferencedFiles = new Set();

  // Check content scripts
  if (manifest.content_scripts && Array.isArray(manifest.content_scripts)) {
    manifest.content_scripts.forEach((script, index) => {
      if (script.js && Array.isArray(script.js)) {
        script.js.forEach((jsFile) => {
          allReferencedFiles.add(jsFile);
          
          // Check for directory paths
          if (jsFile.includes('/')) {
            errors.push(`content_scripts[${index}].js: "${jsFile}" contains directory path. Build process requires flat filenames only.`);
          }
        });
      }
      
      if (script.css && Array.isArray(script.css)) {
        script.css.forEach((cssFile) => {
          allReferencedFiles.add(cssFile);
          
          if (cssFile.includes('/')) {
            errors.push(`content_scripts[${index}].css: "${cssFile}" contains directory path. Build process requires flat filenames only.`);
          }
        });
      }
    });
  }

  // Check background scripts
  if (manifest.background) {
    if (manifest.background.scripts && Array.isArray(manifest.background.scripts)) {
      manifest.background.scripts.forEach((script) => {
        allReferencedFiles.add(script);
        
        if (script.includes('/')) {
          errors.push(`background.scripts: "${script}" contains directory path. Build process requires flat filenames only.`);
        }
      });
    }
    
    if (manifest.background.service_worker) {
      allReferencedFiles.add(manifest.background.service_worker);
      
      if (manifest.background.service_worker.includes('/')) {
        errors.push(`background.service_worker: "${manifest.background.service_worker}" contains directory path. Build process requires flat filenames only.`);
      }
    }
  }

  // Check web accessible resources
  if (manifest.web_accessible_resources) {
    if (Array.isArray(manifest.web_accessible_resources)) {
      // Manifest v2 format
      manifest.web_accessible_resources.forEach((resource) => {
        allReferencedFiles.add(resource);
        
        if (!resource.includes('*') && resource.includes('/')) {
          warnings.push(`web_accessible_resources: "${resource}" contains directory path. Consider if this will work with build process.`);
        }
      });
    } else if (typeof manifest.web_accessible_resources === 'object') {
      // Manifest v3 format
      Object.values(manifest.web_accessible_resources).forEach((resourceGroup) => {
        if (resourceGroup.resources && Array.isArray(resourceGroup.resources)) {
          resourceGroup.resources.forEach((resource) => {
            allReferencedFiles.add(resource);
            
            if (!resource.includes('*') && resource.includes('/')) {
              warnings.push(`web_accessible_resources: "${resource}" contains directory path. Consider if this will work with build process.`);
            }
          });
        }
      });
    }
  }

  // Verify that referenced files exist (only flat files)
  const referencedFlatFiles = Array.from(allReferencedFiles).filter(file => !file.includes('/') && !file.includes('*'));
  
  referencedFlatFiles.forEach((file) => {
    const filePath = path.join(RESOURCES_DIR, file);
    
    if (!fs.existsSync(filePath)) {
      // File doesn't exist as flat file, check if it exists in subdirectories
      const found = findFileInDirectories(RESOURCES_DIR, file);
      
      if (found.length > 0) {
        warnings.push(`File "${file}" referenced in manifest exists in subdirectory: ${found[0]}. Build process should flatten this.`);
      } else {
        errors.push(`File "${file}" referenced in manifest does not exist anywhere in resources.`);
      }
    }
  });

  // Check for potential file name conflicts in subdirectories
  const allFiles = getAllFiles(RESOURCES_DIR);
  const fileNames = new Map();
  
  allFiles.forEach((filePath) => {
    const fileName = path.basename(filePath);
    const relativePath = path.relative(RESOURCES_DIR, filePath);
    
    if (!fileNames.has(fileName)) {
      fileNames.set(fileName, []);
    }
    fileNames.get(fileName).push(relativePath);
  });

  // Report potential conflicts
  fileNames.forEach((paths, fileName) => {
    if (paths.length > 1 && !fileName.startsWith('.')) {
      warnings.push(`Potential filename conflict for "${fileName}": ${paths.join(', ')}`);
    }
  });

  // Report results
  if (errors.length > 0) {
    console.error('\n❌ Manifest path validation failed:');
    errors.forEach((error) => console.error(`  • ${error}`));
    console.error('\n💡 Fix: Ensure all files referenced in manifest.json use flat filenames (no directories).');
    console.error('   The build process flattens all files into a single directory.');
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn('\n⚠️  Manifest path warnings:');
    warnings.forEach((warning) => console.warn(`  • ${warning}`));
  }

  console.log('\n✅ Manifest path validation passed!');
  console.log(`📁 Referenced files: ${allReferencedFiles.size}`);
  console.log(`🔗 Flat file references: ${referencedFlatFiles.length}`);
}

function findFileInDirectories(baseDir, fileName) {
  const found = [];
  
  function search(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach((item) => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        search(itemPath);
      } else if (item === fileName) {
        found.push(path.relative(baseDir, itemPath));
      }
    });
  }
  
  search(baseDir);
  return found;
}

function getAllFiles(dir) {
  const files = [];
  
  function collect(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach((item) => {
      const itemPath = path.join(currentDir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        collect(itemPath);
      } else {
        files.push(itemPath);
      }
    });
  }
  
  collect(dir);
  return files;
}

// Run validation
if (require.main === module) {
  checkManifestPaths();
}

module.exports = checkManifestPaths;