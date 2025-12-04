# Bhajans System Documentation

## Overview
This system manages bhajans (devotional songs) with full credits, auto-generated thumbnails, and synced lyrics support.

---

## 📁 Folder Structure

```
public/
├── audio/                    # Audio files (MP3, M4A)
│   ├── om-jai-jagdish.mp3
│   ├── hanuman-chalisa.mp3
│   └── ...
├── thumbnails/
│   └── bhajans/              # Bhajan cover images
│       ├── om-jai-jagdish.jpg
│       ├── hanuman-chalisa.jpg
│       └── ...
├── lyrics/                   # Lyrics files (LRC or TXT)
│   ├── om-jai-jagdish.lrc    # Synced lyrics
│   ├── hanuman-chalisa.txt   # Plain lyrics
│   └── ...
└── README-BHAJANS.md         # This file

src/
└── data/
    └── bhajans.json          # Bhajan metadata & credits
```

---

## 🎵 Adding a New Bhajan

### Step 1: Add Audio File
Place your MP3/M4A file in `public/audio/`:
```
public/audio/your-bhajan-name.mp3
```

### Step 2: Add Thumbnail (Optional)
Place cover image in `public/thumbnails/bhajans/`:
```
public/thumbnails/bhajans/your-bhajan-name.jpg
```
- Recommended size: 500x500px
- Supported formats: JPG, PNG, WebP
- If no thumbnail is provided, a placeholder will be shown

### Step 3: Add Lyrics (Optional)
Place lyrics file in `public/lyrics/`:

**For Synced Lyrics (LRC format):**
```
public/lyrics/your-bhajan-name.lrc
```

**LRC Format Example:**
```lrc
[ti:Bhajan Title]
[ar:Artist Name]

[00:00.00] First line of lyrics
[00:05.50] Second line of lyrics
[00:10.20] Third line of lyrics
```

**For Plain Lyrics (TXT format):**
```
public/lyrics/your-bhajan-name.txt
```

### Step 4: Update bhajans.json
Add entry in `src/data/bhajans.json`:

```json
{
  "id": "10",
  "title": "Your Bhajan Title",
  "artist": "Artist Name",
  "duration": "4:30",
  "category": "Bhajan",
  "language": "Hindi",
  "deity": "Krishna",
  "audioFile": "/audio/your-bhajan-name.mp3",
  "thumbnail": "/thumbnails/bhajans/your-bhajan-name.jpg",
  "lrcFile": "/lyrics/your-bhajan-name.lrc",
  "lyrics": "Fallback lyrics text here...",
  "credits": {
    "singers": ["Singer 1", "Singer 2"],
    "label": "Music Label Name",
    "producer": "Producer Name",
    "lyricist": "Lyricist Name",
    "composer": "Composer Name",
    "copyright": "Copyright Holder",
    "year": "2024",
    "source": "YouTube"
  }
}
```

---

## 📋 Credits System

### Required Fields
| Field | Description | Example |
|-------|-------------|---------|
| `singers` | Array of singer names | `["Anuradha Paudwal", "Kumar Sanu"]` |
| `label` | Music label/studio | `"T-Series"` |
| `lyricist` | Lyrics writer | `"Gulzar"` |
| `composer` | Music composer | `"A.R. Rahman"` |
| `copyright` | Rights holder | `"T-Series"` |
| `year` | Release year | `"2024"` |
| `source` | Origin source | `"YouTube"`, `"Self-upload"`, `"Studio"` |

### Optional Fields
| Field | Description |
|-------|-------------|
| `producer` | Music producer name |

### Default Values
If any field is missing, "Unknown" will be displayed.

---

## 🎧 Auto Thumbnail System

### How It Works
1. **Manual Upload (Recommended)**: Place image in `public/thumbnails/bhajans/`
2. **Fallback**: If no thumbnail exists, a placeholder with the bhajan's deity icon is shown

### Future: ID3 Tag Extraction
The system is designed to support automatic thumbnail extraction from MP3 ID3 tags. This requires the `music-metadata-browser` library.

---

## 📝 Synced Lyrics (LRC Format)

### LRC File Structure
```lrc
[ti:Song Title]
[ar:Artist]
[al:Album]
[by:Creator]
[offset:0]

[00:00.00] Lyrics line 1
[00:05.20] Lyrics line 2
[00:10.40] Lyrics line 3
```

### Time Format
- `[MM:SS.ms]` - Minutes:Seconds.Milliseconds
- Example: `[01:23.45]` = 1 minute, 23.45 seconds

### Tools for Creating LRC Files
- **LRC Maker**: https://lrcmaker.com/
- **Subtitle Edit**: Open source desktop app
- **LRC Generator**: Various online tools

---

## 🔧 Troubleshooting

### Audio Not Playing
- Check file path in `bhajans.json`
- Ensure file exists in `public/audio/`
- Verify file format is supported (MP3, M4A)

### Thumbnail Not Showing
- Check file path in `bhajans.json`
- Ensure image exists in `public/thumbnails/bhajans/`
- Verify image format (JPG, PNG, WebP)

### Lyrics Not Syncing
- Verify LRC file format is correct
- Check timestamps are accurate
- Ensure `lrcFile` path is correct in `bhajans.json`

---

## 📄 Example Complete Entry

```json
{
  "id": "8",
  "title": "Har Har Shambhu",
  "artist": "Abhilipsa Panda & Jeetu Sharma",
  "duration": "3:46",
  "category": "Bhajan",
  "language": "Hindi",
  "deity": "Shiva",
  "audioFile": "/audio/Har Har Shambhu.mp3",
  "thumbnail": "/thumbnails/bhajans/har-har-shambhu.jpg",
  "lrcFile": "/lyrics/har-har-shambhu.lrc",
  "lyrics": "हर हर शंभू शिव महादेवा",
  "credits": {
    "singers": ["Abhilipsa Panda", "Jeetu Sharma"],
    "label": "Unknown",
    "producer": "Unknown",
    "lyricist": "Traditional",
    "composer": "Jeetu Sharma",
    "copyright": "Respective Owners",
    "year": "2021",
    "source": "YouTube"
  }
}
```
