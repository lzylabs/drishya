# Splat File Optimisation Pipeline
## Drishya — How to get .ply / .splat files onto the web

---

## The problem
Your Krishna Chariot.ply = 306MB — way over GitHub Pages 100MB file limit.
Raw .ply files are also slow to parse in the browser.

## Step 1 — Convert .ply → .splat (mandatory)

The .splat format is a compact binary invented for web streaming.
A 300MB .ply typically becomes 40–60MB as .splat.

### Option A — SuperSplat (free, browser-based)
1. Go to https://playcanvas.com/super-splat
2. File → Open → pick your .ply
3. File → Export → .splat
4. Done. No install needed.

### Option B — inria2splat (Python, gives more control)
```bash
pip install plyfile numpy
python convert_ply_to_splat.py input.ply output.splat
```
A minimal converter script is in `/scripts/convert_ply_to_splat.py`

### Option C — gaussian-splatting repo tools
```bash
git clone https://github.com/graphdeco-inria/gaussian-splatting
python render.py -m <model_path> --convert_to_splat
```

---

## Step 2 — Further compression

After converting to .splat:

### Sort by distance (dramatically improves render quality)
SuperSplat has a "Sort" button — always click this before exporting.
Unsorted splats look muddy; sorted ones look sharp and photorealistic.

### Reduce Gaussian count
In SuperSplat: Edit → Cull by Opacity → remove low-opacity splats (< 0.05).
This removes 20–40% of Gaussians with almost no visual loss.

### Target file sizes for web
| Scene type       | Target .splat size | Notes                          |
|------------------|--------------------|--------------------------------|
| Single room      | 5–15 MB            | Instant load                   |
| Full apartment   | 15–35 MB           | Good UX with streaming         |
| Villa / exterior | 30–60 MB           | Use progressive loading        |
| Entire building  | 60–120 MB          | Requires chunked streaming     |

---

## Step 3 — Hosting (GitHub Pages limits)

GitHub Pages hard limit: **100MB per file**.

### Option A — Git LFS (easiest for GitHub)
```bash
git lfs install
git lfs track "*.splat"
git add .gitattributes
git add public/splats/property-01.splat
git commit -m "Add splat file via LFS"
```
⚠ Git LFS on GitHub Free: 1GB storage + 1GB/month bandwidth.
For commercial use, upgrade GitHub or move to R2.

### Option B — Cloudflare R2 (recommended for production)
- 10GB free storage, free egress
- Upload via Cloudflare dashboard or `wrangler`
- Set CORS to allow your domain
- Reference as: `https://pub-XXXX.r2.dev/splats/property-01.splat`

### Option C — Bunny CDN (cheapest at scale)
- ~$0.01/GB storage, ~$0.01/GB egress
- Better than R2 for high-traffic scenarios

---

## Step 4 — Loading in the viewer

The project uses `@mkkellogg/gaussian-splats-3d` to load real .splat files.
Usage (add to a new GaussianSplatViewer component):

```jsx
import { Viewer } from '@mkkellogg/gaussian-splats-3d'

// Inside your R3F useEffect or a dedicated vanilla Three.js canvas:
const viewer = new Viewer({
  cameraUp: [0, -1, 0],
  initialCameraPosition: [0, 10, 15],
  initialCameraLookAt: [0, 0, 0],
})

viewer
  .addSplatScene('https://your-cdn.com/splats/property-01.splat', {
    splatAlphaRemovalThreshold: 5,    // trim near-transparent splats
    showLoadingUI: true,
    position: [0, 0, 0],
    rotation: [0, 0, 0, 1],
    scale: [1, 1, 1],
  })
  .then(() => viewer.start())
```

Progressive loading tip: load a decimated (10%) splat first,
then swap to full-res once camera is positioned.

---

## Workflow summary

```
Capture with phone/camera  →  COLMAP or Polycam  →  train 3DGS  →  .ply
                                                               ↓
                                                     SuperSplat: sort + cull
                                                               ↓
                                                            .splat (~50MB)
                                                               ↓
                                                     Upload to Cloudflare R2
                                                               ↓
                                                     Load via gaussian-splats-3d
```

---

## Recommended capture tools for real estate

| Tool        | Platform | Price | Notes                                  |
|-------------|----------|-------|----------------------------------------|
| Polycam     | iOS      | $20/m | Best for phones; exports .ply directly |
| Luma AI     | iOS      | Free  | Exports NeRF + 3DGS                    |
| RealityCapture | PC   | €/scene | Pro-quality, complex scenes          |
| Gaussian Splatting (COLMAP+) | PC | Free | Full control, needs GPU |
