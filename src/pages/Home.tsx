import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FiArrowRight, FiBook, FiMusic, FiCalendar, FiPlay } from "react-icons/fi";
import { GiMeditation } from "react-icons/gi";
import booksData from "@/data/books.json";
import bhajansData from "@/data/bhajans.json";

const Home = () => {
  const featuredBooks = booksData.filter((book) => book.featured).slice(0, 4);
  const featuredBhajans = bhajansData.slice(0, 4);

  return (
    <div className="pb-4">
      {/* Compact Hero Section */}
      <section className="relative px-4 pt-4 pb-6">
        <div className="relative z-10 space-y-3">
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            Welcome to Your<br />
            <span className="bg-gradient-hero bg-clip-text text-transparent">Spiritual Journey</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Sacred texts, devotional music & ancient wisdom
          </p>
          <div className="flex gap-3">
            <Link to="/books" className="flex-1">
              <Button className="w-full bg-gradient-hero text-sm h-10">
                Explore Books
              </Button>
            </Link>
            <Link to="/bhajans" className="flex-1">
              <Button variant="outline" className="w-full text-sm h-10">
                <FiMusic className="mr-2 h-4 w-4" />
                Bhajans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="px-4 pb-6">
        <div className="grid grid-cols-4 gap-3">
          <Link to="/books" className="flex flex-col items-center gap-1.5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-soft">
              <FiBook className="text-lg text-primary-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">Books</span>
          </Link>
          <Link to="/bhajans" className="flex flex-col items-center gap-1.5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-soft">
              <FiMusic className="text-lg text-primary-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">Bhajans</span>
          </Link>
          <Link to="/panchang" className="flex flex-col items-center gap-1.5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-soft">
              <FiCalendar className="text-lg text-primary-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">Panchang</span>
          </Link>
          <Link to="/vidhis" className="flex flex-col items-center gap-1.5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-soft">
              <GiMeditation className="text-lg text-primary-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">Vidhis</span>
          </Link>
        </div>
      </section>

      {/* Featured Books - Horizontal Scroll */}
      <section className="pb-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-lg font-semibold text-foreground">Featured Books</h2>
          <Link to="/books" className="text-sm text-primary flex items-center gap-1">
            See all <FiArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 scrollbar-hide snap-x snap-mandatory">
          {featuredBooks.map((book) => (
            <Link 
              key={book.id} 
              to={`/books/${book.id}`}
              className="flex-shrink-0 w-32 snap-start"
            >
              <Card className="overflow-hidden bg-card border-border">
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
                      <FiBook className="text-3xl text-primary/30" />
                    </div>
                  )}
                </div>
                <CardContent className="p-2.5">
                  <h3 className="font-medium text-sm text-foreground line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                  <p className="text-sm font-semibold text-primary mt-1">₹{book.price}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Bhajans - Card List */}
      <section className="px-4 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Popular Bhajans</h2>
          <Link to="/bhajans" className="text-sm text-primary flex items-center gap-1">
            See all <FiArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="space-y-2.5">
          {featuredBhajans.map((bhajan, index) => (
            <Link key={bhajan.id} to="/bhajans">
              <Card className="bg-card border-border active:bg-muted/50 transition-colors">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-hero flex items-center justify-center flex-shrink-0">
                    <FiPlay className="text-lg text-primary-foreground ml-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-foreground truncate">
                      {bhajan.title}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {bhajan.artist} • {bhajan.duration}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {bhajan.category}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Explore More Section */}
      <section className="px-4 pb-4">
        <h2 className="text-lg font-semibold text-foreground mb-3">Explore More</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/videos">
            <Card className="bg-card border-border overflow-hidden">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <FiPlay className="text-red-500" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-foreground">Videos</h3>
                  <p className="text-xs text-muted-foreground">Watch content</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/orders">
            <Card className="bg-card border-border overflow-hidden">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FiBook className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-foreground">Orders</h3>
                  <p className="text-xs text-muted-foreground">Your orders</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
