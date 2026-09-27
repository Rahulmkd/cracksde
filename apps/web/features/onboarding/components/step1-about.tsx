import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Step1AboutProps {
  role: string;
  onSelectRole: (role: string) => void;
  experience: string;
  onSelectExperience: (exp: string) => void;
  targetCompany: string;
  onSelectCompany: (company: string) => void;
  region: string;
  onSelectRegion: (region: string) => void;
  onNext: () => void;
}

export function Step1About({
  role,
  onSelectRole,
  experience,
  onSelectExperience,
  targetCompany,
  onSelectCompany,
  region,
  onSelectRegion,
  onNext,
}: Step1AboutProps) {
  const roles = ["SDE Intern", "Software Engineer", "Senior SDE", "Engineering Lead"];
  const experiences = ["0 - 2 years", "2 - 5 years", "5+ years"];
  const companies = ["Startups", "FAANG / Big Tech", "Product Based Companies", "Open to all"];
  const regions = ["India", "US / Europe / Remote"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Tell us about your background</h2>
        <p className="text-xs text-muted-foreground mt-1">
          This helps us calibrate the depth and problem difficulty of your study plan.
        </p>
      </div>

      {/* Target Role */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground">Target Role</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {roles.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onSelectRole(r)}
              className={cn(
                "p-3 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer",
                role === r
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-card/50 hover:bg-card border-border/60 text-muted-foreground hover:text-foreground"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground">Experience Level</label>
        <div className="grid grid-cols-3 gap-2.5">
          {experiences.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => onSelectExperience(e)}
              className={cn(
                "p-3 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer",
                experience === e
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-card/50 hover:bg-card border-border/60 text-muted-foreground hover:text-foreground"
              )}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Target Companies */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground">Target Companies</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {companies.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onSelectCompany(c)}
              className={cn(
                "p-3 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer",
                targetCompany === c
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-card/50 hover:bg-card border-border/60 text-muted-foreground hover:text-foreground"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Region */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground">Hiring Region</label>
        <div className="grid grid-cols-2 gap-2.5">
          {regions.map((reg) => (
            <button
              key={reg}
              type="button"
              onClick={() => onSelectRegion(reg)}
              className={cn(
                "p-3 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer",
                region === reg
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-card/50 hover:bg-card border-border/60 text-muted-foreground hover:text-foreground"
              )}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button onClick={onNext} className="gap-2 text-xs">
          Continue to Subjects →
        </Button>
      </div>
    </div>
  );
}
