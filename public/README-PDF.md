# PDF System Documentation

## Overview
Complete PDF management system for religious scriptures with full-featured viewer.

---

## 📁 Folder Structure

```
public/
└── pdfs/
    ├── 1.pdf              # Bhagavad Gita (book id: 1)
    ├── 2.pdf              # Ramayana (book id: 2)
    ├── 3.pdf              # Shiva Purana (book id: 3)
    ├── 4.pdf              # Hanuman Chalisa (book id: 4)
    ├── 5.pdf              # Durga Saptashati (book id: 5)
    ├── 6.pdf              # Vishnu Sahasranama (book id: 6)
    └── README.md          # Instructions
```

---

## 📚 Adding PDFs

### Naming Convention
PDFs must be named with the **book ID** from `src/data/books.json`:

| Book ID | Book Name | PDF File |
|---------|-----------|----------|
| 1 | Bhagavad Gita | `public/pdfs/1.pdf` |
| 2 | Ramayana | `public/pdfs/2.pdf` |
| 3 | Shiva Purana | `public/pdfs/3.pdf` |
| 4 | Hanuman Chalisa | `public/pdfs/4.pdf` |
| 5 | Durga Saptashati | `public/pdfs/5.pdf` |
| 6 | Vishnu Sahasranama | `public/pdfs/6.pdf` |

### Steps to Add a PDF
1. Get or create your PDF file
2. Rename it to match the book ID: `{book-id}.pdf`
3. Place in `public/pdfs/` directory
4. The PDF will automatically be available in the book's "Read PDF" tab

---

## 🖥️ PDF Viewer Features

### Navigation
- **Previous/Next Page**: Arrow buttons or keyboard arrows
- **Page Jump**: Enter page number directly
- **Thumbnails Sidebar**: Visual page navigation (toggle with grid icon)

### Zoom Controls
- **Zoom In/Out**: +/- buttons or keyboard `+`/`-`
- **Current Zoom Level**: Displayed as percentage
- **Fit Options**: Automatic fit-to-width

### View Options
- **Dark Mode**: Toggle for night reading (inverts colors)
- **Fullscreen**: Full browser window view
- **Rotation**: Rotate document 90° increments

### Tools
- **Download**: Download the PDF file
- **Search**: Search text within document (Ctrl+F)

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `←` | Previous page |
| `→` | Next page |
| `+` | Zoom in |
| `-` | Zoom out |
| `Ctrl+F` | Toggle search |

---

## 📖 PDF Sources

Free religious PDFs can be found at:
- **Internet Archive**: https://archive.org
- **Project Gutenberg**: https://gutenberg.org
- **Sacred Texts**: https://sacred-texts.com
- **Gita Press**: https://gitapress.org
- **Hindi Granth Karyalay**: Various Hindi scriptures

---

## ⚙️ Technical Details

### Supported Features
- Lazy page loading for performance
- Page caching
- Text layer for selection/search
- Annotation layer support
- Responsive design (mobile/tablet/desktop)
- Large file support

### File Size Recommendations
- **Optimal**: Under 50MB for best performance
- **Maximum Tested**: 200MB+
- For very large files, consider splitting into volumes

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support with touch gestures

---

## 🔧 Troubleshooting

### PDF Not Loading
1. Check file exists in `public/pdfs/`
2. Verify filename matches book ID (e.g., `1.pdf` for book ID "1")
3. Check browser console for errors
4. Try a different PDF to rule out file corruption

### Slow Loading
- Large PDFs may take longer to load initially
- Pages are loaded lazily for performance
- Consider compressing the PDF or splitting into volumes

### Text Not Searchable
- Some PDFs are image-based (scanned)
- These require OCR processing to make searchable
- Use Adobe Acrobat or online OCR tools to add text layer

### Dark Mode Issues
- Dark mode uses CSS inversion
- Some images may appear inverted
- Toggle dark mode off for image-heavy pages

---

## 📝 Code Example: Using PDFReader Component

```tsx
import { PDFReader } from "@/components/PDFReader";

// Basic usage
<PDFReader 
  pdfUrl="/pdfs/1.pdf" 
  bookTitle="Bhagavad Gita"
/>

// In a tab or modal
<TabsContent value="pdf">
  <PDFReader 
    pdfUrl={`/pdfs/${bookId}.pdf`}
    bookTitle={book.title}
  />
</TabsContent>
```

---

## 🆕 Adding a New Book with PDF

1. **Add book entry** in `src/data/books.json`:
```json
{
  "id": "7",
  "title": "New Scripture Name",
  "author": "Author",
  "price": 299,
  ...
}
```

2. **Add PDF file**:
```
public/pdfs/7.pdf
```

3. **Add cover image**:
```
public/images/books/new-scripture.jpg
```

4. The app will automatically:
   - Show the book in the catalogue
   - Load the PDF in the "Read PDF" tab
   - Display the cover image
