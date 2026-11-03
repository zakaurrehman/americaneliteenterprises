import { EntityPage, entityMetadata } from "@/components/entities/EntityPage";

export const metadata = entityMetadata("american-elite-global");

export default function Page() {
  return <EntityPage slug="american-elite-global" />;
}
