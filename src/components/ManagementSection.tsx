import { Beaker, Pill, ArrowRight, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface ManagementSectionProps {
  handlaggning: Handlaggning;
}

const prioritetConfig = {
  akut: {
    badge: "bg-destructive/10 text-destructive border-destructive/30",
    label: "Akut",
  },
  skyndsam: {
    badge: "bg-warning/10 text-warning border-warning/30",
    label: "Skyndsam",
  },
  elektiv: {
    badge: "bg-muted text-muted-foreground border-border",
    label: "Elektiv",
  },
};

export function ManagementSection({ handlaggning }: ManagementSectionProps) {
  return (
    <div className="space-y-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-accent/10">
          <ArrowRight className="w-5 h-5 text-accent" />
        </div>
        <h3 className="font-display font-bold text-xl text-foreground">
          Handläggning
        </h3>
      </div>

      {/* Utredning */}
      {handlaggning.utredning && handlaggning.utredning.length > 0 && (
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Beaker className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-display font-semibold text-lg text-foreground">Utredning</h4>
          </div>
          
          <div className="space-y-4">
            {handlaggning.utredning.map((utredning, index) => (
              <div key={index} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-semibold text-foreground">{utredning.typ}</span>
                  <Badge 
                    variant="outline" 
                    className={prioritetConfig[utredning.prioritet]?.badge || prioritetConfig.elektiv.badge}
                  >
                    {prioritetConfig[utredning.prioritet]?.label || utredning.prioritet}
                  </Badge>
                </div>
                <ul className="space-y-1.5">
                  {utredning.undersokningar.map((undersokning, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      {undersokning}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empirisk behandling */}
      {handlaggning.empirisk_behandling && handlaggning.empirisk_behandling.length > 0 && (
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/10">
              <Pill className="w-5 h-5 text-accent" />
            </div>
            <h4 className="font-display font-semibold text-lg text-foreground">Empirisk behandling</h4>
          </div>
          
          <div className="space-y-3">
            {handlaggning.empirisk_behandling.map((behandling, index) => (
              <div key={index} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-sm font-medium text-primary mb-2">{behandling.indikation}</p>
                <p className="text-foreground mb-2">{behandling.behandling}</p>
                {behandling.viktigt && (
                  <div className="flex items-start gap-2 mt-3 p-2 rounded-lg bg-warning/10 border border-warning/20">
                    <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-warning">{behandling.viktigt}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disposition */}
      {handlaggning.disposition && (
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-primary/10 flex-shrink-0">
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground mb-2">Disposition</h4>
              <p className="text-muted-foreground">{handlaggning.disposition}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
