import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FiBook, FiShoppingCart, FiArrowLeft, FiFileText, FiCreditCard } from "react-icons/fi";
import booksData from "@/data/books.json";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PDFReader } from "@/components/PDFReader";
import { useState, useEffect } from "react";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const handleBuyNow = () => {
    if (!book) return;
    navigate("/payment", {
      state: {
        amount: book.price,
        items: [{ title: book.title, quantity: 1, price: book.price }],
        type: "direct"
      }
    });
  };

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
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
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
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">{book.title}</h1>
                  <p className="text-lg sm:text-xl text-muted-foreground">{book.author}</p>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-bold text-primary">₹{book.price}</span>
                  <span className="bg-muted px-2 sm:px-3 py-1 rounded text-xs sm:text-sm whitespace-nowrap">{book.language}</span>
                  <span className="bg-muted px-2 sm:px-3 py-1 rounded text-xs sm:text-sm whitespace-nowrap">{book.pages} {t.books.pages}</span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground">{t.books.description}</h2>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{book.description}</p>
                </div>

                <Card className="bg-muted/50">
                  <CardContent className="p-3 sm:p-4 space-y-2">
                    <h3 className="font-semibold text-sm sm:text-base text-foreground">{t.books.details}</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                      <span className="text-muted-foreground">{t.books.author}:</span>
                      <span className="text-foreground truncate">{book.author}</span>
                      <span className="text-muted-foreground">{t.books.language}:</span>
                      <span className="text-foreground">{book.language}</span>
                      <span className="text-muted-foreground">{t.books.pages}:</span>
                      <span className="text-foreground">{book.pages}</span>
                      <span className="text-muted-foreground">{t.books.year}:</span>
                      <span className="text-foreground">{book.year}</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3 sm:gap-4">
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 text-sm sm:text-base"
                    onClick={() =>
                      addToCart({
                        id: book.id,
                        title: book.title,
                        price: book.price,
                        author: book.author,
                      })
                    }
                  >
                    <FiShoppingCart className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">{t.books.add_to_cart}</span>
                    <span className="sm:hidden">Add to Cart</span>
                  </Button>
                  
                  <Button
                    size="lg"
                    className="flex-1 bg-gradient-hero shadow-soft text-sm sm:text-base"
                    onClick={handleBuyNow}
                  >
                    <FiCreditCard className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">{t.books?.buy_now || "Buy Now"}</span>
                    <span className="sm:hidden">Buy Now</span>
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
                bookTitle={book.title}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BookDetail;
