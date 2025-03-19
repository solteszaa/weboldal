const fs = require('fs');
const path = require('path');

// Rekurzívan bejárja a könyvtárakat
function walkSync(dir, filelist = []) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filepath = path.join(dir, file);
      try {
        const stat = fs.statSync(filepath);
        
        if (stat.isDirectory()) {
          filelist = walkSync(filepath, filelist);
        } else if (filepath.endsWith('.tsx') || filepath.endsWith('.jsx')) {
          filelist.push(filepath);
        }
      } catch (err) {
        console.error(`Hiba a fájl statisztikák lekérésekor: ${filepath}`, err);
      }
    });
  } catch (err) {
    console.error(`Hiba a könyvtár olvasásakor: ${dir}`, err);
  }
  
  return filelist;
}

// Fájl ellenőrzése és javítása
function fixReactImport(filePath) {
  try {
    console.log(`Ellenőrzés: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Ellenőrizzük, hogy már van-e React import
    if (!content.includes('import React') && !content.includes('import * as React')) {
      console.log(`React import hozzáadása: ${filePath}`);
      
      let updatedContent;
      // Ha 'use client' direktíva van, utána adjuk hozzá az importot
      if (content.includes("'use client'")) {
        updatedContent = content.replace("'use client';", "'use client';\n\nimport React from 'react';");
      } else {
        // Egyébként a fájl elejére tesszük
        updatedContent = `import React from 'react';\n\n${content}`;
      }
      
      fs.writeFileSync(filePath, updatedContent);
      console.log(`React import sikeresen hozzáadva: ${filePath}`);
    } else {
      console.log(`Ez a fájl már tartalmaz React importot: ${filePath}`);
    }
  } catch (err) {
    console.error(`Hiba a fájl feldolgozása közben: ${filePath}`, err);
  }
}

// Fő függvény
function main() {
  const rootDir = path.join(__dirname, 'soltai-webapp', 'src');
  console.log(`Keresés a könyvtárban: ${rootDir}`);
  
  // Explicit módon bejárjuk a komponens könyvtárat is
  const componentsDir = path.join(rootDir, 'components');
  console.log(`Komponensek keresése: ${componentsDir}`);
  
  let tsxFiles = walkSync(rootDir);
  console.log(`${tsxFiles.length} TSX/JSX fájl található.`);
  
  tsxFiles.forEach(file => {
    fixReactImport(file);
  });
  
  console.log('Javítás befejezve!');
}

main(); 