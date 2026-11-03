import type { Metadata } from "next";
import { Directory } from "@/components/home/Directory";
import { Ecosystem } from "@/components/home/Ecosystem";
import { Hero } from "@/components/home/Hero";
import { Introduction } from "@/components/home/Introduction";
import { Leadership } from "@/components/home/Leadership";
import { Philosophy } from "@/components/home/Philosophy";
import { Story } from "@/components/home/Story";
import { ContactCta } from "@/components/sections/ContactCta";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: "American Elite Enterprises — Private Enterprise Group, Los Angeles" },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "American Elite Enterprises",
    description: site.description,
    url: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Introduction />
      <Ecosystem />
      <Directory />
      <Story />
      <Leadership />
      <Philosophy />
      <ContactCta index="07" />
    </>
  );
}
