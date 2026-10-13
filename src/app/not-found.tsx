import { ButtonLink } from "@/components/Button";
import { PageHeader } from "@/components/PageHeader";

export default function NotFound() {
  return (
    <PageHeader eyebrow="404" title="We couldn't find that page">
      <p>The page may have moved. Try the home page or get in touch.</p>
      <ButtonLink href="/" className="mt-8">Back to home</ButtonLink>
    </PageHeader>
  );
}
