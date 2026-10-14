import { Card, CardHeader } from "@/components/portal/ui";
import type { FormDefinition } from "@/content/forms";
import { displayValue, gridTotal, gridValues, moneyText, signOffFields, unitRows, visibleSections, type Answers } from "@/lib/forms/application";

/** Read-only answers of a submitted application, section by section. */
export function ApplicationSummary({ form, answers }: { form: FormDefinition; answers: Answers }) {
  const signOff = signOffFields(form);
  return (
    <div className="space-y-6">
      {visibleSections(form, answers).map((section) => (
        <Card key={section.id}>
          <CardHeader title={section.title.replace(/, please complete the following section$/, "")} />
          <dl className="divide-y divide-[#f0f0f0]">
            {section.fields.map((field) =>
              field.kind === "grid" ? (
                <div key={field.name} className="overflow-x-auto px-6 py-4">
                  <p className="mb-2 text-[14px] text-body">{field.label}</p>
                  <table className="w-full min-w-[420px] text-[14px]">
                    <thead>
                      <tr className="text-left text-[11px] tracking-[0.06em] text-body uppercase">
                        <th className="pb-2 font-semibold" />
                        {field.columns.map((c) => (
                          <th key={c.key} className="pb-2 font-semibold">
                            {c.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const grid = gridValues(field, answers);
                        return (
                          <>
                            {grid.rows.map((row) => (
                              <tr key={row.key} className="border-t border-[#f0f0f0]">
                                <td className="py-2 text-charcoal">{row.label}</td>
                                {field.columns.map((c) => (
                                  <td key={c.key} className="py-2 text-charcoal">
                                    {row.values[c.key] || "0"}
                                  </td>
                                ))}
                              </tr>
                            ))}
                            {field.total && (
                              <tr className="border-t border-[#e0e0e0] font-semibold">
                                <td className="py-2 text-charcoal">Total</td>
                                {field.columns.map((c) => (
                                  <td key={c.key} className="py-2 text-charcoal">
                                    {gridTotal(field, grid.totals[c.key])}
                                  </td>
                                ))}
                              </tr>
                            )}
                          </>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              ) : field.kind === "units" ? (
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
