import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiBook, FiFilter, FiShoppingCart } from "react-icons/fi";
import booksData from "@/data/books.json";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Books = () => {
  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("title");
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const categories = ["all", ...Array.from(new Set(booksData.map((book) => book.category)))];

  const filteredBooks = booksData
    .filter((book) => filter === "all" || book.category === filter)
    .sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen py-6 sm:py-12 px-2 sm:px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <FiBook className="text-primary" />
            {t.books.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.books.subtitle}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 bg-card p-3 sm:p-4 rounded-lg shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground whitespace-nowrap">
              <FiFilter className="text-muted-foreground" />
              <span>{t.books.category}:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={filter === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(category)}
                  className={`text-xs sm:text-sm ${filter === category ? "bg-gradient-hero shadow-soft" : ""}`}
                >
                  {category === "all" ? t.books.all : category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
            <span className="text-sm font-medium text-foreground whitespace-nowrap">{t.books.sort_by}:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="title">{t.books.title_sort}</option>
              <option value="price-low">{t.books.price_low}</option>
              <option value="price-high">{t.books.price_high}</option>
            </select>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="group hover:shadow-elevated transition-all duration-300 overflow-hidden bg-gradient-card">
              <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                {book.coverImage ? (
                  <img 
                    src={book.coverImage} 
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`absolute inset-0 flex items-center justify-center bg-gradient-hero opacity-20 ${book.coverImage ? 'hidden' : ''}`}>
                  <FiBook className="text-6xl text-primary/30" />
                </div>
              </div>
              <CardContent className="p-3 sm:p-4 space-y-2">
                <h3 className="font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{book.author}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                  <span className="bg-muted px-2 py-1 rounded whitespace-nowrap">{book.language}</span>
                  <span className="bg-muted px-2 py-1 rounded whitespace-nowrap">{book.pages} {t.books.pages}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{book.description}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                  <span className="text-lg sm:text-xl font-bold text-primary">₹{book.price}</span>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        addToCart({
                          id: book.id,
                          title: book.title,
                          price: book.price,
                          author: book.author,
                        })
                      }
                      className="flex-1 sm:flex-none text-xs"
                    >
                      <FiShoppingCart className="mr-1 h-3 w-3" />
                      <span className="hidden sm:inline">{t.books.add_to_cart}</span>
                      <span className="sm:hidden">Cart</span>
                    </Button>
                    <Link to={`/books/${book.id}`} className="flex-1 sm:flex-none">
                      <Button size="sm" variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-xs">
                        {t.books.view}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">{t.books.no_books}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;