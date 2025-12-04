import { AlertTriangle, Beaker, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Diagnosis {
  diagnos: string;
  sannolikhet: "hög" | "medel" | "låg";
  beskrivning: string;
  varningsflaggor?: string[];
  utredning?: string[];
}

interface DiagnosisCardProps {
  diagnosis: Diagnosis;
  index: number;
}

const probabilityColors = {
  hög: "bg-destructive/10 text-destructive border-destructive/20",
  medel: "bg-warning/10 text-warning border-warning/20",
  låg: "bg-muted text-muted-foreground border-muted",
};

const probabilityLabels = {
  hög: "Hög sannolikhet",
  medel: "Medel sannolikhet",
  låg: "Låg sannolikhet",
};

export function DiagnosisCard({ diagnosis, index }: DiagnosisCardProps) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <Card 
      className="animate-slide-up border-border/50 shadow-sm hover:shadow-md transition-shadow"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader 
        className="cursor-pointer pb-2"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-display font-semibold">
                {index + 1}
              </span>
              <CardTitle className="text-lg font-display">{diagnosis.diagnos}</CardTitle>
            </div>
            <Badge 
              variant="outline" 
              className={`${probabilityColors[diagnosis.sannolikhet]} font-medium`}
            >
              {probabilityLabels[diagnosis.sannolikhet]}
            </Badge>
          </div>
          <button className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground">
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className="pt-0 space-y-4 animate-fade-in">
          <p className="text-muted-foreground leading-relaxed">
            {diagnosis.beskrivning}
          </p>

          {diagnosis.varningsflaggor && diagnosis.varningsflaggor.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-destructive">
                <AlertTriangle size={16} />
                Varningsflaggor
              </h4>
              <ul className="space-y-1">
                {diagnosis.varningsflaggor.map((flag, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {diagnosis.utredning && diagnosis.utredning.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
                <Beaker size={16} />
                Förslag på utredning
              </h4>
              <ul className="space-y-1">
                {diagnosis.utredning.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
