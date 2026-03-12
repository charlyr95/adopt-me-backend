import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import multer from 'multer';

const uploadsDir = path.resolve(process.cwd(), 'data', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const parsed = path.parse(file.originalname || 'photo');
    const safeBase = (parsed.name || 'photo').replace(/[^a-zA-Z0-9-_]/g, '');
    const ext = (parsed.ext || '').toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${safeBase || 'photo'}-${unique}${ext}`);
  }
});

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || '').toLowerCase();
  if (allowedMimeTypes.has(file.mimetype) && allowedExtensions.has(ext)) {
    return cb(null, true);
  }
  const error = new Error('Only image files are allowed');
  error.statusCode = 400;
  return cb(error);
};

export const uploadPetPhotos = multer({
  storage,
  fileFilter,
  limits: {
    files: 10,
    fileSize: 2 * 1024 * 1024
  }
});

export const removeUploadedFiles = async (files = []) => {
  if (!Array.isArray(files) || files.length === 0) return;
  await Promise.all(
    files.map((file) => fsPromises.unlink(file.path).catch(() => null))
  );
};
