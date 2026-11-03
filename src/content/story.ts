// Story, timeline and founder content. Every milestone is taken from the original
// site (homepage, foundation page and the Dr. Daniel Davidson page). Founder
// milestones are labelled as such rather than presented as company events.

export type Milestone = {
  year: string;
  title: string;
  body: string;
  kind: "group" | "founder";
};

export const milestones: Milestone[] = [
  {
    year: "1991",
    title: "American Elite begins",
    body: "American Elite Enterprises traces its roots to 1991, operating since then in various forms as a private group of businesses.",
    kind: "group",
  },
  {
    year: "1997",
    title: "A foundation is established",
    body: "Dr. Daniel Davidson founds Messiah International Foundation in Los Angeles — the non-profit known today as American Elite Foundation.",
    kind: "group",
  },
  {
    year: "2004",
    title: "Founder earns his MBA",
    body: "Dr. Davidson completes an MBA at the University of California, Irvine, later adding a Doctorate in Business Administration and a PhD in Marketing.",
    kind: "founder",
  },
  {
    year: "2006",
    title: "Seven books published",
    body: "Dr. Davidson authors seven books in the self-help business category, each assigned official Library of Congress numbers.",
    kind: "founder",
  },
  {
    year: "2012",
    title: "Full-time business engineering",
    body: "Dr. Davidson dedicates himself full-time to business engineering and optimization consulting.",
    kind: "founder",
  },
  {
    year: "Today",
    title: "One group, nine sectors",
    body: "Headquartered in Los Angeles, American Elite connects a portfolio of businesses and initiatives across nine sectors — still founded and directed by Dr. Daniel Davidson.",
    kind: "group",
  },
];

export const founder = {
  name: "Dr. Daniel Davidson",
  role: "Founder & Director",
  headline: "A business engineer, executive administrator with an extensive healthcare background.",
  motto: "Constant & Never-Ending Improvement",
  credentials: ["BSc", "MD", "ND", "MBA", "DBA", "PhD in Marketing"],
  quote:
    "To build businesses, to optimize them, to teach self-help and entrepreneurship, and to participate in charitable services, helping the world!",
  portrait: "/images/brand/daniel-davidson.webp",
  sections: [
    {
      id: "overview",
      title: "Overview",
      paragraphs: [
        "Dr. Daniel Davidson is the Founder and Director of American Elite Enterprises. He is a business engineer and an executive administrator who, over a career of more than 30 years in business, teaching and writing, has lived by one motto: “Constant & Never-Ending Improvement.”",
        "He calls himself a life-long student — perpetually committed to learning, growing, helping others and sharing what he knows with his students. His passion for entrepreneurship, he says, became apparent to his family when he was only four years old, bartering his lunch for his classmates' school supplies.",
        "He remained in private business in the healthcare field, where he created a prominent healthcare business. He pursued his MBA in 2004 and continued his education in business and, eventually, law. In 2006 he authored seven books in the self-help business category, which received official Library of Congress numbers.",
        "Dr. Davidson describes his profession as a combination of business engineering, optimization, teaching, authorship and participation in charitable services.",
      ],
    },
    {
      id: "business-engineering",
      title: "Business engineering & optimization",
      paragraphs: [
        "Dr. Davidson's blend of technical expertise and business acumen helped him build the consultancy American Elite Global Solutions, which provides business engineering consulting and takes a holistic approach — combining technical and data analysis with a deep understanding of the human and organizational factors that drive success.",
        "His work often includes a comprehensive analysis of business processes, identification of bottlenecks and the development of more efficient processes, while leveraging technology to drive results. “Change management is another critical component,” he says, “and I understand that change can be difficult for organizations and individuals.” He and his team provide guidance from planning and preparation through implementation and beyond.",
        "Their work has spanned industries including healthcare, retail, manufacturing and distribution.",
      ],
    },
    {
      id: "teaching",
      title: "Teaching & authorship",
      paragraphs: [
        "Over the years, Dr. Davidson saw that many professionals, despite their education and experience, were still struggling to achieve financial independence — often because of a lack of understanding of the basic principles of business and finance, and a lack of access to the right resources and support.",
        "He founded American Elite Institute, an educational institute that provides business and financial education to professionals who wish to transition from their jobs to financial independence and business ownership. He also speaks at events and workshops, sharing practical, actionable advice with professionals and business owners.",
      ],
    },
    {
      id: "education",
      title: "Education & work history",
      paragraphs: [
        "Dr. Davidson graduated from Canoga Park High School in Los Angeles. Passionate about both medicine and entrepreneurship since childhood, he chose to pursue both, almost always holding a part-time job to stay active in business through college and medical school.",
        "He received a bachelor's degree (BSc), a doctorate in medicine (MD) and a doctorate in naturopathy (ND), then pursued specialization training in general surgery, followed by laser and cosmetic surgery. He practiced cosmetic surgery in Beverly Hills for almost 15 years, building a prominent practice in Los Angeles while remaining active as a business owner, coach and consultant.",
        "Choosing to follow his true passion, he studied business administration at the University of California, Irvine, where he received his MBA. Two years of additional training in corporate entrepreneurship and executive business administration followed, after which he received a Doctorate in Business Administration (DBA) and, a year later, a PhD in Marketing. He later studied law for almost two years, and has been a committed student of psychology, self-help science, psychiatry and hypnotherapy since the mid-1980s.",
        "An entrepreneur for most of his life and active in business for over 30 years, he has practiced business engineering and optimization consulting full-time since 2012.",
      ],
    },
  ],
} as const;
