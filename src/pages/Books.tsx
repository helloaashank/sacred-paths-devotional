import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiBook, FiFilter } from "react-icons/fi";
import booksData from "@/data/books.json";

const Books = () => {
  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("title");

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
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <FiBook className="text-primary" />
            Sacred Books
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of spiritual texts and sacred scriptures
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg shadow-soft">
          <div className="flex items-center gap-2 flex-wrap">
            <FiFilter className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Category:</span>
            {categories.map((category) => (
              <Button
                key={category}
                variant={filter === category ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(category)}
                className={filter === category ? "bg-gradient-hero shadow-soft" : ""}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-1.5 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="title">Title</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="group hover:shadow-elevated transition-all duration-300 overflow-hidden bg-gradient-card">
              <div className="aspect-[3/4] bg-gradient-hero opacity-20 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <FiBook className="text-6xl text-primary/30" />
                </div>
              </div>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="bg-muted px-2 py-1 rounded">{book.language}</span>
                  <span className="bg-muted px-2 py-1 rounded">{book.pages} pages</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{book.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-bold text-primary">₹{book.price}</span>
                  <Link to={`/books/${book.id}`}>
                    <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No books found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;