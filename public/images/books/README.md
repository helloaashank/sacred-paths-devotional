# Book Cover Images

Place your book cover images in this directory with the exact filenames specified in `src/data/books.json`.

## Current Required Images (based on books.json):

1. **bhagavad-gita.jpg** - For Bhagavad Gita (id: "1")
2. **ramayana.png** - For Ramayana (id: "2")
3. **shiva-purana.png** - For Shiva Purana (id: "3")
4. **hanuman-chalisa.jpg** - For Hanuman Chalisa (id: "4")
5. **durga-saptashati.jpg** - For Durga Saptashati (id: "5")
6. **vishnu-sahasranama.jpg** - For Vishnu Sahasranama (id: "6")

## Important Notes:

- **Path**: All images MUST be in `public/images/books/` directory
- **Filenames**: MUST exactly match the `coverImage` field in `books.json`
- **Format**: JPG or PNG are supported
- **Dimensions**: Recommended aspect ratio is 3:4 (e.g., 600x800px, 900x1200px)
- **Fallback**: If an image is missing or fails to load, a book icon will be displayed instead

## How It Works:

The `books.json` file contains `coverImage` paths like `/images/books/bhagavad-gita.jpg`. 
In web applications, paths starting with `/` reference the `public` folder.

So `/images/books/bhagavad-gita.jpg` points to `public/images/books/bhagavad-gita.jpg`

## Adding New Books:

When you add a new book to `books.json`:
1. Add the book entry with a `coverImage` field: `"/images/books/your-book-name.jpg"`
2. Place the actual image file at: `public/images/books/your-book-name.jpg`
