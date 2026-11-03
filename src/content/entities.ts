// The core entities of American Elite Enterprises. Each keeps the URL slug of its
// original WordPress page. Copy is taken from those pages, lightly edited for
// grammar and length; injected third-party spam found on several originals has
// been excluded.

import type { SectorSlug } from "./portfolio";

export type Entity = {
  slug: string;
  name: string;
  sector: SectorSlug;
  tagline: string;
  metaDescription: string;
  body: string[];
  /** Optional bulleted list of services, taken from the original page. */
  services?: string[];
  website: { label: string; url: string };
  image: string;
  imageAlt: string;
};

export const entities: Entity[] = [
  {
    slug: "american-elite-global-solutions",
    name: "American Elite Global Solutions",
    sector: "business",
    tagline: "Business engineering, business optimization & administration.",
    metaDescription:
      "American Elite Global Solutions is the business engineering, optimization and administration company of American Elite Enterprises.",
    body: [
      "American Elite Global Solutions is a business engineering, business optimization and administration company. We help clients initiate a business from the ground up, then market and grow it, optimize it and troubleshoot it along the way — expanding its footprint locally or multiplying its physical branches, followed by exercising exit strategies should that be part of the plan.",
      "We consider ourselves an ally of our clients, and in many cases we are literally business partners with them. American Elite Global Solutions takes a holistic approach to business engineering, combining technical and data analysis with a deep understanding of the human and organizational factors that drive success.",
      "Dr. Davidson and his team work closely with clients to understand their needs and develop customized solutions for their unique challenges — identifying areas that can be optimized, streamlining operations and leveraging technology to drive results. Change management is a critical component, and the team guides clients through each transition.",
    ],
    services: [
      "Initiating businesses from the ground up",
      "Marketing and growing client businesses",
      "Optimizing businesses and maximizing profitability",
      "Troubleshooting to streamline operations and minimize inefficiencies",
      "Turnarounds — reorganizing businesses from top to bottom to return to profitability",
      "Expansion locally or through additional branches, and exit strategies",
      "Vertical and transverse integration",
      "Diversification through acquisition outside the client's niche",
    ],
    website: {
      label: "AmericanEliteGlobalSolutions.com",
      url: "https://americaneliteglobalsolutions.com/",
    },
    image: "/images/sectors/handshake.webp",
    imageAlt: "Two business partners shaking hands",
  },
  {
    slug: "american-elite-global",
    name: "American Elite Global Businesses",
    sector: "business",
    tagline: "The wider business activities of American Elite.",
    metaDescription:
      "American Elite Global Businesses: co-op marketing systems for professionals, professional business administration, and management of real estate and healthcare entities.",
    body: [
      "Besides the business services provided to clients by American Elite Global Solutions, and the e-commerce side of the company, American Elite is active in many other businesses.",
      "These include the development of co-op marketing systems for professionals such as attorneys, psychologists, psychiatrists, addiction medicine physicians, residential drug rehabilitation facilities and intensive outpatient psychotherapy centers, among others.",
      "We also operate and perform the professional administration of many businesses, manage various real estate entities, and are heavily involved in the professional management of various healthcare entities.",
    ],
    website: { label: "AmericanEliteGlobal.com", url: "https://americaneliteglobal.com/" },
    image: "/images/sectors/business.webp",
    imageAlt: "Glass office towers rising into an overcast sky",
  },
  {
    slug: "american-elite-ecommerce",
    name: "American Elite eCommerce",
    sector: "e-commerce",
    tagline: "Commerce, engineered for profitability.",
    metaDescription:
      "American Elite eCommerce builds and optimizes e-commerce websites in collaboration with TechArt Digital, the digital branch of American Elite.",
    body: [
      "E-commerce is an ever-expanding way for the public to make day-to-day purchases. It is not only growing by leaps and bounds — it is the way of life today, and here to stay.",
      "As a business engineering company with an excellent digital business systems development and optimization branch, TechArt Digital, American Elite is well positioned to participate in this trend.",
      "In collaboration with American Elite, TechArt Digital can build an e-commerce site to sell the products you wish to sell, and optimize it for maximum profitability.",
    ],
    website: { label: "AmericanEliteEcom.com", url: "https://americaneliteecom.com/" },
    image: "/images/sectors/ecommerce.webp",
    imageAlt: "Shopping bags arranged on a dark surface",
  },
  {
    slug: "american-elite-institute",
    name: "American Elite Institute",
    sector: "education",
    tagline: "Advanced education for professionals and business leaders.",
    metaDescription:
      "American Elite Institute provides professionals and business leaders with advanced education and training for their professional and personal advancement.",
    body: [
      "American Elite Institute is an educational institute created to provide professionals and business leaders with advanced education and training appropriate to their needs, supporting them in their quest for advancement in their professional and personal lives.",
      "Through the Institute, Dr. Daniel Davidson teaches professionals to transition from job dependence to financial independence and business ownership. Students can also receive customized solutions to help them reach their financial goals.",
    ],
    website: {
      label: "AmericanEliteInstitute.com",
      url: "https://americaneliteinstitute.com/",
    },
    image: "/images/sectors/education.webp",
    imageAlt: "Library shelves lined with classic books and marble busts",
  },
  {
    slug: "american-elite-training",
    name: "American Elite Training",
    sector: "education",
    tagline: "Training and certification in American Elite's fields of expertise.",
    metaDescription:
      "American Elite Training designs training and educational programs, with certification, in the fields where American Elite provides expert services.",
    body: [
      "American Elite Training designs training and educational programs in the various fields in which American Elite provides expert services.",
      "These programs are offered to those seeking such schooling, and certifications are provided on their completion.",
    ],
    website: {
      label: "AmericanEliteTraining.com",
      url: "https://americanelitetraining.com/",
    },
    image: "/images/sectors/architecture-white.webp",
    imageAlt: "Angular white modern architecture against a pale sky",
  },
  {
    slug: "american-elite-club",
    name: "American Elite Club",
    sector: "business",
    tagline: "A leaders' club.",
    metaDescription:
      "American Elite Club is a leaders' club where select American Elite business management leaders are invited to join as members.",
    body: [
      "American Elite Club is a “Leaders' Club”, where a select few of American Elite's top business management leaders are invited to join as members.",
      "These leaders have met certain criteria and have proven worthy of membership in this club.",
    ],
    website: { label: "AmericanEliteClub.com", url: "https://americaneliteclub.com/" },
    image: "/images/sectors/architecture-curve.webp",
    imageAlt: "Sweeping curved facade of a modern building",
  },
  {
    slug: "american-elite-foundation",
    name: "American Elite Foundation",
    sector: "charities",
    tagline: "Led, always, by the light of love.",
    metaDescription:
      "American Elite Foundation, originally Messiah International Foundation, was founded in 1997 by Dr. Daniel Davidson in Los Angeles to serve those in need.",
    body: [
      "American Elite Foundation was originally called Messiah International Foundation and was founded in 1997 by Dr. Daniel Davidson in Los Angeles. Over the years, this non-profit organization has changed and transformed in many ways, but its constant has always been the desire to serve the unfortunate and those in need, regardless of race, color, religion or any other factor.",
      "Through dark and difficult days, the beacon that has always led the way is the light of love — love for humanity, for the planet, for animals; love for life and everything that is alive. The foundation's mission is to serve those who need a hand up and are in search of a kind heart, and to serve them wholeheartedly.",
      "Throughout the years, in cooperation with tens of charities and foundations, American Elite has participated in fulfilling this mission, and it continues to do so day to day. The foundation is now looking to expand its operations, grow its team and do more. Every little thing you can do with love to serve another in need makes a difference.",
    ],
    website: {
      label: "AmericanEliteFoundation.org",
      url: "https://americanelitefoundation.org/",
    },
    image: "/images/sectors/charities.webp",
    imageAlt: "Volunteers' hands joined together in a circle",
  },
  {
    slug: "american-elite-techart-digital",
    name: "American Elite – TechArt Digital",
    sector: "technology",
    tagline: "Total digital operations systems & web solutions.",
    metaDescription:
      "TechArt Digital is the Total Digital Operations Systems & Web Solutions branch of American Elite: IT architecture, digital strategy, implementation, training and support.",
    body: [
      "TechArt is the “Total Digital Operations Systems & Web Solutions” branch of American Elite, a business engineering and administration company.",
      "With extensive experience in the fields associated with implementing digital business systems and web solutions, TechArt Digital offers an integrated suite of business services, IT consulting and technology support, tailored to clients' needs today and for the future.",
      "Its team of digital experts and consultants helps clients maximize the potential of their business through IT architecture, digital strategy, project implementation, staff training and support — partnering with each business to devise and implement strategies that enhance profits.",
    ],
    services: [
      "IT architecture",
      "Digital strategy",
      "Project implementation",
      "Staff training",
      "Ongoing support",
    ],
    website: { label: "TechArtDigital.com", url: "https://techartdigital.com/" },
    image: "/images/sectors/technology.webp",
    imageAlt: "Close-up of a circuit board with processors",
  },
];

export function getEntity(slug: string): Entity {
  const entity = entities.find((e) => e.slug === slug);
  if (!entity) throw new Error(`Unknown entity: ${slug}`);
  return entity;
}
