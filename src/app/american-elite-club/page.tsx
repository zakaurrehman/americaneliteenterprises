import { EntityPage, entityMetadata } from "@/components/entities/EntityPage";

export const metadata = entityMetadata("american-elite-club");

export default function Page() {
  return <EntityPage slug="american-elite-club" />;
}
