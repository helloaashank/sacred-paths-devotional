import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiBook, FiShoppingCart, FiChevronDown } from "react-icons/fi";
import booksData from "@/data/books.json";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PullToRefresh } from "@/components/PullToRefresh";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Books = () => {
  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("title");
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const categories = ["all", ...Array.from(new Set(booksData.map((book) => book.category)))];

  const sortLabels: Record<string, string> = {
    title: "A-Z",
    "price-low": "Price ↑",
    "price-high": "Price ↓",
  };

  const filteredBooks = booksData
    .filter((book) => filter === "all" || book.category === filter)
    .sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      return 0;
    });

  const handleRefresh = useCallback(async () => {
    // Simulate refresh - in real app, this would refetch data
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Books refreshed");
  }, []);

  return (
    <PullToRefresh onRefresh={handleRefresh} className="h-full">
      <div className="px-4 py-4">
      {/* Filter & Sort Row */}
      <div className="flex items-center gap-2 mb-4">
        {/* Category Pills - Scrollable */}
        <div className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide snap-x">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(category)}
              className={`flex-shrink-0 text-xs h-8 px-3 snap-start ${
                filter === category ? "bg-gradient-hero" : ""
              }`}
            >
              {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex-shrink-0 h-8 text-xs gap-1">
              {sortLabels[sort]}
              <FiChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card">
            <DropdownMenuItem onClick={() => setSort("title")}>Title (A-Z)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort("price-low")}>Price: Low to High</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort("price-high")}>Price: High to Low</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Books Grid - 2 columns on mobile */}
      <div className="grid grid-cols-2 gap-3">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="overflow-hidden bg-card">
            <Link to={`/books/${book.id}`}>
              <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                {book.coverImage ? (
                  <img 
                    src={book.coverImage} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-hero opacity-20">
                    <FiBook className="text-4xl text-primary/30" />
                  </div>
                )}
              </div>
            </Link>
            <CardContent className="p-2.5 space-y-1.5">
              <Link to={`/books/${book.id}`}>
                <h3 className="font-medium text-sm text-foreground line-clamp-2 leading-tight">
                  {book.title}
                </h3>
              </Link>
              <p className="text-xs text-muted-foreground truncate">{book.author}</p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-semibold text-primary">₹{book.price}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    addToCart({
                      id: book.id,
                      title: book.title,
                      price: book.price,
                      author: book.author,
                    })
                  }
                  className="h-8 w-8 p-0"
                >
                  <FiShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <FiBook className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{t.books.no_books}</p>
        </div>
      )}
      </div>
    </PullToRefresh>
  );
};

export default Books;
