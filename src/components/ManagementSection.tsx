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

// Lab grouping patterns
const labGroups: { name: string; patterns: RegExp[] }[] = [
  { name: "Blodstatus", patterns: [/^hb$/i, /^lpk$/i, /^tpk$/i, /^b-lpk/i, /^b-hb/i, /^b-tpk/i, /^mcv/i, /^mch/i, /leukocyt/i, /trombocyt/i, /hemoglobin/i, /erytrocyt/i, /hematokrit/i, /diff/i] },
  { name: "Elektrolyter", patterns: [/^na$/i, /^k$/i, /^ca$/i, /^mg$/i, /^fosfat/i, /natrium/i, /kalium/i, /kalcium/i, /magnesium/i, /klorid/i, /^s-na/i, /^s-k/i, /^s-ca/i, /^p-na/i, /^p-k/i] },
  { name: "Njurfunktion", patterns: [/krea/i, /urea/i, /egfr/i, /cystatin/i, /^s-krea/i] },
  { name: "Leverprover", patterns: [/^alat/i, /^asat/i, /^alp/i, /^gt$/i, /^ggt/i, /bilirubin/i, /^ld$/i, /albumin/i, /lever/i, /^s-alat/i, /^s-asat/i, /^s-alp/i, /^s-bilirubin/i] },
  { name: "Infektionsprover", patterns: [/^crp$/i, /prokalcitonin/i, /procalcitonin/i, /^pct$/i, /leukocyt/i, /^s-crp/i, /^p-crp/i, /sr$/i, /sänka/i] },
  { name: "Koagulation", patterns: [/^pk$/i, /^inr$/i, /^aptt$/i, /fibrinogen/i, /d-dimer/i, /koagul/i, /^p-pk/i, /^p-aptt/i] },
  { name: "Hjärtmarkörer", patterns: [/troponin/i, /^tnt$/i, /^tni$/i, /bnp/i, /nt-probnp/i, /ck-mb/i, /myoglobin/i] },
  { name: "Glukos/Metabolism", patterns: [/glukos/i, /hba1c/i, /laktat/i, /^p-glukos/i, /blodsocker/i] },
  { name: "Blodgas", patterns: [/blodgas/i, /artärblodgas/i, /abg/i, /venös.*gas/i, /^ph$/i, /pco2/i, /po2/i, /be$/i, /bikarbonat/i] },
  { name: "Thyroidea", patterns: [/tsh/i, /t3/i, /t4/i, /fritt.*t4/i, /thyroid/i, /sköldkörtel/i] },
];

function groupLabTests(undersokningar: string[]): { grouped: { [key: string]: string[] }; ungrouped: string[] } {
  const grouped: { [key: string]: string[] } = {};
  const ungrouped: string[] = [];
  const assigned = new Set<number>();

  undersokningar.forEach((item, index) => {
    for (const group of labGroups) {
      if (group.patterns.some(pattern => pattern.test(item))) {
        if (!grouped[group.name]) {
          grouped[group.name] = [];
        }
        grouped[group.name].push(item);
        assigned.add(index);
        return;
      }
    }
  });

  undersokningar.forEach((item, index) => {
    if (!assigned.has(index)) {
      ungrouped.push(item);
    }
  });

  return { grouped, ungrouped };
}

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
              {handlaggning.utredning.map((utredning, index) => {
                const isLab = utredning.typ.toLowerCase().includes('lab');
                const { grouped, ungrouped } = isLab 
                  ? groupLabTests(utredning.undersokningar) 
                  : { grouped: {}, ungrouped: utredning.undersokningar };
                const groupKeys = Object.keys(grouped);
                
                return (
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
                    
                    {isLab && groupKeys.length > 0 ? (
                      <ul className="space-y-1.5">
                        {groupKeys.map((groupName) => (
                          <li key={groupName} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span>
                              <span className="font-medium text-foreground">{groupName}</span>
                              <span className="text-muted-foreground/70"> ({grouped[groupName].join(', ')})</span>
                            </span>
                          </li>
                        ))}
                        {ungrouped.map((item, i) => (
                          <li key={`ungrouped-${i}`} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="space-y-1.5">
                        {utredning.undersokningar.map((undersokning, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            {undersokning}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
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
