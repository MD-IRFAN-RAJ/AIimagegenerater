import multer from 'multer';
import path from 'path';

// Store file temporarily in memory or disk (here disk example)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');  // Make sure this folder exists or create it
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // unique filename
  },
});

export const upload = multer({ storage });
