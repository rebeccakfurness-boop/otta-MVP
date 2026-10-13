import { ButtonLink, PageHeader } from "@/components/portal/ui";
import { adminPath } from "@/lib/admin/config";

export default function AdminNotFound() {
  return <PageHeader title="We couldn't find that" description="It may have been removed or the link may be wrong." actions={<ButtonLink href={adminPath("/")}>Back to overview</ButtonLink>} />;
}
