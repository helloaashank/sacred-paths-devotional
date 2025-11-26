import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { GiMeditation } from "react-icons/gi";
import { FiChevronDown, FiClock, FiCheckCircle } from "react-icons/fi";
import vidhisData from "@/data/vidhis.json";

const Vidhis = () => {
  const [openSteps, setOpenSteps] = useState<Record<string, boolean>>({});

  const toggleSteps = (id: string) => {
    setOpenSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <GiMeditation className="text-primary text-5xl" />
            Pooja Vidhis
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Step-by-step worship procedures for various deities and occasions
          </p>
        </div>

        {/* Vidhis List */}
        <div className="space-y-6">
          {vidhisData.map((vidhi) => (
            <Card key={vidhi.id} className="shadow-soft hover:shadow-elevated transition-all bg-gradient-card">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{vidhi.title}</CardTitle>
                    <p className="text-muted-foreground mb-4">{vidhi.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {vidhi.deity}
                      </span>
                      <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <FiClock className="text-xs" />
                        {vidhi.duration}
                      </span>
                      <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
                        {vidhi.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Materials */}
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-3 flex items-center gap-2">
                    <FiCheckCircle className="text-primary" />
                    Required Materials
                  </h3>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {vidhi.materials.map((material, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{material}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Steps */}
                <div>
                  <Collapsible open={openSteps[vidhi.id]} onOpenChange={() => toggleSteps(vidhi.id)}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <span className="font-semibold">View Step-by-Step Procedure</span>
                        <FiChevronDown
                          className={`transition-transform duration-300 ${
                            openSteps[vidhi.id] ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-4 animate-accordion-down">
                      {vidhi.steps.map((step, index) => (
                        <div key={index} className="bg-card p-4 rounded-lg border border-border shadow-soft">
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-hero flex items-center justify-center shadow-soft">
                              <span className="text-sm font-bold text-primary-foreground">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground mb-2">{step.title}</h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Vidhis;