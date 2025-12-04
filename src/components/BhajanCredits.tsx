import { FiUser, FiMusic, FiDisc, FiEdit3, FiCalendar, FiLink, FiCopy } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  title?: string;
  compact?: boolean;
  className?: string;
}

const CreditRow = ({ 
  icon: Icon, 
  label, 
  value, 
  compact 
}: { 
  icon: React.ComponentType<{ className?: string }>; 
  label: string; 
  value: string | string[] | undefined;
  compact?: boolean;
}) => {
  const displayValue = Array.isArray(value) 
    ? value.join(", ") 
    : value || "Unknown";

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3 w-3 flex-shrink-0" />
        <span className="truncate">{displayValue}</span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 flex-shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{displayValue}</p>
      </div>
    </div>
  );
};

export const BhajanCredits = ({ credits, title, compact = false, className = "" }: BhajanCreditsProps) => {
  if (!credits) {
    return null;
  }

  if (compact) {
    return (
      <div className={`space-y-1 ${className}`}>
        <CreditRow icon={FiUser} label="Singer" value={credits.singers} compact />
        <CreditRow icon={FiDisc} label="Label" value={credits.label} compact />
        {credits.copyright && (
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/70 mt-2">
            <FiCopy className="h-2.5 w-2.5" />
            <span>© {credits.copyright} {credits.year !== "Unknown" && credits.year !== "Ancient" ? `(${credits.year})` : ""}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={`bg-gradient-card ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <FiMusic className="h-5 w-5 text-primary" />
          {title || "Credits"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <CreditRow icon={FiUser} label="Singer(s)" value={credits.singers} />
        <CreditRow icon={FiDisc} label="Music Label / Studio" value={credits.label} />
        <CreditRow icon={FiUser} label="Producer" value={credits.producer} />
        <CreditRow icon={FiEdit3} label="Lyricist" value={credits.lyricist} />
        <CreditRow icon={FiMusic} label="Composer" value={credits.composer} />
        <CreditRow icon={FiCalendar} label="Year" value={credits.year} />
        <CreditRow icon={FiLink} label="Source" value={credits.source} />
        
        {/* Copyright Section */}
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FiCopy className="h-3.5 w-3.5" />
            <span>© {credits.copyright || "Unknown"}</span>
            {credits.year && credits.year !== "Unknown" && credits.year !== "Ancient" && (
              <span>({credits.year})</span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground/70 mt-1">
            All rights belong to their respective owners. For educational and devotional purposes only.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BhajanCredits;
