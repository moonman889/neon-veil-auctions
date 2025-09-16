#!/usr/bin/env node

/**
 * Security Check Script for Neon Veil Auctions
 * This script checks for potential security issues in the codebase
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sensitive patterns to check for
const SENSITIVE_PATTERNS = [
  // API Keys
  /[a-fA-F0-9]{32,}/g, // Generic API key pattern
  /ghp_[a-zA-Z0-9]{36}/g, // GitHub PAT
  /sk-[a-zA-Z0-9]{48}/g, // OpenAI API key
  /[a-zA-Z0-9]{40}/g, // Generic 40-char key
  
  // Infura patterns
  /infura\.io\/v3\/[a-fA-F0-9]{32}/g,
  
  // WalletConnect patterns
  /[a-fA-F0-9]{64}/g, // 64-char hex string
  
  // Private keys (but not zero addresses)
  /0x[a-fA-F0-9]{64}/g, // Ethereum private key
  
  // Common sensitive strings
  /password\s*[:=]\s*['"][^'"]+['"]/gi,
  /secret\s*[:=]\s*['"][^'"]+['"]/gi,
  /token\s*[:=]\s*['"][^'"]+['"]/gi,
];

// Patterns to ignore (not sensitive)
const IGNORE_PATTERNS = [
  /^0x0000000000000000000000000000000000000000$/, // Zero address
  /^0000000000000000000000000000000000000000$/, // Zero address without 0x
];

// Files to exclude from scanning
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /dist/,
  /build/,
  /\.env\.example/,
  /ENVIRONMENT_SETUP\.md/,
  /check-security\.js/,
  /package-lock\.json/,
];

// File extensions to scan
const SCAN_EXTENSIONS = ['.js', '.ts', '.tsx', '.jsx', '.json', '.md', '.env'];

function shouldScanFile(filePath) {
  // Check if file should be excluded
  if (EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath))) {
    return false;
  }
  
  // Check file extension
  const ext = path.extname(filePath);
  return SCAN_EXTENSIONS.includes(ext);
}

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    SENSITIVE_PATTERNS.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // Skip if it's a placeholder
          if (match.includes('YOUR_') || match.includes('PLACEHOLDER')) {
            return;
          }
          
          // Skip if it matches ignore patterns
          if (IGNORE_PATTERNS.some(ignorePattern => ignorePattern.test(match))) {
            return;
          }
          
          // Also check for zero address in different formats
          if (match === '0x0000000000000000000000000000000000000000' || 
              match === '0000000000000000000000000000000000000000' ||
              match === '0x00000000000000000000000000000000000000' ||
              match.startsWith('0x00000000000000000000000000000000000000')) {
            return;
          }
          
          issues.push({
            pattern: pattern.toString(),
            match: match,
            line: content.substring(0, content.indexOf(match)).split('\n').length
          });
        });
      }
    });
    
    return issues;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

function scanDirectory(dirPath) {
  const issues = [];
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        issues.push(...scanDirectory(fullPath));
      } else if (stat.isFile() && shouldScanFile(fullPath)) {
        const fileIssues = scanFile(fullPath);
        if (fileIssues.length > 0) {
          issues.push({
            file: fullPath,
            issues: fileIssues
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error.message);
  }
  
  return issues;
}

function main() {
  console.log('🔍 Scanning for sensitive data...\n');
  
  const rootDir = path.join(__dirname, '..');
  const issues = scanDirectory(rootDir);
  
  if (issues.length === 0) {
    console.log('✅ No sensitive data found!');
    console.log('🔒 Your codebase appears to be secure.');
  } else {
    console.log('⚠️  Potential sensitive data found:\n');
    
    issues.forEach(({ file, issues: fileIssues }) => {
      console.log(`📁 ${file}`);
      fileIssues.forEach(({ match, line }) => {
        console.log(`   Line ${line}: ${match.substring(0, 20)}...`);
      });
      console.log('');
    });
    
    console.log('🔧 Recommendations:');
    console.log('1. Remove or replace sensitive data with environment variables');
    console.log('2. Use placeholder values in example files');
    console.log('3. Ensure .env files are in .gitignore');
    console.log('4. Never commit API keys or private keys to version control');
    
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { scanFile, scanDirectory };
