import { Card, CardHeader } from "@/components/portal/ui";
import { buildingApplication } from "@/content/building-application";
import { displayValue, moneyText, unitRows, visibleSections, type Answers } from "@/lib/forms/building-application";

/** Read-only answers of a submitted application, section by section. */
export function ApplicationSummary({ answers }: { answers: Answers }) {
  const signOff = buildingApplication.parts.flatMap((p) => p.signOff ?? []);
  return (
    <div className="space-y-6">
      {visibleSections(answers).map((section) => (
        <Card key={section.id}>
          <CardHeader title={section.title.replace(/, please complete the following section$/, "")} />
          <dl className="divide-y divide-[#f0f0f0]">
            {section.fields.map((field) =>
              field.kind === "units" ? (
                <div key={field.name} className="overflow-x-auto px-6 py-4">
                  <table className="w-full min-w-[420px] text-[14px]">
                    <thead>
                      <tr className="text-left text-[11px] tracking-[0.1em] text-body uppercase">
                        {field.columns.map((c) => (
                          <th key={c.key} className="pb-2 font-semibold">
                            {c.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {unitRows(field, answers).map((row, i) => (
                        <tr key={i} className="border-t border-[#f0f0f0]">
                          {field.columns.map((c) => (
                            <td key={c.key} className="py-2 text-charcoal">
                              {c.kind === "money" ? moneyText(row[c.key]) : row[c.key]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div key={field.name} className="grid gap-1 px-6 py-3 sm:grid-cols-[1fr_minmax(0,1fr)] sm:gap-6">
                  <dt className="text-[14px] text-body">{field.label}</dt>
                  <dd className="text-[14px] whitespace-pre-line text-charcoal">{displayValue(field, answers[field.name]) || "Not provided"}</dd>
                </div>
              ),
            )}
          </dl>
        </Card>
      ))}
      <Card>
        <CardHeader title="Declaration" />
        <dl className="divide-y divide-[#f0f0f0]">
          {signOff.map((field) => (
            <div key={field.name} className="grid gap-1 px-6 py-3 sm:grid-cols-[1fr_minmax(0,1fr)] sm:gap-6">
              <dt className="text-[14px] text-body">{field.label}</dt>
              <dd className="text-[14px] text-charcoal">{displayValue(field, answers[field.name])}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
