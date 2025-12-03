import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FiArrowRight, FiBook, FiMusic, FiCalendar } from "react-icons/fi";
import { GiMeditation } from "react-icons/gi";
import booksData from "@/data/books.json";
import bhajansData from "@/data/bhajans.json";

const Home = () => {
  const featuredBooks = booksData.filter((book) => book.featured).slice(0, 3);
  const featuredBhajans = bhajansData.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground animate-fade-in leading-tight">
              Welcome to Your Spiritual Journey
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground animate-fade-in px-4">
              Discover sacred texts, devotional music, and ancient wisdom to enrich your spiritual path.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in px-4">
              <Link to="/books" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-hero shadow-soft hover:shadow-elevated transition-all text-sm sm:text-base">
                  Explore Books
                  <FiArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/bhajans" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto shadow-soft hover:shadow-elevated transition-all text-sm sm:text-base">
                  Listen to Bhajans
                  <FiMusic className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-12 sm:py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
                <FiBook className="text-primary h-6 w-6 sm:h-7 sm:w-7" />
                Featured Books
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">Sacred texts and spiritual wisdom</p>
            </div>
            <Link to="/books">
              <Button variant="ghost" className="group text-sm sm:text-base">
                View All
                <FiArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredBooks.map((book) => (
              <Card key={book.id} className="group hover:shadow-elevated transition-all duration-300 overflow-hidden bg-gradient-card">
                <div className="aspect-[4/3] sm:aspect-[3/4] relative overflow-hidden bg-muted">
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
                    <FiBook className="text-4xl sm:text-6xl text-primary/30" />
                  </div>
                </div>
                <CardContent className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                  <h3 className="font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{book.author}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{book.description}</p>
                  <div className="flex items-center justify-between pt-2 sm:pt-4">
                    <span className="text-base sm:text-lg font-bold text-primary">₹{book.price}</span>
                    <Link to={`/books/${book.id}`}>
                      <Button size="sm" variant="outline" className="text-xs sm:text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Bhajans */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
                <FiMusic className="text-primary h-6 w-6 sm:h-7 sm:w-7" />
                Popular Bhajans
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">Devotional music for your soul</p>
            </div>
            <Link to="/bhajans">
              <Button variant="ghost" className="group text-sm sm:text-base">
                View All
                <FiArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredBhajans.map((bhajan) => (
              <Card key={bhajan.id} className="group hover:shadow-elevated transition-all duration-300 bg-gradient-card">
                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-hero flex items-center justify-center shadow-soft flex-shrink-0">
                      <FiMusic className="text-xl sm:text-2xl text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors truncate">
                        {bhajan.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{bhajan.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                    <span>{bhajan.category}</span>
                    <span>{bhajan.duration}</span>
                  </div>
                  <Link to="/bhajans" className="block">
                    <Button size="sm" className="w-full bg-gradient-hero shadow-soft text-xs sm:text-sm" variant="default">
                      Listen Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 sm:py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-8 sm:mb-12">Explore More</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <Link to="/panchang" className="block">
              <Card className="group hover:shadow-elevated transition-all duration-300 cursor-pointer bg-gradient-card h-full">
                <CardContent className="p-5 sm:p-8 text-center space-y-3 sm:space-y-4">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 mx-auto rounded-full bg-gradient-hero flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                    <FiCalendar className="text-xl sm:text-2xl text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors">
                    Panchang
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Daily auspicious timings and festivals
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/vidhis" className="block">
              <Card className="group hover:shadow-elevated transition-all duration-300 cursor-pointer bg-gradient-card h-full">
                <CardContent className="p-5 sm:p-8 text-center space-y-3 sm:space-y-4">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 mx-auto rounded-full bg-gradient-hero flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                    <GiMeditation className="text-xl sm:text-2xl text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors">
                    Pooja Vidhis
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Step-by-step worship procedures
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/books" className="block">
              <Card className="group hover:shadow-elevated transition-all duration-300 cursor-pointer bg-gradient-card h-full">
                <CardContent className="p-5 sm:p-8 text-center space-y-3 sm:space-y-4">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 mx-auto rounded-full bg-gradient-hero flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                    <FiBook className="text-xl sm:text-2xl text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors">
                    Sacred Texts
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Ancient wisdom and scriptures
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;