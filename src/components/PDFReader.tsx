import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FiChevronLeft, FiChevronRight, FiZoomIn, FiZoomOut, FiMaximize, FiMinimize } from "react-icons/fi";
import { useLanguage } from "@/contexts/LanguageContext";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFReaderProps {
  pdfUrl: string;
  darkMode?: boolean;
}

export const PDFReader = ({ pdfUrl, darkMode = false }: PDFReaderProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { t } = useLanguage();

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(numPages, prev + 1));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(2.0, prev + 0.2));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(0.5, prev - 0.2));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-50 bg-background p-4" : ""}`}>
      <Card className={`overflow-hidden ${darkMode ? "bg-gray-900" : "bg-card"}`}>
        {/* Controls */}
        <div className="bg-muted/50 p-4 flex items-center justify-between gap-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
            >
              <FiChevronLeft />
            </Button>
            <span className="text-sm font-medium text-foreground min-w-[100px] text-center">
              {pageNumber} / {numPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
            >
              <FiChevronRight />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={zoomOut} disabled={scale <= 0.5}>
              <FiZoomOut />
            </Button>
            <span className="text-sm font-medium text-foreground min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button variant="outline" size="icon" onClick={zoomIn} disabled={scale >= 2.0}>
              <FiZoomIn />
            </Button>
          </div>

          <Button variant="outline" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <FiMinimize /> : <FiMaximize />}
          </Button>
        </div>

        {/* PDF Viewer */}
        <div className="overflow-auto max-h-[600px] flex justify-center p-4 bg-muted/20">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center p-8">
                <p className="text-muted-foreground">{t.common.loading}</p>
              </div>
            }
            error={
              <div className="flex items-center justify-center p-8">
                <p className="text-destructive">{t.common.error}</p>
              </div>
            }
            className={darkMode ? "pdf-dark-mode" : ""}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className={darkMode ? "pdf-page-dark" : ""}
            />
          </Document>
        </div>

        {/* Page Navigation */}
        <div className="bg-muted/50 p-3 border-t border-border">
          <div className="flex items-center justify-center gap-2">
            <label htmlFor="page-input" className="text-sm text-muted-foreground">
              Go to page:
            </label>
            <input
              id="page-input"
              type="number"
              min={1}
              max={numPages}
              value={pageNumber}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= numPages) {
                  setPageNumber(page);
                }
              }}
              className="w-20 px-2 py-1 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
