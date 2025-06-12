#!/usr/bin/env node

/**
 * Validation script for sites.json
 * Ensures the sites configuration has proper structure and valid domains
 */

const fs = require('fs');
const path = require('path');

const SITES_PATH = path.join(__dirname, '../Shared (Extension)/Resources/sites.json');

function validateSites() {
  console.log('🔍 Validating sites.json...');

  // Check if sites.json exists
  if (!fs.existsSync(SITES_PATH)) {
    console.error('❌ sites.json not found at:', SITES_PATH);
    process.exit(1);
  }

  let sites;
  try {
    const sitesContent = fs.readFileSync(SITES_PATH, 'utf8');
    sites = JSON.parse(sitesContent);
    console.log('✅ sites.json syntax is valid');
  } catch (error) {
    console.error('❌ Invalid JSON in sites.json:', error.message);
    process.exit(1);
  }

  const errors = [];
  const warnings = [];

  // Check required top-level arrays
  const requiredArrays = ['blockedSites', 'newsSites'];
  
  requiredArrays.forEach((arrayName) => {
    if (!sites[arrayName]) {
      errors.push(`Missing required array: ${arrayName}`);
    } else if (!Array.isArray(sites[arrayName])) {
      errors.push(`${arrayName} must be an array`);
    } else if (sites[arrayName].length === 0) {
      warnings.push(`${arrayName} array is empty`);
    }
  });

  // Stop if basic structure is invalid
  if (errors.length > 0) {
    console.error('\n❌ Sites validation failed:');
    errors.forEach((error) => console.error(`  • ${error}`));
    process.exit(1);
  }

  // Validate domain formats
  function validateDomainList(domains, listName) {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.([a-zA-Z]{2,}|[a-zA-Z]{2,}\.[a-zA-Z]{2,})$/;
    const invalidDomains = [];
    const suspiciousDomains = [];

    domains.forEach((domain) => {
      // Check for protocol prefixes (shouldn't be there)
      if (domain.startsWith('http://') || domain.startsWith('https://')) {
        errors.push(`${listName}: "${domain}" should not include protocol (http/https)`);
        return;
      }

      // Check for paths (shouldn't be there)
      if (domain.includes('/')) {
        errors.push(`${listName}: "${domain}" should not include paths, only domain`);
        return;
      }

      // Check for ports (suspicious)
      if (domain.includes(':')) {
        warnings.push(`${listName}: "${domain}" includes port number - is this intended?`);
      }

      // Validate domain format
      if (!domainRegex.test(domain)) {
        invalidDomains.push(domain);
      }

      // Check for suspicious patterns
      if (domain.includes('..') || domain.startsWith('.') || domain.endsWith('.')) {
        suspiciousDomains.push(domain);
      }
    });

    if (invalidDomains.length > 0) {
      errors.push(`${listName} contains invalid domains: ${invalidDomains.join(', ')}`);
    }

    if (suspiciousDomains.length > 0) {
      warnings.push(`${listName} contains suspicious domains: ${suspiciousDomains.join(', ')}`);
    }
  }

  // Validate each list
  if (sites.blockedSites) {
    validateDomainList(sites.blockedSites, 'blockedSites');
  }

  if (sites.newsSites) {
    validateDomainList(sites.newsSites, 'newsSites');
  }

  // Check for duplicates within each list
  function checkDuplicates(domains, listName) {
    const seen = new Set();
    const duplicates = [];

    domains.forEach((domain) => {
      if (seen.has(domain)) {
        duplicates.push(domain);
      } else {
        seen.add(domain);
      }
    });

    if (duplicates.length > 0) {
      errors.push(`${listName} contains duplicates: ${duplicates.join(', ')}`);
    }
  }

  if (sites.blockedSites) {
    checkDuplicates(sites.blockedSites, 'blockedSites');
  }

  if (sites.newsSites) {
    checkDuplicates(sites.newsSites, 'newsSites');
  }

  // Check for overlap between blocked and news sites
  if (sites.blockedSites && sites.newsSites) {
    const blocked = new Set(sites.blockedSites);
    const overlapping = sites.newsSites.filter((domain) => blocked.has(domain));

    if (overlapping.length > 0) {
      warnings.push(`Sites appear in both blockedSites and newsSites: ${overlapping.join(', ')}`);
    }
  }

  // Check for well-known domains in appropriate lists
  const knownSocialMedia = ['facebook.com', 'twitter.com', 'instagram.com', 'tiktok.com', 'youtube.com'];
  const knownNews = ['cnn.com', 'bbc.com', 'nytimes.com', 'reuters.com'];

  if (sites.newsSites) {
    const socialInNews = sites.newsSites.filter((domain) => knownSocialMedia.includes(domain));
    if (socialInNews.length > 0) {
      warnings.push(`Social media sites found in newsSites: ${socialInNews.join(', ')}`);
    }
  }

  if (sites.blockedSites) {
    const newsInBlocked = sites.blockedSites.filter((domain) => knownNews.includes(domain));
    if (newsInBlocked.length > 0) {
      warnings.push(`News sites found in blockedSites: ${newsInBlocked.join(', ')}`);
    }
  }

  // Check for geographic diversity in news sites
  if (sites.newsSites) {
    const germanSites = sites.newsSites.filter((domain) => domain.endsWith('.de'));
    const swissSites = sites.newsSites.filter((domain) => domain.endsWith('.ch'));
    const austrianSites = sites.newsSites.filter((domain) => domain.endsWith('.at'));
    const usSites = sites.newsSites.filter((domain) => 
      domain.endsWith('.com') && ['cnn.com', 'nytimes.com', 'washingtonpost.com', 'usatoday.com'].includes(domain)
    );

    console.log(`📊 Geographic distribution:`);
    console.log(`   🇺🇸 US sites: ${usSites.length}`);
    console.log(`   🇩🇪 German sites: ${germanSites.length}`);
    console.log(`   🇨🇭 Swiss sites: ${swissSites.length}`);
    console.log(`   🇦🇹 Austrian sites: ${austrianSites.length}`);
  }

  // Report results
  if (errors.length > 0) {
    console.error('\n❌ Sites validation failed:');
    errors.forEach((error) => console.error(`  • ${error}`));
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn('\n⚠️  Sites warnings:');
    warnings.forEach((warning) => console.warn(`  • ${warning}`));
  }

  console.log('\n✅ Sites validation passed!');
  
  if (sites.blockedSites) {
    console.log(`🚫 Blocked sites: ${sites.blockedSites.length}`);
  }
  
  if (sites.newsSites) {
    console.log(`📰 News sites: ${sites.newsSites.length}`);
  }

  const totalSites = (sites.blockedSites?.length || 0) + (sites.newsSites?.length || 0);
  console.log(`📊 Total tracked sites: ${totalSites}`);
}

// Run validation
if (require.main === module) {
  validateSites();
}

module.exports = validateSites;