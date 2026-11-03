import { bentoLayout, IndustryCard } from "@/components/industries/IndustryCard";
import { ContactCta } from "@/components/sections/ContactCta";
import { PageHero } from "@/components/sections/PageHero";
import { sectors, totalCompanies } from "@/content/portfolio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Industries — Our Business Sectors",
  description:
    "Explore the nine business sectors of American Elite Enterprises: healthcare, business, technology, charities, legal, consulting, e-commerce, education and inventions.",
  path: "/industries/",
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Industries", path: "/industries/" }]}
        eyebrow="Industries"
        title={
          <>
            Nine sectors, <span className="text-accent-gradient">one group.</span>
          </>
        }
        lead={`American Elite brings together ${totalCompanies} businesses and initiatives. Each sector has its own purpose and its own companies — all connected through one enterprise group.`}
      />

      <section aria-label="All sectors" className="pb-12">
        <div className="container-x grid grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[19rem] lg:grid-cols-12">
          {sectors.map((sector, i) => (
            <IndustryCard key={sector.slug} sector={sector} index={i} feature={i === 0} className={bentoLayout[i]} />
          ))}
        </div>
      </section>

      <ContactCta />
    </>
  );
}
