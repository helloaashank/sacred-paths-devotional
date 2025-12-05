import { FiUser, FiEdit3, FiCopy } from "react-icons/fi";

interface Credits {
  singers?: string[];
  label?: string;
  producer?: string;
  lyricist?: string;
  composer?: string;
  copyright?: string;
  year?: string;
  source?: string;
}

interface BhajanCreditsProps {
  credits?: Credits;
  compact?: boolean;
  className?: string;
}

export const BhajanCredits = ({ credits, compact = false, className = "" }: BhajanCreditsProps) => {
  if (!credits) {
    return null;
  }

  const singers = Array.isArray(credits.singers) ? credits.singers.join(", ") : credits.singers || "Unknown";

  if (compact) {
    return (
      <div className={`space-y-0.5 ${className}`}>
        <p className="text-xs text-muted-foreground truncate">
          <span className="font-medium">Singer:</span> {singers}
        </p>
        {credits.copyright && (
          <p className="text-[10px] text-muted-foreground/70">
            © {credits.copyright}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-muted/50 rounded-lg p-3 sm:p-4 space-y-3 ${className}`}>
      {/* Singer */}
      <div className="flex items-start gap-2">
        <FiUser className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">Singer(s)</p>
          <p className="text-sm font-medium text-foreground">{singers}</p>
        </div>
      </div>

      {/* Producer */}
      {credits.producer && credits.producer !== "Unknown" && (
        <div className="flex items-start gap-2">
          <FiUser className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Producer</p>
            <p className="text-sm font-medium text-foreground">{credits.producer}</p>
          </div>
        </div>
      )}

      {/* Lyricist */}
      {credits.lyricist && credits.lyricist !== "Unknown" && (
        <div className="flex items-start gap-2">
          <FiEdit3 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Lyricist</p>
            <p className="text-sm font-medium text-foreground">{credits.lyricist}</p>
          </div>
        </div>
      )}

      {/* Copyright */}
      {credits.copyright && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2 border-t border-border/50">
          <FiCopy className="h-3 w-3" />
          <span>© {credits.copyright}</span>
        </div>
      )}
    </div>
  );
};

export default BhajanCredits;
