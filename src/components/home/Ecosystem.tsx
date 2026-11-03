import { SectionHeading } from "@/components/ui/SectionHeading";
import { sectors, totalCompanies } from "@/content/portfolio";
import { SectorExplorer } from "./SectorExplorer";

export function Ecosystem() {
  return (
    <section aria-labelledby="ecosystem-title" className="cv-auto relative py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line to-transparent"
      />
      <div className="container-x">
        <SectionHeading
          id="ecosystem-title"
          index="02"
          eyebrow="Sector explorer"
          align="split"
          title={
            <>
              {sectors.length} sectors. <span className="text-accent-gradient">{totalCompanies} businesses.</span>
            </>
          }
          lead="Choose a sector to see what it covers and every company within it. Group entities link to their profile; every other company links straight to its own website."
        />
        <div className="mt-12 lg:mt-16">
          <SectorExplorer />
        </div>
      </div>
    </section>
  );
}
