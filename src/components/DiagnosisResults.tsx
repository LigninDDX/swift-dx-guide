import { AlertCircle, FileText } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DiagnosisCard } from "./DiagnosisCard";

interface DiagnosisResult {
  diagnoser?: Array<{
    diagnos: string;
    sannolikhet: "hög" | "medel" | "låg";
    beskrivning: string;
    varningsflaggor?: string[];
    utredning?: string[];
  }>;
  akut_varning?: string | null;
  sammanfattning?: string;
  raw?: string;
}

interface DiagnosisResultsProps {
  results: DiagnosisResult;
}

export function DiagnosisResults({ results }: DiagnosisResultsProps) {
  if (results.raw) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground whitespace-pre-wrap">{results.raw}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {results.akut_varning && (
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-display font-semibold">Akut varning</AlertTitle>
          <AlertDescription className="mt-2">
            {results.akut_varning}
          </AlertDescription>
        </Alert>
      )}

      {results.sammanfattning && (
        <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-foreground leading-relaxed">{results.sammanfattning}</p>
          </div>
        </div>
      )}

      {results.diagnoser && results.diagnoser.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-display font-semibold text-lg text-foreground">
            Differentialdiagnoser ({results.diagnoser.length})
          </h3>
          <div className="space-y-3">
            {results.diagnoser.map((diagnosis, index) => (
              <DiagnosisCard key={index} diagnosis={diagnosis} index={index} />
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center pt-4 border-t border-border/50">
        Denna information är endast för utbildnings- och referenssyfte och ersätter inte klinisk bedömning.
      </p>
    </div>
  );
}
