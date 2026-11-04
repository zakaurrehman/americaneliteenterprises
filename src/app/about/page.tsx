import Image from "next/image";
import Link from "next/link";
import { Timeline } from "@/components/home/Timeline";
import { ContactCta } from "@/components/sections/ContactCta";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowRight } from "@/components/ui/icons";
import { entities } from "@/content/entities";
import { getSector, sectors } from "@/content/portfolio";
import { founder } from "@/content/story";
import { addressLine, site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import crest from "../../../public/brand/american-elite-crest.png";

export const metadata = pageMetadata({
  title: "About American Elite — A Private Group of Businesses Since 1991",
  description:
    "American Elite Enterprises is a private group of businesses headquartered in Los Angeles, founded and directed by Dr. Daniel Davidson, with roots dating back to 1991.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        variant="split"
        image={{
          src: "/images/sectors/hero-towers.webp",
          alt: "Glass towers seen from below, converging against the sky",
        }}
        crumbs={[{ name: "About", path: "/about/" }]}
        eyebrow="About American Elite"
        title={
          <>
            Built over <span className="text-accent-gradient">decades.</span>
          </>
        }
        lead="American Elite Enterprises is a private group of businesses that has been around since 1991 in various forms — headquartered in Los Angeles, California."
      />

      <section aria-labelledby="who-title" className="py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="who-title"
              eyebrow="Who we are"
              title={
                <>
                  A parent organization for a{" "}
                  <span className="text-accent-gradient">diverse</span> portfolio.
                </>
              }
            />
          </div>
          <div
            data-reveal
            style={{ "--reveal-delay": 2 } as React.CSSProperties}
            className="prose-editorial text-fg-muted lg:col-span-6 lg:col-start-7"
          >
            <p>
              American Elite Enterprises has gone through a large series of
              transformations, enhancements and expansions since its beginnings in 1991.
              Today it is the overarching organization connecting businesses and
              initiatives across {sectors.length} sectors: healthcare, business,
              technology, charities, legal services, consulting, e-commerce, education and
              inventions.
            </p>
            <p>
              At its core, American Elite is a business engineering and administration
              group. It helps businesses begin, grow, optimize and expand; it operates
              and administers businesses of its own; and it manages healthcare and real
              estate entities.
            </p>
            <p>
              The group was founded — and is still directed — by Dr. Daniel Davidson, who
              holds an MBA (Master of Business Administration), a DBA (Doctorate in
              Business Administration) and a PhD in Marketing. Its headquarters are at{" "}
              {addressLine}.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="structure-title" className="relative overflow-hidden bg-page py-24 text-fg sm:py-32">
        <div className="container-x">
          <SectionHeading
            id="structure-title"
           
            eyebrow="Group structure"
            align="split"
            title={
              <>
                The entities of <span className="text-accent-gradient">American Elite.</span>
              </>
            }
            lead="These entities form the core of American Elite Enterprises. Around them sits a wider portfolio of companies across every sector."
          />

          <div className="mt-16 lg:mt-20">
            <div data-reveal className="mx-auto flex max-w-sm flex-col items-center rounded-md border border-accent/50 bg-page-alt px-8 py-6 text-center">
              <span className="label-mono text-[0.65rem] text-accent">Parent organization</span>
              <span className="mt-2 font-display text-xl font-semibold">{site.name}</span>
            </div>
            <div aria-hidden className="mx-auto h-10 w-px bg-accent/50" />
            <div aria-hidden className="mx-auto hidden h-px w-[75%] bg-accent/40 lg:block" />

            <ul className="mt-0 grid gap-4 sm:grid-cols-2 lg:mt-0 lg:grid-cols-4">
              {entities.map((entity, i) => (
                <li key={entity.slug} data-reveal style={{ "--reveal-delay": i % 4 } as React.CSSProperties} className={`relative ${i < 4 ? "lg:pt-8" : ""}`}>
                  {i < 4 && (
                    <span aria-hidden className="absolute left-1/2 top-0 hidden h-8 w-px bg-accent/40 lg:block" />
                  )}
                  <Link
                    href={`/${entity.slug}/`}
                    className="spotlight trace-border group flex h-full flex-col rounded-md border border-line bg-tint p-6 transition-colors duration-500 hover:bg-tint-strong"
                  >
                    <span className="label-mono text-[0.62rem] text-fg-muted">
                      {getSector(entity.sector)?.name}
                    </span>
                    <span className="mt-4 font-display text-lg font-semibold leading-snug">
                      {entity.name}
                    </span>
                    <span className="mt-2 text-sm leading-relaxed text-fg-muted">{entity.tagline}</span>
                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-accent">
                      View profile
                      <ArrowRight width={16} height={16} className="arrow-nudge" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-14 flex justify-center">
            <ButtonLink href="/companies/" variant="glass">
              See the full company directory
            </ButtonLink>
          </div>
        </div>
      </section>

      <section aria-labelledby="history-title" className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading
            id="history-title"
            eyebrow="History"
            align="split"
            title={
              <>
                Since <span className="text-accent-gradient">1991.</span>
              </>
            }
            lead="The documented milestones of American Elite and its founder."
          />
          <div className="mt-20">
            <Timeline />
          </div>
        </div>
      </section>

      <section aria-labelledby="crest-title" className="bg-page-alt py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12">
          <div data-reveal className="mx-auto w-full max-w-xs lg:col-span-4 lg:max-w-none">
            <Image
              src={crest}
              alt="The American Elite Enterprises crest: a jewelled gold crown above an ornate gold frame enclosing a gold lion in a laurel wreath, an American flag ribbon and the words American Elite Enterprises"
              sizes="(min-width: 1024px) 30vw, 320px"
              className="h-auto w-full drop-shadow-[0_0_60px_rgb(36_99_234/0.18)]"
            />
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <SectionHeading
              id="crest-title"
              eyebrow="Leadership"
              title={
                <>
                  Founded and directed by{" "}
                  <span className="text-accent-gradient">{founder.name}.</span>
                </>
              }
              lead={
                <>
                  A business engineer and executive administrator with an extensive
                  healthcare background, Dr. Davidson has led American Elite through each of
                  its transformations — guided by one motto: “{founder.motto}.”
                </>
              }
            />
            <div data-reveal className="mt-10">
              <ButtonLink href="/dr-daniel-davidson/" variant="solid">
                Meet Dr. Daniel Davidson
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
