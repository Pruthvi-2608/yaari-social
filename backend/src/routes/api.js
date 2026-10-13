import { Router } from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import {
  getMenu,
  getCategories,
  getItems,
  createCategory,
  updateCategory,
  deleteCategory,
  createItem,
  updateItem,
  deleteItem
} from '../controllers/menuController.js';
import {
  getGallery,
  getAllGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} from '../controllers/galleryController.js';
import {
  getVideos,
  getAllVideos,
  createVideo,
  updateVideo,
  deleteVideo
} from '../controllers/videoController.js';
import {
  getSiteContent,
  updateSiteContent,
  getSiteSettings,
  updateSiteSetting,
  getDashboardStats
} from '../controllers/contentController.js';
import {
  uploadMiddleware,
  handleUpload,
  getMediaLibrary,
  deleteMediaItem
} from '../controllers/uploadController.js';

const router = Router();

// --- Health ---
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'yaari-social-backend',
    version: '1.0.0'
  });
});

// --- Public Endpoints ---
router.get('/menu', getMenu);
router.get('/menu/categories', getCategories);
router.get('/menu/items', getItems);
router.get('/gallery', getGallery);
router.get('/videos', getVideos);
router.get('/site-content', getSiteContent);
router.get('/site-content/:sectionKey', getSiteContent);
router.get('/content', getSiteContent);
router.get('/content/:sectionKey', getSiteContent);
router.get('/site-settings', getSiteSettings);
router.get('/site-settings/:settingKey', getSiteSettings);
router.get('/settings', getSiteSettings);

// --- Admin Endpoints (Protected by authenticateAdmin) ---
// Dashboard overview metrics
router.get('/admin/dashboard', authenticateAdmin, getDashboardStats);

// Menu management
router.post('/admin/categories', authenticateAdmin, createCategory);
router.patch('/admin/categories/:id', authenticateAdmin, updateCategory);
router.delete('/admin/categories/:id', authenticateAdmin, deleteCategory);

router.post('/admin/menu', authenticateAdmin, createItem);
router.patch('/admin/menu/:id', authenticateAdmin, updateItem);
router.delete('/admin/menu/:id', authenticateAdmin, deleteItem);

// Gallery management
router.get('/admin/gallery', authenticateAdmin, getAllGallery);
router.post('/admin/gallery', authenticateAdmin, createGalleryItem);
router.patch('/admin/gallery/:id', authenticateAdmin, updateGalleryItem);
router.delete('/admin/gallery/:id', authenticateAdmin, deleteGalleryItem);

// Videos management
router.get('/admin/videos', authenticateAdmin, getAllVideos);
router.post('/admin/videos', authenticateAdmin, createVideo);
router.patch('/admin/videos/:id', authenticateAdmin, updateVideo);
router.delete('/admin/videos/:id', authenticateAdmin, deleteVideo);

// Site content & settings
router.put('/admin/site-content/:sectionKey', authenticateAdmin, updateSiteContent);
router.put('/admin/site-settings/:settingKey', authenticateAdmin, updateSiteSetting);

// Media Upload & Library
router.post('/admin/upload', authenticateAdmin, uploadMiddleware.single('file'), handleUpload);
router.get('/admin/media', authenticateAdmin, getMediaLibrary);
router.delete('/admin/media', authenticateAdmin, deleteMediaItem);

export default router;
