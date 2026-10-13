import { ButtonLink, PageHeader } from "@/components/portal/ui";
import { portalPath } from "@/lib/portal/config";

export default function PortalNotFound() {
  return (
    <PageHeader
      title="We couldn't find that"
      description="It may have been moved, or it may belong to a different brokerage."
      actions={<ButtonLink href={portalPath("/")}>Back to dashboard</ButtonLink>}
    />
  );
}
