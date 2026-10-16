import { complaintStatuses, feedbackTypes } from "@/content/admin-feedback";
import { complaintTargets, type Feedback } from "@/lib/feedback";

const typeTone = { compliment: "bg-[#e6f4f2] text-[#2e7d74]", complaint: "bg-[#f1e6f6] text-site-purple" };
const statusTone: Record<string, string> = {
  open: "bg-[#fdf1e2] text-[#8a5a12]",
  acknowledged: "bg-[#e3eef3] text-site-blue",
  resolved: "bg-site-teal text-white",
  referred: "bg-site-purple text-white",
  closed: "bg-[#efefef] text-[#555]",
};

function Badge({ tone, children }: { tone: string; children: React.ReactNode }) {
  return <span className={`inline-flex items-center rounded-sm px-2 py-1 text-[11px] font-semibold tracking-[0.06em] whitespace-nowrap uppercase ${tone}`}>{children}</span>;
}

export function FeedbackBadges({ entry, today }: { entry: Feedback; today: string }) {
  const targets = entry.type === "complaint" ? complaintTargets(entry, today) : null;
  return (
    <span className="flex flex-wrap items-center gap-2">
      <Badge tone={typeTone[entry.type]}>{feedbackTypes[entry.type]}</Badge>
      {entry.status && <Badge tone={statusTone[entry.status]}>{complaintStatuses[entry.status]}</Badge>}
      {targets?.acknowledgeOverdue && <Badge tone="bg-[#fbe4e4] text-[#a12a2a]">Acknowledgement overdue</Badge>}
      {targets?.resolveOverdue && <Badge tone="bg-[#fbe4e4] text-[#a12a2a]">Past 2 months</Badge>}
    </span>
  );
}
