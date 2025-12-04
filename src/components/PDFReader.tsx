import { useState, useCallback, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiZoomIn, 
  FiZoomOut, 
  FiMaximize, 
  FiMinimize,
  FiDownload,
  FiMoon,
  FiSun,
  FiSearch,
  FiX,
  FiGrid,
  FiList,
  FiRotateCw
} from "react-icons/fi";
import { useLanguage } from "@/contexts/LanguageContext";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFReaderProps {
  pdfUrl: string;
  bookTitle?: string;
}

export const PDFReader = ({ pdfUrl, bookTitle = "Document" }: PDFReaderProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [pageInputValue, setPageInputValue] = useState("1");
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setLoadError(null);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    setIsLoading(false);
    setLoadError(error.message || "Failed to load PDF");
  }, []);

  const goToPrevPage = useCallback(() => {
    setPageNumber((prev) => {
      const newPage = Math.max(1, prev - 1);
      setPageInputValue(String(newPage));
      return newPage;
    });
  }, []);

  const goToNextPage = useCallback(() => {
    setPageNumber((prev) => {
      const newPage = Math.min(numPages, prev + 1);
      setPageInputValue(String(newPage));
      return newPage;
    });
  }, [numPages]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= numPages) {
      setPageNumber(page);
      setPageInputValue(String(page));
    }
  }, [numPages]);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInputValue(e.target.value);
  };

  const handlePageInputBlur = () => {
    const page = parseInt(pageInputValue);
    if (!isNaN(page) && page >= 1 && page <= numPages) {
      goToPage(page);
    } else {
      setPageInputValue(String(pageNumber));
    }
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handlePageInputBlur();
    }
  };

  const zoomIn = () => setScale((prev) => Math.min(3.0, prev + 0.25));
  const zoomOut = () => setScale((prev) => Math.max(0.25, prev - 0.25));
  const fitToWidth = () => setScale(1.0);
  const fitToScreen = () => setScale(0.75);

  const toggleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleThumbnails = () => setShowThumbnails(!showThumbnails);
  const toggleSearch = () => setShowSearch(!showSearch);
  const rotateDocument = () => setRotation((prev) => (prev + 90) % 360);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${bookTitle}.pdf`;
    link.click();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevPage();
      if (e.key === "ArrowRight") goToNextPage();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "f" && e.ctrlKey) {
        e.preventDefault();
        toggleSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevPage, goToNextPage]);

  return (
    <div 
      ref={containerRef}
      className={`${isFullscreen ? "fixed inset-0 z-50 bg-background" : ""} flex flex-col h-full`}
    >
      <Card className={`overflow-hidden flex flex-col h-full ${darkMode ? "bg-gray-900" : "bg-card"}`}>
        {/* Top Toolbar */}
        <div className="bg-muted/50 p-2 sm:p-3 flex flex-wrap items-center justify-between gap-2 border-b border-border">
          {/* Page Navigation */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="h-8 w-8"
            >
              <FiChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1 text-sm">
              <Input
                type="text"
                value={pageInputValue}
                onChange={handlePageInputChange}
                onBlur={handlePageInputBlur}
                onKeyDown={handlePageInputKeyDown}
                className="w-12 h-8 text-center text-sm p-1"
              />
              <span className="text-muted-foreground whitespace-nowrap">/ {numPages}</span>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="h-8 w-8"
            >
              <FiChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={zoomOut} disabled={scale <= 0.25} className="h-8 w-8">
              <FiZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs font-medium text-foreground min-w-[50px] text-center hidden sm:block">
              {Math.round(scale * 100)}%
            </span>
            <Button variant="outline" size="icon" onClick={zoomIn} disabled={scale >= 3.0} className="h-8 w-8">
              <FiZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleThumbnails}
              className={`h-8 w-8 ${showThumbnails ? "bg-primary/20" : ""}`}
              title="Toggle Thumbnails"
            >
              <FiGrid className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleSearch}
              className={`h-8 w-8 hidden sm:flex ${showSearch ? "bg-primary/20" : ""}`}
              title="Search (Ctrl+F)"
            >
              <FiSearch className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={rotateDocument}
              className="h-8 w-8"
              title="Rotate"
            >
              <FiRotateCw className="h-4 w-4" />
            </Button>

            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleDarkMode}
              className="h-8 w-8"
              title={darkMode ? "Light Mode" : "Dark Mode"}
            >
              {darkMode ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
            </Button>

            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleDownload}
              className="h-8 w-8"
              title="Download PDF"
            >
              <FiDownload className="h-4 w-4" />
            </Button>

            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleFullscreen}
              className="h-8 w-8"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <FiMinimize className="h-4 w-4" /> : <FiMaximize className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="bg-muted/30 p-2 border-b border-border flex items-center gap-2">
            <FiSearch className="h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search in document..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1 h-8 text-sm"
            />
            <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)} className="h-8 w-8">
              <FiX className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Thumbnails Sidebar */}
          {showThumbnails && (
            <div className="w-24 sm:w-32 border-r border-border bg-muted/20 flex-shrink-0">
              <ScrollArea className="h-full">
                <div className="p-2 space-y-2">
                  {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-full aspect-[3/4] rounded border-2 transition-all overflow-hidden ${
                        page === pageNumber 
                          ? "border-primary ring-2 ring-primary/30" 
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Document file={pdfUrl} loading={null}>
                        <Page 
                          pageNumber={page} 
                          width={80} 
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      </Document>
                      <div className="text-[10px] text-center py-1 bg-muted/50">
                        {page}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* PDF Viewer */}
          <div 
            className={`flex-1 overflow-auto flex justify-center p-2 sm:p-4 ${
              darkMode ? "bg-gray-800" : "bg-muted/20"
            }`}
            style={{ maxHeight: isFullscreen ? "calc(100vh - 120px)" : "600px" }}
          >
            {isLoading && (
              <div className="flex flex-col items-center justify-center p-8 gap-3">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground text-sm">{t.common.loading}</p>
              </div>
            )}

            {loadError && (
              <div className="flex flex-col items-center justify-center p-8 gap-3 text-center">
                <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                  <FiX className="h-8 w-8 text-destructive" />
                </div>
                <p className="text-destructive font-medium">Failed to load PDF</p>
                <p className="text-muted-foreground text-sm max-w-md">{loadError}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            )}

            {!loadError && (
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={null}
                className={darkMode ? "pdf-dark-mode" : ""}
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  rotate={rotation}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className={`shadow-lg ${darkMode ? "pdf-page-dark invert" : ""}`}
                  loading={
                    <div className="flex items-center justify-center p-8">
                      <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  }
                />
              </Document>
            )}
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="bg-muted/50 px-3 py-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate max-w-[200px]">{bookTitle}</span>
          <div className="flex items-center gap-4">
            <span>Page {pageNumber} of {numPages}</span>
            <span>{Math.round(scale * 100)}%</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PDFReader;
