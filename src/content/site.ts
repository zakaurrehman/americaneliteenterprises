// Verified organisation facts, sourced from the live americaneliteenterprises.com
// homepage and entity pages (audited 2026-10-31). Do not add unverified claims here.

export const site = {
  name: "American Elite Enterprises",
  shortName: "American Elite",
  url: "https://americaneliteenterprises.com",
  foundedYear: 1991,
  description:
    "American Elite Enterprises is a private group of businesses headquartered in Los Angeles, California, with roots dating back to 1991 — spanning healthcare, business, technology, charities, legal services, consulting, e-commerce, education and inventions.",
  founder: {
    name: "Dr. Daniel Davidson",
    role: "Founder & Director",
    website: "https://dramericanelite.com/",
  },
  contact: {
    phoneDisplay: "(310) 766-6600",
    phoneHref: "tel:+13107666600",
    email: "Info@americaneliteconsultants.com",
    emailHref: "mailto:Info@americaneliteconsultants.com",
    address: {
      street: "1270 South Alfred St. #1064",
      city: "Los Angeles",
      region: "CA",
      postalCode: "90035",
      country: "US",
    },
  },
} as const;

export const addressLine = `${site.contact.address.street}, ${site.contact.address.city}, ${site.contact.address.region} ${site.contact.address.postalCode}`;

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  { label: "Industries", href: "/industries/" },
  { label: "Leadership", href: "/dr-daniel-davidson/" },
  { label: "Contact", href: "/contact/" },
];
