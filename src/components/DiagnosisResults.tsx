import { AlertCircle, FileText, ListChecks, ShieldAlert, Stethoscope, Pill, BookOpen, ArrowRight, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DiagnosisCard } from "./DiagnosisCard";
import { ManagementSection } from "./ManagementSection";

// Map common Swedish medical sources to their URLs
const sourceUrlMap: Record<string, string> = {
  "internetmedicin": "https://www.internetmedicin.se",
  "fass": "https://www.fass.se",
  "läkartidningen": "https://lakartidningen.se",
  "socialstyrelsen": "https://www.socialstyrelsen.se",
  "1177": "https://www.1177.se",
  "1177 vårdguiden": "https://www.1177.se",
  "vårdguiden": "https://www.1177.se",
  "janusinfo": "https://janusinfo.se",
  "läkemedelsverket": "https://www.lakemedelsverket.se",
  "folkhälsomyndigheten": "https://www.folkhalsomyndigheten.se",
  "rikshandboken": "https://www.rikshandboken-bhv.se",
  "viss": "https://viss.nu",
  "terapi­rekommendationer": "https://janusinfo.se/behandling",
  "strama": "https://strama.se",
  "medibas": "https://medibas.se",
  "praktiskmedicin": "https://www.praktiskmedicin.se",
  "praktisk medicin": "https://www.praktiskmedicin.se",
};

function getSourceUrl(source: string): string | null {
  // Check if it's already a URL
  if (source.startsWith("http://") || source.startsWith("https://")) {
    return source;
  }
  
  // Try to match against known sources (case-insensitive)
  const normalized = source.toLowerCase().trim();
  
  for (const [key, url] of Object.entries(sourceUrlMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return url;
    }
  }
  
  return null;
}

interface Diagnosis {
  diagnos: string;
  sannolikhet: "hög" | "medel" | "låg";
  kritisk?: boolean;
  kort_motivering?: string;
  // Legacy fields for backwards compatibility
  beskrivning?: string;
  varningsflaggor?: string[];
  utredning?: string[];
}

interface Utredning {
  typ: string;
  undersokningar: string[];
  prioritet: "akut" | "skyndsam" | "elektiv";
}

interface Behandling {
  indikation: string;
  behandling: string;
  viktigt?: string;
}

interface Handlaggning {
  utredning?: Utredning[];
  empirisk_behandling?: Behandling[];
  disposition?: string;
}

interface DiagnosisResult {
  diagnoser?: Diagnosis[];
  akut_varning?: string | null;
  sammanfattning?: string;
  handlaggning?: Handlaggning;
  kallor?: string[];
  raw?: string;
}

interface DiagnosisResultsProps {
  results: DiagnosisResult;
}

export function DiagnosisResults({ results }: DiagnosisResultsProps) {
  if (results.raw) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <p className="text-muted-foreground whitespace-pre-wrap">{results.raw}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Akut varning först */}
      {results.akut_varning && (
        <Alert variant="destructive" className="border-destructive/30 bg-destructive/5 rounded-2xl animate-scale-in">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle className="font-display font-bold text-lg">Akut varning</AlertTitle>
          <AlertDescription className="mt-2 text-destructive/90">
            {results.akut_varning}
          </AlertDescription>
        </Alert>
      )}

      {/* Differentialdiagnoser */}
      {results.diagnoser && results.diagnoser.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: '50ms' }}>
            <div className="p-2 rounded-xl bg-primary/10">
              <ListChecks className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground">
              Differentialdiagnoser
            </h3>
            <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              {results.diagnoser.length}
            </span>
          </div>
          <div className="space-y-3">
            {results.diagnoser.map((diagnosis, index) => (
              <DiagnosisCard key={index} diagnosis={diagnosis} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Handläggning */}
      {results.handlaggning && (
        <ManagementSection handlaggning={results.handlaggning} />
      )}

      {/* Källor */}
      {results.kallor && results.kallor.length > 0 && (
        <div className="glass-card rounded-2xl p-5 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-accent/10 flex-shrink-0">
              <BookOpen className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-foreground mb-3">Medicinska källor</h3>
              <div className="flex flex-wrap gap-2">
                {results.kallor.map((kalla, index) => {
                  const url = getSourceUrl(kalla);
                  if (url) {
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
                        className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-sm hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        {kalla}
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    );
                  }
                  return (
                    <span 
                      key={index}
                      className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-sm"
                    >
                      {kalla}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legacy sammanfattning för bakåtkompatibilitet */}
      {results.sammanfattning && !results.handlaggning && (
        <div className="glass-card rounded-2xl p-5 animate-slide-up" style={{ animationDelay: '50ms' }}>
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-accent/10 flex-shrink-0">
              <FileText className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground mb-2">Sammanfattning</h3>
              <p className="text-muted-foreground leading-relaxed">{results.sammanfattning}</p>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center pt-6 border-t border-border/30 animate-fade-in">
        Denna information är endast för utbildnings- och referenssyfte och ersätter inte klinisk bedömning.
      </p>
    </div>
  );
}
