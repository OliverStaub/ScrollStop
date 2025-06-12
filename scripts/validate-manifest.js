#!/usr/bin/env node

/**
 * Validation script for manifest.json
 * Ensures the manifest file has proper structure and required fields
 */

const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, '../Shared (Extension)/Resources/manifest.json');

function validateManifest() {
  console.log('🔍 Validating manifest.json...');

  // Check if manifest exists
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error('❌ manifest.json not found at:', MANIFEST_PATH);
    process.exit(1);
  }

  let manifest;
  try {
    const manifestContent = fs.readFileSync(MANIFEST_PATH, 'utf8');
    manifest = JSON.parse(manifestContent);
    console.log('✅ manifest.json syntax is valid');
  } catch (error) {
    console.error('❌ Invalid JSON in manifest.json:', error.message);
    process.exit(1);
  }

  // Required fields for Safari Web Extension
  const requiredFields = [
    'manifest_version',
    'name',
    'version',
    'description',
    'content_scripts',
    'permissions',
  ];

  const errors = [];
  const warnings = [];

  // Check required fields
  requiredFields.forEach((field) => {
    if (!manifest[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Validate manifest version
  if (manifest.manifest_version !== 2) {
    warnings.push(`Manifest version is ${manifest.manifest_version}, Safari extensions typically use version 2`);
  }

  // Validate content scripts
  if (manifest.content_scripts) {
    if (!Array.isArray(manifest.content_scripts)) {
      errors.push('content_scripts must be an array');
    } else {
      manifest.content_scripts.forEach((script, index) => {
        if (!script.matches || !Array.isArray(script.matches)) {
          errors.push(`content_scripts[${index}] missing or invalid 'matches' array`);
        }
        
        if (!script.js || !Array.isArray(script.js)) {
          errors.push(`content_scripts[${index}] missing or invalid 'js' array`);
        } else {
          // Check that all JS files use flat paths (no directories)
          script.js.forEach((jsFile) => {
            if (jsFile.includes('/')) {
              errors.push(`content_scripts[${index}] file "${jsFile}" contains directory path. Use flat filenames only due to build process.`);
            }
          });
        }
      });
    }
  }

  // Validate permissions
  if (manifest.permissions) {
    if (!Array.isArray(manifest.permissions)) {
      errors.push('permissions must be an array');
    } else {
      const requiredPermissions = ['storage'];
      requiredPermissions.forEach((perm) => {
        if (!manifest.permissions.includes(perm)) {
          warnings.push(`Consider adding '${perm}' permission`);
        }
      });
    }
  }

  // Validate version format
  if (manifest.version) {
    const versionRegex = /^\d+\.\d+\.\d+(\.\d+)?$/;
    if (!versionRegex.test(manifest.version)) {
      warnings.push(`Version '${manifest.version}' should follow semantic versioning (e.g., 1.0.0)`);
    }
  }

  // Check for recommended fields
  const recommendedFields = [
    'background',
    'web_accessible_resources',
    'host_permissions',
  ];

  recommendedFields.forEach((field) => {
    if (!manifest[field]) {
      // These are optional, so just log for info
      console.log(`ℹ️  Optional field not present: ${field}`);
    }
  });

  // Validate background script if present
  if (manifest.background) {
    if (manifest.background.scripts && Array.isArray(manifest.background.scripts)) {
      manifest.background.scripts.forEach((script) => {
        if (script.includes('/')) {
          errors.push(`Background script "${script}" contains directory path. Use flat filenames only.`);
        }
      });
    }
  }

  // Report results
  if (errors.length > 0) {
    console.error('\n❌ Manifest validation failed:');
    errors.forEach((error) => console.error(`  • ${error}`));
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn('\n⚠️  Manifest warnings:');
    warnings.forEach((warning) => console.warn(`  • ${warning}`));
  }

  console.log('\n✅ Manifest validation passed!');
  console.log(`📦 Extension: ${manifest.name} v${manifest.version}`);
  console.log(`📝 Description: ${manifest.description}`);
  
  if (manifest.content_scripts) {
    const totalScripts = manifest.content_scripts.reduce((count, script) => count + script.js.length, 0);
    console.log(`📜 Content scripts: ${totalScripts} files`);
  }
}

// Run validation
if (require.main === module) {
  validateManifest();
}

module.exports = validateManifest;