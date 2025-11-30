import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FiBook, FiShoppingCart, FiArrowLeft, FiFileText } from "react-icons/fi";
import booksData from "@/data/books.json";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PDFReader } from "@/components/PDFReader";
import { useState, useEffect } from "react";

const BookDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
  const book = booksData.find((b) => b.id === id);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setDarkMode(isDark);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Book Not Found</h1>
          <Link to="/books">
            <Button variant="outline">
              <FiArrowLeft className="mr-2" />
              {t.common.back} to Books
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <Link to="/books">
          <Button variant="ghost" className="mb-6">
            <FiArrowLeft className="mr-2" />
            {t.common.back}
          </Button>
        </Link>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="details">
              <FiBook className="mr-2" />
              {t.books.details}
            </TabsTrigger>
            <TabsTrigger value="reader">
              <FiFileText className="mr-2" />
              {t.books.read_pdf}
            </TabsTrigger>
          </TabsList>

          {/* Book Details Tab */}
          <TabsContent value="details">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Book Cover */}
              <Card className="overflow-hidden bg-gradient-card">
                <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                  {book.coverImage ? (
                    <img 
                      src={book.coverImage} 
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 flex items-center justify-center bg-gradient-hero opacity-20 ${book.coverImage ? 'hidden' : ''}`}>
                    <FiBook className="text-9xl text-primary/30" />
                  </div>
                </div>
              </Card>

              {/* Book Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-2">{book.title}</h1>
                  <p className="text-xl text-muted-foreground">{book.author}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-primary">₹{book.price}</span>
                  <span className="bg-muted px-3 py-1 rounded text-sm">{book.language}</span>
                  <span className="bg-muted px-3 py-1 rounded text-sm">{book.pages} {t.books.pages}</span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-foreground">{t.books.description}</h2>
                  <p className="text-muted-foreground leading-relaxed">{book.description}</p>
                </div>

                <Card className="bg-muted/50">
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-foreground">{t.books.details}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">{t.books.author}:</span>
                      <span className="text-foreground">{book.author}</span>
                      <span className="text-muted-foreground">{t.books.language}:</span>
                      <span className="text-foreground">{book.language}</span>
                      <span className="text-muted-foreground">{t.books.pages}:</span>
                      <span className="text-foreground">{book.pages}</span>
                      <span className="text-muted-foreground">{t.books.year}:</span>
                      <span className="text-foreground">{book.year}</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="flex-1 bg-gradient-hero shadow-soft"
                    onClick={() =>
                      addToCart({
                        id: book.id,
                        title: book.title,
                        price: book.price,
                        author: book.author,
                      })
                    }
                  >
                    <FiShoppingCart className="mr-2" />
                    {t.books.add_to_cart}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* PDF Reader Tab */}
          <TabsContent value="reader">
            <div className="max-w-5xl mx-auto">
              <PDFReader
                pdfUrl={`/pdfs/${book.id}.pdf`}
                darkMode={darkMode}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BookDetail;
