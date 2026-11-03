// The American Elite business portfolio.
//
// Every company and URL below comes from the mega menu, homepage and entity pages
// of the original americaneliteenterprises.com. Short descriptions are condensed
// from each company's own website title/description or from the original
// American Elite entity pages; where no reliable description exists, it is
// omitted rather than invented.

export type SectorSlug =
  | "healthcare"
  | "business"
  | "technology"
  | "charities"
  | "legal"
  | "consulting"
  | "e-commerce"
  | "education"
  | "inventions";

export type Sector = {
  slug: SectorSlug;
  name: string;
  /** One-line summary used on cards and in menus. */
  summary: string;
  /** Longer, source-grounded introduction for the industry page. */
  intro: string[];
  image: string;
  imageAlt: string;
  /** CSS object-position for cropping the sector photo. */
  focus?: string;
};

export type CompanySite = { label: string; url: string };

export type Company = {
  name: string;
  sector: SectorSlug;
  sites: CompanySite[];
  description?: string;
  /** Internal profile page, for the group's core entities. */
  profile?: string;
};

export const sectors: Sector[] = [
  {
    slug: "healthcare",
    name: "Healthcare",
    summary:
      "Home health, mobile physician services, clinics and patient-support networks.",
    intro: [
      "Healthcare runs through the American Elite story. Before dedicating himself to business engineering, founder Dr. Daniel Davidson practiced medicine and surgery in Los Angeles, and the group remains heavily involved in the professional management of healthcare entities.",
      "The healthcare portfolio spans home health care, mobile physician and wound-care services, clinics, staffing and initiatives that connect patients with the providers who serve them.",
    ],
    image: "/images/sectors/healthcare.webp",
    imageAlt: "Physician in a white coat holding a stethoscope",
    focus: "60% 40%",
  },
  {
    slug: "business",
    name: "Business",
    summary:
      "Business engineering, administration, co-op marketing systems and enterprise ventures.",
    intro: [
      "Business engineering is the group's core discipline: helping clients initiate businesses from the ground up, then market, optimize, troubleshoot and expand them — and, where it is part of the plan, execute an exit strategy.",
      "Beyond client services, American Elite develops co-op marketing systems for professionals, provides professional business administration, and manages real estate and healthcare entities.",
    ],
    image: "/images/sectors/business.webp",
    imageAlt: "Glass office towers rising into an overcast sky",
    focus: "50% 30%",
  },
  {
    slug: "technology",
    name: "Technology",
    summary:
      "Digital operations systems, web solutions, software and brand technology.",
    intro: [
      "TechArt Digital is American Elite's “Total Digital Operations Systems & Web Solutions” branch, offering IT architecture, digital strategy, project implementation, staff training and support.",
      "Alongside it, the technology portfolio includes brand, web and app development studios that serve business owners, startups and growing companies.",
    ],
    image: "/images/sectors/technology.webp",
    imageAlt: "Close-up of a circuit board with processors",
    focus: "50% 50%",
  },
  {
    slug: "charities",
    name: "Charities",
    summary:
      "Foundations serving people in need — regardless of race, color or religion.",
    intro: [
      "American Elite Foundation was originally called Messiah International Foundation, founded in 1997 by Dr. Daniel Davidson in Los Angeles. Its constant has been a desire to serve the unfortunate and those in need, regardless of race, color, religion or any other factor.",
      "Over the years, in cooperation with tens of charities and foundations, American Elite has participated in fulfilling that mission — and continues to do so day to day.",
    ],
    image: "/images/sectors/charities.webp",
    imageAlt: "Volunteers' hands joined together in a circle",
    focus: "50% 50%",
  },
  {
    slug: "legal",
    name: "Legal",
    summary:
      "Attorney-focused brands and service-animal registration services.",
    intro: [
      "The legal portfolio brings together attorney-focused websites and service-animal registration services.",
      "It connects with one of the group's longer-standing activities: developing co-op marketing systems for professionals, including attorneys.",
    ],
    image: "/images/sectors/legal.webp",
    imageAlt: "Bronze statue of Lady Justice holding scales",
    focus: "50% 35%",
  },
  {
    slug: "consulting",
    name: "Consulting",
    summary:
      "Business consulting, accounting, expert witnesses and healthcare billing.",
    intro: [
      "American Elite takes a holistic approach to consulting, combining technical and data analysis with a deep understanding of the human and organizational factors that drive success.",
      "The consulting portfolio covers business growth consulting, bookkeeping and accounting, expert witness services, and billing and administration for healthcare providers.",
    ],
    image: "/images/sectors/consulting.webp",
    imageAlt: "Consultants reviewing notes beside open laptops",
    focus: "50% 50%",
  },
  {
    slug: "e-commerce",
    name: "E-commerce",
    summary: "Online retail brands, built and optimized with TechArt Digital.",
    intro: [
      "E-commerce has become the way much of the public makes its day-to-day purchases. As a business engineering company with its own digital systems branch, TechArt Digital, American Elite is positioned to participate in that shift.",
      "The group's commerce brands span home storage, footwear and jewelry.",
    ],
    image: "/images/sectors/ecommerce.webp",
    imageAlt: "Shopping bags arranged on a dark surface",
    focus: "50% 50%",
  },
  {
    slug: "education",
    name: "Education",
    summary:
      "Advanced education, training and certification for professionals.",
    intro: [
      "American Elite Institute provides professionals and business leaders with advanced education and training suited to their needs — including courses that help professionals move from job dependence to financial independence and business ownership.",
      "American Elite Training designs educational programs in the fields where American Elite provides expert services, with certification on completion.",
    ],
    image: "/images/sectors/education.webp",
    imageAlt: "Library shelves lined with classic books and marble busts",
    focus: "40% 50%",
  },
  {
    slug: "inventions",
    name: "Inventions",
    summary: "Original product ideas, from concept to market.",
    intro: [
      "The inventions portfolio is where American Elite develops original products of its own.",
      "It currently features FflatProoff — flat-proof tires designed so they never go flat.",
    ],
    image: "/images/sectors/inventions.webp",
    imageAlt: "Engineer drafting technical drawings at a desk",
    focus: "50% 50%",
  },
];

const site = (label: string, url: string): CompanySite => ({ label, url });

export const companies: Company[] = [
  // Healthcare
  {
    name: "Hospitals Without Walls",
    sector: "healthcare",
    description: "Coordinated care wherever the patient calls home.",
    sites: [
      site("HospitalsWithoutWalls.com", "https://hospitalswithoutwalls.com/"),
      site("HospitalWithoutWalls.ca", "https://hospitalwithoutwalls.ca/"),
      site("HospitalsWithoutWalls.us", "https://hospitalswithoutwalls.us/"),
      site("HospitalsWithoutWalls.app", "https://hospitalswithoutwalls.app/"),
    ],
  },
  {
    name: "Ideal Service Staff",
    sector: "healthcare",
    sites: [site("IdealServiceStaff.com", "https://idealservicestaff.com/")],
  },
  {
    name: "Mobile Caring Docs",
    sector: "healthcare",
    description: "Physicians providing specialty health services at care facilities.",
    sites: [site("MobileCaringDocs.com", "https://mobilecaringdocs.com/")],
  },
  {
    name: "Mobile Wound Docs",
    sector: "healthcare",
    description: "Mobile wound care delivered to the patient's bedside.",
    sites: [site("MobileWoundDocs.com", "https://mobilewounddocs.com/")],
  },
  {
    name: "Iconic Dr",
    sector: "healthcare",
    description: "A life-centered approach to the health of head, heart and spirit.",
    sites: [site("IconicDr.com", "https://iconicdr.com/")],
  },
  {
    name: "Dr New Me",
    sector: "healthcare",
    sites: [site("DrNewMe.com", "https://drnewme.com/")],
  },
  {
    name: "Entireopathic Medicine",
    sector: "healthcare",
    sites: [site("EntireoPathicMedicine.com", "https://entireopathicmedicine.com/")],
  },
  {
    name: "Good Neighbor Clinics",
    sector: "healthcare",
    description: "General medicine and psychiatry clinics in Los Angeles.",
    sites: [
      site("GoodNeighborClinics.com", "https://goodneighborclinics.com/"),
      site("GoodNeighborClinics.net", "https://goodneighborclinics.net/"),
    ],
  },
  {
    name: "Home Health Collaborative Alliance",
    sector: "healthcare",
    description:
      "Connecting patients with home health agencies and supporting providers across California.",
    sites: [
      site(
        "HomeHealthCollaborativeAlliance.com",
        "https://homehealthcollaborativealliance.com/",
      ),
    ],
  },
  {
    name: "Elderly Health US",
    sector: "healthcare",
    description: "Home health care in North Hollywood, California.",
    sites: [site("ElderlyHealth.us", "https://elderlyhealth.us/")],
  },
  {
    name: "Everest Peak Home Health Care",
    sector: "healthcare",
    description: "Skilled nursing, therapy and post-operative care at home.",
    sites: [
      site("EverestPeakHomeHealthCare.com", "https://everestpeakhomehealthcare.com/"),
    ],
  },
  {
    name: "Perfect Visions",
    sector: "healthcare",
    sites: [site("PerfectVisions.info", "https://perfectvisions.info/")],
  },
  {
    name: "Multi Specialty Med",
    sector: "healthcare",
    sites: [site("MultiSpecialtyMed.com", "https://multispecialtymed.com/")],
  },

  // Business
  {
    name: "American Elite Global Solutions",
    sector: "business",
    description: "Business engineering, business optimization and administration.",
    profile: "/american-elite-global-solutions/",
    sites: [
      site("AmericanEliteGlobalSolutions.com", "https://americaneliteglobalsolutions.com/"),
    ],
  },
  {
    name: "American Elite Global Businesses",
    sector: "business",
    description:
      "Co-op marketing systems, business administration and management of healthcare and real estate entities.",
    profile: "/american-elite-global/",
    sites: [site("AmericanEliteGlobal.com", "https://americaneliteglobal.com/")],
  },
  {
    name: "American Elite Club",
    sector: "business",
    description: "A leaders' club for select American Elite business management leaders.",
    profile: "/american-elite-club/",
    sites: [site("AmericanEliteClub.com", "https://americaneliteclub.com/")],
  },
  {
    name: "American Elite Executives",
    sector: "business",
    sites: [site("AmericanEliteExecutives.com", "http://americaneliteexecutives.com")],
  },
  {
    name: "Business Star Makers",
    sector: "business",
    sites: [site("BusinessStarMakers.com", "https://businessstarmakers.com/")],
  },
  {
    name: "Global Star Makers",
    sector: "business",
    sites: [site("GlobalStarMakers.com", "https://globalstarmakers.com/")],
  },
  {
    name: "Global Business Solution",
    sector: "business",
    sites: [site("GlobalBusinessSolution.in", "https://globalbusinesssolution.in/")],
  },
  {
    name: "American Elite Lenders",
    sector: "business",
    sites: [site("AmericanEliteLenders.com", "http://americanelitelenders.com")],
  },
  {
    name: "American Elite Expert Professional Consultants",
    sector: "business",
    description: "Expert professional consulting to solve business problems.",
    sites: [
      site(
        "AmericanEliteExpertProfessionalConsultants.com",
        "http://AmericanEliteExpertProfessionalConsultants.com",
      ),
    ],
  },

  // Technology
  {
    name: "American Elite – TechArt Digital",
    sector: "technology",
    description: "Total digital operations systems and web solutions.",
    profile: "/american-elite-techart-digital/",
    sites: [site("TechArtDigital.com", "https://techartdigital.com/")],
  },
  {
    name: "American Elite Digital",
    sector: "technology",
    description: "Brand identity, websites, custom apps and digital marketing.",
    sites: [site("AmericanEliteDigital.com", "https://americanelitedigital.com/")],
  },
  {
    name: "AllDigTech",
    sector: "technology",
    sites: [site("AllDigTech.com", "https://alldigtech.com/")],
  },

  // Charities
  {
    name: "American Elite Foundation",
    sector: "charities",
    description:
      "Improving life through health care, education, social support and community services.",
    profile: "/american-elite-foundation/",
    sites: [site("AmericanEliteFoundation.org", "https://americanelitefoundation.org/")],
  },
  {
    name: "Messiah International Foundation",
    sector: "charities",
    description: "A non-profit dedicated to fostering global peace, tolerance and understanding.",
    sites: [
      site(
        "MessiahInternationalFoundation.org",
        "https://messiahinternationalfoundation.org/",
      ),
    ],
  },

  // Legal
  {
    name: "American Elite Lawyers",
    sector: "legal",
    sites: [site("AmericanEliteLawyers.com", "https://americanelitelawyers.com/")],
  },
  {
    name: "Top Lawyers",
    sector: "legal",
    sites: [site("TopLawyers.mobi", "https://toplawyers.mobi/")],
  },
  {
    name: "1-800-2-The-Law",
    sector: "legal",
    sites: [site("18002TheLaw.com", "https://18002thelaw.com/")],
  },
  {
    name: "Axident Lawyers",
    sector: "legal",
    sites: [site("AxidentLawyers.com", "https://axidentlawyers.com/")],
  },
  {
    name: "Service Animal US",
    sector: "legal",
    sites: [site("ServiceAnimal.us", "https://serviceanimal.us/")],
  },
  {
    name: "Certify Service Animal",
    sector: "legal",
    description: "Service animal registration in the USA.",
    sites: [site("CertifyServiceAnimal.org", "https://certifyserviceanimal.org/")],
  },
  {
    name: "Register Service Animal",
    sector: "legal",
    description: "Service animal registration in the USA.",
    sites: [site("RegisterServiceAnimal.org", "https://registerserviceanimal.org/")],
  },

  // Consulting
  {
    name: "American Elite Consultants",
    sector: "consulting",
    description: "Consultants for business growth and success.",
    sites: [site("AmericanEliteConsultants.com", "https://americaneliteconsultants.com/")],
  },
  {
    name: "American Elite Accountants",
    sector: "consulting",
    description: "Bookkeeping, accounting and financial consultation.",
    sites: [site("AmericanEliteAccountants.com", "https://americaneliteaccountants.com/")],
  },
  {
    name: "American Elite Expert Witnesses",
    sector: "consulting",
    description: "Expert witness services for attorneys.",
    sites: [
      site("AmericanEliteExpertWitnesses.com", "https://americaneliteexpertwitnesses.com/"),
    ],
  },
  {
    name: "American Elite Billing",
    sector: "consulting",
    description: "Billing and healthcare administration for healthcare providers.",
    sites: [site("AmericanEliteBilling.com", "https://americanelitebilling.com/")],
  },

  // E-commerce
  {
    name: "American Elite eCommerce",
    sector: "e-commerce",
    description: "E-commerce ventures built and optimized with TechArt Digital.",
    profile: "/american-elite-ecommerce/",
    sites: [site("AmericanEliteEcom.com", "https://americaneliteecom.com/")],
  },
  {
    name: "Under Bed Storage",
    sector: "e-commerce",
    sites: [site("UnderBedStorage.com", "https://underbedstorage.com/")],
  },
  {
    name: "Brand Shoes Only",
    sector: "e-commerce",
    description: "An online shoe store.",
    sites: [site("BrandShoesOnly.com", "http://brandshoesonly.com/")],
  },
  {
    name: "Jewelry For My Life",
    sector: "e-commerce",
    description: "Classic jewelry collections and gift packaging.",
    sites: [site("JewelryForMyLife.com", "https://jewelryformylife.com/")],
  },

  // Education
  {
    name: "American Elite Institute",
    sector: "education",
    description: "Advanced education and training for professionals and business leaders.",
    profile: "/american-elite-institute/",
    sites: [site("AmericanEliteInstitute.com", "https://americaneliteinstitute.com/")],
  },
  {
    name: "American Elite Training",
    sector: "education",
    description: "Training and certification programs in American Elite's fields of expertise.",
    profile: "/american-elite-training/",
    sites: [site("AmericanEliteTraining.com", "https://americanelitetraining.com/")],
  },

  // Inventions
  {
    name: "FflatProoff",
    sector: "inventions",
    description: "Flat-proof tires designed never to go flat.",
    sites: [site("FflatProoff.com", "https://fflatprooff.com/")],
  },
];

export function getSector(slug: string): Sector | undefined {
  return sectors.find((s) => s.slug === slug);
}

export function companiesIn(slug: SectorSlug): Company[] {
  return companies.filter((c) => c.sector === slug);
}

export const sectorHref = (slug: SectorSlug) => `/industries/${slug}/`;

export const totalCompanies = companies.length;
export const totalSites = companies.reduce((n, c) => n + c.sites.length, 0);
