import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabaseAdmin } from '../config/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', '..', '..', 'frontend', 'public');

// Configure multer memory storage
const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 104857600 // 100 MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedMime = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
      'video/mp4', 'video/webm', 'video/quicktime'
    ];
    if (allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
    }
  }
});

// Upload controller
export async function handleUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded.' });
    }

    const { folder = 'general' } = req.body;
    const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '');
    const ext = req.file.originalname.split('.').pop();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const fileName = `${cleanFolder}/${timestamp}-${random}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('yaari-media')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabaseAdmin.storage
      .from('yaari-media')
      .getPublicUrl(fileName);

    res.json({
      success: true,
      data: {
        path: fileName,
        url: publicUrlData.publicUrl,
        size: req.file.size,
        mimeType: req.file.mimetype,
        originalName: req.file.originalname
      }
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// Helper to recursively scan local media directory
function getLocalFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getLocalFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

// List all uploaded media files in storage AND existing website media assets
export async function getMediaLibrary(req, res) {
  try {
    const allFiles = [];

    // 1. Gather all files uploaded to Supabase Storage
    const folders = ['gallery', 'thumbnails', 'videos', 'hero', 'jamming', 'general'];
    await Promise.all(folders.map(async (folder) => {
      const { data } = await supabaseAdmin.storage
        .from('yaari-media')
        .list(folder, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

      if (data) {
        data.forEach(item => {
          if (item.name && !item.name.startsWith('.')) {
            const { data: urlData } = supabaseAdmin.storage
              .from('yaari-media')
              .getPublicUrl(`${folder}/${item.name}`);

            const isVideo = /\.(mp4|webm|mov|ogg)$/i.test(item.name);
            allFiles.push({
              name: item.name,
              folder,
              path: `${folder}/${item.name}`,
              url: urlData.publicUrl,
              type: isVideo ? 'video' : 'image',
              size: item.metadata?.size || item.metadata?.contentLength || 0,
              created_at: item.created_at,
              source: 'supabase'
            });
          }
        });
      }
    }));

    // 2. Gather all existing website media photos and videos from frontend/public
    const localDirectories = [
      { sub: 'media/instagram/images', folder: 'gallery' },
      { sub: 'media/instagram/videos', folder: 'videos' },
      { sub: 'images', folder: 'general' },
      { sub: 'brand', folder: 'brand' }
    ];

    localDirectories.forEach(({ sub, folder }) => {
      const targetDir = path.join(publicDir, sub);
      const filePaths = getLocalFiles(targetDir);
      filePaths.forEach((f) => {
        const relPath = path.relative(publicDir, f).replace(/\\/g, '/');
        const isVideo = /\.(mp4|webm|mov|ogg)$/i.test(f);
        const stats = fs.statSync(f);

        allFiles.push({
          name: path.basename(f),
          folder,
          path: relPath,
          url: '/' + relPath,
          type: isVideo ? 'video' : 'image',
          size: stats.size,
          created_at: stats.birthtime ? stats.birthtime.toISOString() : stats.mtime.toISOString(),
          source: 'website'
        });
      });
    });

    // Sort newest first
    allFiles.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

    res.json({ success: true, data: allFiles });
  } catch (err) {
    console.error('List media library error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// Delete media item from Supabase storage or website media
export async function deleteMediaItem(req, res) {
  try {
    const { path: filePath, source } = req.body;
    if (!filePath) {
      return res.status(400).json({ success: false, error: 'File path is required.' });
    }

    if (source === 'supabase' || filePath.includes('/')) {
      const { error } = await supabaseAdmin.storage
        .from('yaari-media')
        .remove([filePath]);

      if (error) {
        console.warn('Storage delete warning:', error.message);
      }
    }

    // If local website file and exists, safely remove
    if (source === 'website' || filePath.startsWith('media/') || filePath.startsWith('images/')) {
      const fullPath = path.join(publicDir, filePath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (unlinkErr) {
          console.warn('Local unlink notice:', unlinkErr.message);
        }
      }
    }

    res.json({ success: true, message: 'Media item deleted successfully.' });
  } catch (err) {
    console.error('Delete media error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}


