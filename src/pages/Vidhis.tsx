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
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl sm:text-2xl mb-2">{vidhi.title}</CardTitle>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4">{vidhi.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-primary/10 text-primary px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                        {vidhi.deity}
                      </span>
                      <span className="bg-muted text-muted-foreground px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1 whitespace-nowrap">
                        <FiClock className="text-xs" />
                        {vidhi.duration}
                      </span>
                      <span className="bg-muted text-muted-foreground px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap">
                        {vidhi.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Materials */}
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-foreground mb-3 flex items-center gap-2">
                    <FiCheckCircle className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
                    Required Materials
                  </h3>
                  <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {vidhi.materials.map((material, index) => (
                        <li key={index} className="text-xs sm:text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5 sm:mt-1">•</span>
                          <span className="break-words">{material}</span>
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
                    <CollapsibleContent className="mt-4 space-y-3 sm:space-y-4 animate-accordion-down">
                      {vidhi.steps.map((step, index) => (
                        <div key={index} className="bg-card p-3 sm:p-4 rounded-lg border border-border shadow-soft">
                          <div className="flex gap-2 sm:gap-3">
                            <div className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-hero flex items-center justify-center shadow-soft">
                              <span className="text-xs sm:text-sm font-bold text-primary-foreground">{index + 1}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm sm:text-base text-foreground mb-1 sm:mb-2">{step.title}</h4>
                              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words">
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