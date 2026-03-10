const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { analyzeReport, chatAboutReport } = require('../controllers/reportController');

const router = express.Router();

// Configure multer for disk storage
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '-').toLowerCase();
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, PNG, and JPEG files are allowed.'));
  }
};

const upload = multer({ storage, fileFilter });

// Upload + OCR + AI analysis
router.post('/analyze', upload.single('report'), analyzeReport);

// Chat about a report
router.post('/chat', chatAboutReport);

module.exports = router;

