#!/usr/bin/env node

/**
 * Convert Atlassian Document Format (ADF) to Markdown
 * Specifically handles tables for I/O test cases
 */

const fs = require('fs');

function adfToMarkdown(adf) {
  if (typeof adf === 'string') {
    try {
      adf = JSON.parse(adf);
    } catch (e) {
      return adf; // Return as-is if not JSON
    }
  }

  let markdown = '';

  function processNode(node, inTable = false) {
    if (!node) return '';
    
    switch (node.type) {
      case 'doc':
        return node.content ? node.content.map(n => processNode(n)).join('\n') : '';
      
      case 'heading':
        const level = node.attrs?.level || 1;
        const headingText = node.content ? node.content.map(n => processNode(n)).join('') : '';
        return '#'.repeat(level) + ' ' + headingText + '\n';
      
      case 'paragraph':
        const paraText = node.content ? node.content.map(n => processNode(n)).join('') : '';
        return paraText + '\n';
      
      case 'text':
        let text = node.text || '';
        if (node.marks) {
          node.marks.forEach(mark => {
            if (mark.type === 'strong') text = `**${text}**`;
            if (mark.type === 'em') text = `*${text}*`;
            if (mark.type === 'code') text = `\`${text}\``;
          });
        }
        return text;
      
      case 'codeBlock':
        const lang = node.attrs?.language || '';
        const code = node.content ? node.content.map(n => processNode(n)).join('') : '';
        return '```' + lang + '\n' + code + '\n```\n';
      
      case 'bulletList':
      case 'orderedList':
        return node.content ? node.content.map((item, idx) => {
          const bullet = node.type === 'bulletList' ? '-' : `${idx + 1}.`;
          const itemText = processNode(item).trim();
          return `${bullet} ${itemText}`;
        }).join('\n') + '\n' : '';
      
      case 'listItem':
        return node.content ? node.content.map(n => processNode(n)).join('').trim() : '';
      
      case 'table':
        // Extract table rows
        if (!node.content) return '';
        
        const rows = node.content.map(row => {
          if (row.type !== 'tableRow') return null;
          return row.content.map(cell => {
            const cellType = cell.type; // tableHeader or tableCell
            const cellText = cell.content ? 
              cell.content.map(c => processNode(c, true)).join('').trim() : '';
            return { text: cellText, isHeader: cellType === 'tableHeader' };
          });
        }).filter(r => r);
        
        if (rows.length === 0) return '';
        
        // Build markdown table
        let table = '';
        rows.forEach((row, rowIdx) => {
          const rowText = '| ' + row.map(cell => cell.text).join(' | ') + ' |';
          table += rowText + '\n';
          
          // Add separator after header row
          if (rowIdx === 0 && row.some(c => c.isHeader)) {
            const separator = '|' + row.map(() => '------------').join('|') + '|';
            table += separator + '\n';
          }
        });
        
        return table + '\n';
      
      case 'hardBreak':
        return '\n';
      
      default:
        // For unknown types, try to process content
        return node.content ? node.content.map(n => processNode(n, inTable)).join('') : '';
    }
  }

  return processNode(adf);
}

// CLI usage
if (require.main === module) {
  const stdin = fs.readFileSync(0, 'utf-8');
  
  try {
    const markdown = adfToMarkdown(stdin);
    console.log(markdown);
  } catch (error) {
    console.error('Error converting ADF to Markdown:', error.message);
    process.exit(1);
  }
}

module.exports = { adfToMarkdown };

