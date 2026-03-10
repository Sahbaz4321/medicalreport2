const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');
const pdfParse = require('pdf-parse');

/**
 * Extract text from an uploaded medical report file.
 * - For PDFs, uses pdf-parse for text extraction.
 * - For images (PNG/JPEG), uses Tesseract OCR.
 */
async function extractTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text || '';
  }

  // Assume image for everything else (PNG/JPEG)
  const result = await Tesseract.recognize(filePath, 'eng', {
    logger: () => {},
  });

  return result.data && result.data.text ? result.data.text : '';
}

module.exports = {
  extractTextFromFile,
};

