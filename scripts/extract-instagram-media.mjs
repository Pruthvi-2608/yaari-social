import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Ensure output directories exist
const publicDir = path.join(rootDir, 'public');
const brandDir = path.join(publicDir, 'brand');
const menuImgDir = path.join(publicDir, 'images', 'menu');
const mediaDir = path.join(publicDir, 'media', 'instagram');
const imgDir = path.join(mediaDir, 'images');
const videoDir = path.join(mediaDir, 'videos');
const dataDir = path.join(rootDir, 'src', 'data');

[brandDir, menuImgDir, imgDir, videoDir, dataDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Copy logo and menu images
const logoSrc = path.join(rootDir, 'logo.png');
const logoDest = path.join(brandDir, 'yaari-social-logo.png');
if (fs.existsSync(logoSrc)) {
  fs.copyFileSync(logoSrc, logoDest);
  console.log('✓ Copied logo to', logoDest);
}

const menu1Src = path.join(rootDir, 'menu1.png');
const menu1Dest = path.join(menuImgDir, 'menu-food.png');
if (fs.existsSync(menu1Src)) {
  fs.copyFileSync(menu1Src, menu1Dest);
  console.log('✓ Copied menu1 to', menu1Dest);
}

const menu2Src = path.join(rootDir, 'menu2.png');
const menu2Dest = path.join(menuImgDir, 'menu-drinks.png');
if (fs.existsSync(menu2Src)) {
  fs.copyFileSync(menu2Src, menu2Dest);
  console.log('✓ Copied menu2 to', menu2Dest);
}

// Helper to download a file with stream
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      // File already exists and has non-trivial size
      return resolve(destPath);
    }
    const file = fs.createWriteStream(destPath);
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(destPath);
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return reject(new Error(`Failed to download ${url}: status code ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(destPath));
      });
    });
    req.on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
    req.setTimeout(30000, () => {
      req.destroy();
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(new Error('Download timeout'));
    });
  });
}

// CSV Parser
function parseCSV(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let currentStr = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentStr += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentStr);
      currentStr = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(currentStr);
      currentStr = '';
      if (row.some(cell => cell.trim().length > 0)) {
        lines.push(row);
      }
      row = [];
    } else {
      currentStr += char;
    }
  }
  if (currentStr.length > 0 || row.length > 0) {
    row.push(currentStr);
    lines.push(row);
  }
  return lines;
}

async function run() {
  const csvPath = path.join(rootDir, 'dataset_instagram-scraper_2026-08-23_10-38-39-344.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found at', csvPath);
    return;
  }
  const raw = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCSV(raw);
  const headers = rows[0];
  const rawPosts = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = r[idx] || '';
    });
    rawPosts.push(obj);
  }

  console.log(`Parsed ${rawPosts.length} posts from CSV.`);

  const normalizedPosts = [];

  for (let i = 0; i < rawPosts.length; i++) {
    const post = rawPosts[i];
    const shortCode = post.shortCode || `post-${i}`;
    const type = post.type === 'Video' ? 'video' : 'image';
    const caption = post.caption || '';
    const timestamp = post.timestamp || '';
    const likes = parseInt(post.likesCount || '0', 10);
    const comments = parseInt(post.commentsCount || '0', 10);
    const width = parseInt(post.dimensionsWidth || '1080', 10);
    const height = parseInt(post.dimensionsHeight || '1920', 10);
    const isVideo = type === 'video' && post.videoUrl && post.videoUrl.startsWith('http');
    const isImage = post.displayUrl && post.displayUrl.startsWith('http');

    let videoLocalPath = '';
    let imageLocalPath = '';

    // Download thumbnail/display image
    if (isImage) {
      const imgFileName = `${shortCode}.jpg`;
      const imgDest = path.join(imgDir, imgFileName);
      try {
        await downloadFile(post.displayUrl, imgDest);
        imageLocalPath = `/media/instagram/images/${imgFileName}`;
        console.log(`✓ [${i+1}/${rawPosts.length}] Image saved: ${imgFileName}`);
      } catch (err) {
        console.warn(`✗ [${i+1}/${rawPosts.length}] Image download error (${shortCode}):`, err.message);
        imageLocalPath = post.displayUrl; // fallback to CDN url if local download fails
      }
    }

    // Download video if present
    if (isVideo) {
      const vidFileName = `${shortCode}.mp4`;
      const vidDest = path.join(videoDir, vidFileName);
      try {
        await downloadFile(post.videoUrl, vidDest);
        videoLocalPath = `/media/instagram/videos/${vidFileName}`;
        console.log(`✓ [${i+1}/${rawPosts.length}] Video saved: ${vidFileName}`);
      } catch (err) {
        console.warn(`✗ [${i+1}/${rawPosts.length}] Video download error (${shortCode}):`, err.message);
        videoLocalPath = post.videoUrl; // fallback to CDN url
      }
    }

    // Categorization logic based on caption keywords
    const capLower = caption.toLowerCase();
    let category = 'gallery';
    const isJamming = capLower.includes('music') || capLower.includes('jam') || capLower.includes('parshuram') || capLower.includes('live') || capLower.includes('guitar') || capLower.includes('acoustic') || capLower.includes('song') || capLower.includes('sings') || capLower.includes('artist');
    const isMonsoon = capLower.includes('monsoon') || capLower.includes('backyard') || capLower.includes('rain');
    const isCoffee = capLower.includes('coffee') || capLower.includes('chai') || capLower.includes('tea') || capLower.includes('cart');
    const isVibe = capLower.includes('vibe') || capLower.includes('cozy') || capLower.includes('silvassa') || capLower.includes('opening') || capLower.includes('decorat');

    if (isJamming) {
      category = 'jamming';
    } else if (isVideo && (isMonsoon || isVibe || isCoffee)) {
      category = 'reels';
    } else if (isCoffee || capLower.includes('food') || capLower.includes('sandwich')) {
      category = 'food';
    } else {
      category = 'gallery';
    }

    normalizedPosts.push({
      id: `ig-${shortCode}`,
      shortCode,
      type: isVideo ? 'video' : 'image',
      src: isVideo ? videoLocalPath : imageLocalPath,
      videoSrc: videoLocalPath || null,
      thumbnail: imageLocalPath || null,
      caption: caption.trim(),
      likes: isNaN(likes) || likes < 0 ? 0 : likes,
      comments: isNaN(comments) || comments < 0 ? 0 : comments,
      timestamp,
      width,
      height,
      category,
      aspectRatio: width && height ? (width / height).toFixed(3) : '0.562',
      instagramUrl: `https://www.instagram.com/p/${shortCode}/`
    });
  }

  // Generate manifest file
  const manifestContent = `/**
 * Normalized Instagram Media Manifest for Yaari Social
 * Auto-extracted and curated from dataset
 */

export const instagramMedia = ${JSON.stringify(normalizedPosts, null, 2)};

// Hero Video candidates (high resolution, high vibe)
export const heroMedia = {
  video: instagramMedia.find(m => m.shortCode === 'DauajytN5En')?.videoSrc || instagramMedia.find(m => m.type === 'video')?.videoSrc,
  poster: instagramMedia.find(m => m.shortCode === 'DauajytN5En')?.thumbnail || instagramMedia.find(m => m.type === 'video')?.thumbnail,
  title: "A little coffee. A lot of yaari.",
  subtitle: "Coffee, comfort food, conversations and evenings worth staying for."
};

// Jamming section media (Live music, crowd vibes, acoustic nights)
export const jammingMedia = {
  mainVideo: instagramMedia.find(m => m.shortCode === 'Db_CweANDwQ' && m.videoSrc) || instagramMedia.find(m => m.category === 'jamming' && m.videoSrc),
  secondaryVideo: instagramMedia.find(m => m.shortCode === 'DZ0QpG1tDzn' && m.videoSrc) || instagramMedia.find(m => m.shortCode === 'DaFNN55NFRy' && m.videoSrc),
  eventPoster: instagramMedia.find(m => m.shortCode === 'DcLMoGnNRJ6') || instagramMedia.find(m => m.category === 'jamming' && m.type === 'image'),
  crowdVibe: instagramMedia.find(m => m.shortCode === 'DZrlORqtNmd') || instagramMedia.find(m => m.shortCode === 'DbGkhwUq88Z')
};

// Vertical Reels for horizontal rail (9:16 format)
export const reelVideos = instagramMedia
  .filter(m => m.videoSrc)
  .slice(0, 10);

// Curated Moments Gallery
export const galleryMoments = instagramMedia
  .filter(m => m.thumbnail)
  .slice(0, 12);
`;

  const manifestPath = path.join(dataDir, 'instagramMedia.js');
  fs.writeFileSync(manifestPath, manifestContent, 'utf8');
  console.log(`\n✓ Generated ${manifestPath} with ${normalizedPosts.length} media items.`);
}

run().catch(err => {
  console.error('Error during media extraction:', err);
  process.exit(1);
});
