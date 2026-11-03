import { SectionHeading } from "@/components/ui/SectionHeading";
import { Timeline } from "./Timeline";

export function Story() {
  return (
    <section aria-labelledby="story-title" className="cv-auto relative py-24 sm:py-32 lg:py-40">
      <div className="container-x">
        <SectionHeading
          id="story-title"
          index="04"
          eyebrow="Since 1991"
          align="center"
          title={
            <>
              Decades of <span className="text-accent-gradient">transformation.</span>
            </>
          }
          lead="American Elite has gone through a long series of transformations, enhancements and expansions. These are the milestones documented in its own history."
        />
        <div className="mx-auto mt-16 max-w-5xl lg:mt-24">
          <Timeline />
        </div>
      </div>
    </section>
  );
}
