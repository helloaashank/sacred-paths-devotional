# Bhajan Thumbnails

Place your bhajan thumbnail images here. The system will automatically use them.

## Naming Convention
- Name files to match the `thumbnail` field in `src/data/bhajans.json`
- Example: `om-jai-jagdish.jpg`, `hanuman-chalisa.jpg`

## Supported Formats
- JPG/JPEG (recommended)
- PNG
- WebP

## Recommended Size
- 300x300 pixels minimum
- Square aspect ratio preferred
- Keep file size under 200KB for best performance

## Auto-Detection from MP3
If no thumbnail is provided, the system will:
1. First try to load from this thumbnails folder
2. Fall back to deity-based images from `/images/books/`
3. Use a default placeholder if nothing found

## Tips
- Use album art or deity images
- Ensure good contrast for visibility
- Test in both light and dark modes
