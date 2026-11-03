import { ContactForm } from "@/components/contact/ContactForm";
import { PageHero } from "@/components/sections/PageHero";
import { Mail, Phone, Pin } from "@/components/ui/icons";
import { addressLine, site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact American Elite Enterprises",
  description:
    "Contact American Elite Enterprises in Los Angeles. Call (310) 766-6600, email Info@americaneliteconsultants.com, or send a message online.",
  path: "/contact/",
});

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLine)}`;

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Contact", path: "/contact/" }]}
        eyebrow="Contact"
        title={
          <>
            Let&apos;s start a <span className="text-accent-gradient">conversation.</span>
          </>
        }
        lead="Visitors, companies and potential partners are welcome to get in touch. Send us a message, or reach us directly by phone or email."
      />

      <section aria-label="Contact details and form" className="py-20 sm:py-28">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="label-mono text-accent">Reach us directly</h2>
            <ul className="mt-8 space-y-4">
              <li>
                <a
                  href={site.contact.phoneHref}
                  className="group flex items-start gap-4 glass rounded-2xl p-6 transition-colors hover:border-accent/40"
                >
                  <Phone className="mt-1 shrink-0 text-accent" />
                  <span>
                    <span className="block text-sm text-fg-muted">Telephone</span>
                    <span className="mt-1 block font-display text-xl font-semibold text-fg">
                      {site.contact.phoneDisplay}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={site.contact.emailHref}
                  className="group flex items-start gap-4 glass rounded-2xl p-6 transition-colors hover:border-accent/40"
                >
                  <Mail className="mt-1 shrink-0 text-accent" />
                  <span className="min-w-0">
                    <span className="block text-sm text-fg-muted">Email</span>
                    <span className="mt-1 block font-display text-base font-semibold text-fg [overflow-wrap:anywhere]">
                      {site.contact.email}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 glass rounded-2xl p-6 transition-colors hover:border-accent/40"
                >
                  <Pin className="mt-1 shrink-0 text-accent" />
                  <span>
                    <span className="block text-sm text-fg-muted">Headquarters</span>
                    <span className="mt-1 block font-display text-lg font-semibold leading-snug text-fg">
                      {site.contact.address.street}
                      <br />
                      {site.contact.address.city}, {site.contact.address.region}{" "}
                      {site.contact.address.postalCode}
                    </span>
                    <span className="mt-2 block text-sm text-accent underline underline-offset-4">
                      Open in Google Maps
                      <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <h2 className="display-md text-fg">Send a message</h2>
            <p className="mt-3 text-fg-muted">
              Tell us a little about yourself and how we can help.
            </p>
            <div className="mt-10">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
