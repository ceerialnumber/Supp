import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = process.cwd();

const app = express();
const PORT = 3000;

const isVercel = process.env.VERCEL === '1';

// Try to import Vercel Blob if available
let vercelBlobAvailable = false;
let put: any = null;
try {
  const { put: vercelPut } = await import('@vercel/blob');
  put = vercelPut;
  vercelBlobAvailable = !!process.env.BLOB_READ_WRITE_TOKEN;
  if (vercelBlobAvailable) {
    console.log('✓ Vercel Blob Storage is available for image uploads');
  }
} catch (e) {
  console.log('Vercel Blob not available, using fallback storage');
}

// Ensure upload directory exists - Use /tmp on Vercel as root is read-only
const uploadDir = isVercel ? "/tmp/images" : path.join(root, "public", "images");
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (e) {
    console.error("Failed to create upload dir:", e);
  }
}

// Multer configuration for file uploads
const storage = isVercel 
  ? multer.memoryStorage() // Better for Vercel
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const name = path.parse(file.originalname).name;
        const safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        cb(null, `${safeName}_${Date.now()}${ext}`);
      }
    });

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

app.use(express.json());

// Serve uploaded images
app.use('/images', express.static(uploadDir));

// API Route for image upload
app.post("/api/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  
  try {
    // Try Vercel Blob first if available
    if (vercelBlobAvailable && put) {
      console.log('Uploading to Vercel Blob Storage:', req.file.originalname);
      const timestamp = Date.now();
      const filename = `images/${timestamp}_${req.file.originalname}`;
      const blob = await put(filename, req.file.buffer, {
        access: 'public',
        contentType: req.file.mimetype,
      });
      console.log('✓ Upload successful:', blob.url);
      return res.json({ url: blob.url });
    }
    
    // Fallback for local development
    if (isVercel) {
      // On Vercel without Blob, return base64
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      res.json({ url: base64 });
    } else {
      // Local development - save to disk
      const publicPath = `/images/${req.file.filename}`;
      res.json({ url: publicPath });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed', details: String(error) });
  }
});

async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(root, "dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
    }
    app.get("*", (req, res) => {
      const distPath = path.join(root, "dist");
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.send("Application is building or dist folder not found.");
      }
    });
  }

  // Only listen if this file is run directly
  if (import.meta.url === `file://${process.argv[1]}` || (process.env.NODE_ENV === "production" && !isVercel)) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

setupVite();

export default app;
