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
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  
  if (isVercel) {
    // On Vercel, we can't easily serve the memory-stored file later without real storage
    // But for "fixing the deploy" we'll return a data URL or just the path and hope for the best
    // Ideally user should use Firebase Storage.
    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    res.json({ url: base64 });
  } else {
    const publicPath = `/images/${req.file.filename}`;
    res.json({ url: publicPath });
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
