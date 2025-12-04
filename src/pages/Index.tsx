import { useState } from "react";
import { Send, Stethoscope, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DiagnosisResults } from "@/components/DiagnosisResults";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [symptoms, setSymptoms] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!symptoms.trim()) {
      toast.error("Ange symtom för att få förslag på differentialdiagnoser");
      return;
    }

    setIsLoading(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke("diagnose", {
        body: { symptoms: symptoms.trim() },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data);
    } catch (error: any) {
      console.error("Diagnosis error:", error);
      toast.error(error.message || "Något gick fel. Försök igen.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8 px-4 sm:py-12">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Stethoscope className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-3">
            Akut Differentialdiagnostik
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Beskriv patientens symtom och anamnes för att få AI-baserade förslag på differentialdiagnoser
          </p>
        </header>

        {/* Disclaimer */}
        <Alert className="mb-8 border-warning/30 bg-warning/5">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-sm text-muted-foreground">
            <strong className="text-foreground">Viktigt:</strong> Detta verktyg är endast för utbildnings- och referenssyfte. 
            Det ersätter inte klinisk bedömning eller läkarkonsultation.
          </AlertDescription>
        </Alert>

        {/* Input Form */}
        <Card className="mb-8 border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="font-display text-xl">Symtom & Anamnes</CardTitle>
            <CardDescription>
              Beskriv aktuella symtom, duration, svårighetsgrad, och relevant sjukdomshistoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Exempel: 65-årig man med plötslig bröstsmärta sedan 2 timmar, utstrålning till vänster arm, illamående, kallsvettig. Tidigare hypertoni och diabetes typ 2. Röker 20 cigaretter/dag."
                className="min-h-[150px] resize-y text-base leading-relaxed"
                disabled={isLoading}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading || !symptoms.trim()}
                  size="lg"
                  className="gap-2 font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyserar...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Analysera symtom
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="font-display text-xl">Resultat</CardTitle>
            </CardHeader>
            <CardContent>
              <DiagnosisResults results={results} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
