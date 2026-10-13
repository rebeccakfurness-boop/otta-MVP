import "server-only";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import ExcelJS from "exceljs";
import { floodMapsFor } from "@/content/flood-maps";
import { displayValue, unitRows, visibleSections, type Answers } from "@/lib/forms/building-application";
import { nzRegion } from "@/lib/nz-region";
import { brokerages, users } from "@/lib/portal/demo-data";

// The property underwriting worksheet (UW Notes, V13, 1 July 2026), pre-filled
// from an online building insurance application for the email to Otta.
//
// The workbook is built here in Otta branding with the same layout and cell
// positions as the original: yellow boxes are filled from the application,
// peach boxes are the underwriter's settings, and totals are formulas. If the
// original rating workbook is saved at TEMPLATE it is filled in place instead
// (keeping its own formulas), using the same cell positions.

const TEMPLATE = path.join(process.cwd(), "src/lib/uw/uw-worksheet-template.xlsx");
const LOGO = path.join(process.cwd(), "public/brand/otta-logo.png");

export type WorksheetMeta = { reference: string; brokerageName: string; brokerName: string; createdAt: string };

/** Splits "12 Rata Street, Mount Eden, Auckland 1024" into its parts. */
export function splitAddress(address = "") {
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  let postcode = "";
  const m = /^(.*?)\s*(\d{4})$/.exec(parts.at(-1) ?? "");
  if (m) {
    postcode = m[2];
    if (m[1]) parts[parts.length - 1] = m[1];
    else parts.pop();
  }
  return {
    street: parts[0] ?? "",
    suburb: parts.length > 2 ? parts.slice(1, -1).join(", ") : "",
    city: parts.length > 1 ? parts.at(-1)! : "",
    postcode,
  };
}

/** Region and flood map links for the insured property. */
export function propertyLocation(answers: Answers) {
  const loc = splitAddress(answers.propertyAddress);
  const region = nzRegion(`${loc.suburb}, ${loc.city}`, loc.postcode);
  return { ...loc, region, flood: floodMapsFor(region) };
}

const money = (v?: string) => {
  const n = Number((v ?? "").replace(/[$,\s]/g, ""));
  return v && Number.isFinite(n) ? n : null;
};
const isoDate = (v?: string) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? new Date(`${v}T00:00:00Z`) : null);

type CellValue = string | number | Date | null;

/** The yellow boxes the application fills, by cell. */
export function worksheetValues(a: Answers, meta: WorksheetMeta): Record<string, CellValue> {
  const loc = propertyLocation(a);
  const multi = a.isMultiUnit === "yes";
  const notes = underwritingNotes(a, meta).split("\n");
  return {
    C7: a.isSocialHousing === "yes" ? "Social Housing Insurance" : "Rental Property Insurance",
    C11: meta.brokerageName,
    C12: meta.brokerName,
    C25: a.insuredName ?? "",
    C26: isoDate(a.inceptionDate),
    F25: a.mortgage === "yes" && a.mortgagee ? a.mortgagee : "Nil",
    C31: loc.street,
    C32: loc.suburb,
    C33: loc.city,
    C34: loc.postcode,
    C35: loc.region,
    C37: money(multi && a.unitsSumInsured ? a.unitsSumInsured : a.sumInsured),
    C38: Number(multi ? a.unitsTotal : a.selfContainedUnits) || null,
    C56: money(a.chattelsValue),
    // Notes run down the eight Location 1 note boxes.
    ...Object.fromEntries(Array.from({ length: 8 }, (_, i) => [`C${41 + i}`, i < 7 ? (notes[i] ?? null) : notes.slice(7).join(" ") || null])),
  };
}

/** The application's other answers, one line per topic, for the Notes boxes. */
export function underwritingNotes(a: Answers, meta: WorksheetMeta) {
  const skip = new Set([
    "insuredName", "dateOfBirth", "mailingAddress", "postCode", "phone", "email", "broker", "propertyManager", "inceptionDate",
    "propertyAddress", "sumInsured", "mortgage", "mortgagee", "chattelsValue", "signature", "signatoryName", "signedDate",
    "isMultiUnit", "isSocialHousing", "isMortgageeSale", "unitsTotal", "unitsSumInsured",
  ]);
  const short = (label: string) =>
    label
      .replace(/\?$/, "")
      .replace(/^In the last 3 years have you suffered any losses.*$/i, "Losses in last 3 years")
      .replace(/^Subject to the Criminal Records.*$/i, "Criminal convictions")
      .replace(/^In the past 10 years have you been bankrupt.*$/i, "Bankrupt in last 10 years")
      .replace(/^Have you ever had an insurance policy declined.*$/i, "Previous decline, cancellation or claim rejected")
      .replace(/^External and internal inspection.*$/i, "6 monthly inspections")
      .replace(/^A written record of the outcome.*$/i, "Written inspection records")
      .replace(/^Can you confirm the house is structurally sound.*$/i, "Structurally sound and watertight")
      .replace(/^Are there any identified natural hazards.*$/i, "Natural hazards at site")
      .replace(/^What best describes the property$/i, "Property type")
      .replace(/^Number of self-contained units within the property$/i, "Self-contained units")
      .replace(/^Size \(SQM\) including internal garages and basements$/i, "Internal SQM")
      .replace(/^Size \(SQM\) of external garages and sheds$/i, "External SQM")
      .replace(/^Does the property have any recreational features$/i, "Recreational features")
      .replace(/^Does the property have garden or retaining walls over \$25,000$/i, "Retaining walls over $25k")
      .replace(/^What year was the property built$/i, "Year built");
  const lines = [`Online application ${meta.reference}${a.propertyManager ? `. Property manager: ${a.propertyManager}` : ""}`];
  for (const section of visibleSections(a)) {
    const items: string[] = [];
    for (const field of section.fields) {
      if (skip.has(field.name)) continue;
      if (field.kind === "units") {
        unitRows(field, a).forEach((row) => items.push(`${row.unit} ${displayValue({ kind: "money", name: "", label: "" }, row.sumInsured)} ${row.sqm}sqm`));
        continue;
      }
      const value = displayValue(field, a[field.name]);
      if (value) items.push(`${short(field.label)}: ${value}`);
    }
    if (items.length) lines.push(`${section.title.replace(/, please complete the following section$/, "")}: ${items.join("; ")}`);
  }
  return lines.join("\n");
}

const exists = (p: string) => access(p).then(() => true, () => false);

export async function buildWorksheet(answers: Answers, meta: WorksheetMeta) {
  const values = worksheetValues(answers, meta);
  const wb = new ExcelJS.Workbook();
  if (await exists(TEMPLATE)) {
    await wb.xlsx.load((await readFile(TEMPLATE)) as unknown as ExcelJS.Buffer);
    const ws = wb.worksheets[0];
    for (const [cell, value] of Object.entries(values)) if (value !== null && value !== "") ws.getCell(cell).value = value;
  } else {
    await buildOttaWorksheet(wb, values, answers, meta);
  }
  wb.calcProperties.fullCalcOnLoad = true;
  return { name: `Otta-UW-Worksheet-${meta.reference}.xlsx`, content: new Uint8Array(await wb.xlsx.writeBuffer()) };
}

// --- The Otta-branded worksheet ---

const C = {
  teal: "FF61B9AD",
  tealDark: "FF2E7D74",
  yellow: "FFFFFF00",
  peach: "FFE6F4F2", // the original's peach "settings" boxes, in pale Otta teal
  peachLine: "FF85C6BD",
  yellowLine: "FF61B9AD",
  red: "FFD0021B",
  grey: "FF777777",
  charcoal: "FF303133",
};
const FONT = "Arial";
const NZD = '"$"#,##0';
const NZD2 = '"$"#,##0.00';
const DATE = "d mmmm yyyy";

async function buildOttaWorksheet(wb: ExcelJS.Workbook, v: Record<string, CellValue>, answers: Answers, meta: WorksheetMeta) {
  wb.creator = "Otta";
  wb.title = `UW Notes ${meta.reference}`;
  const ws = wb.addWorksheet("UW Notes", {
    views: [{ showGridLines: false }],
    pageSetup: { paperSize: 9, orientation: "portrait", fitToPage: true, fitToWidth: 1, fitToHeight: 0, printArea: "A1:G101" },
  });
  ws.columns = [{ width: 2 }, { width: 34 }, { width: 25 }, { width: 25 }, { width: 25 }, { width: 25 }, { width: 3 }, { width: 22 }, { width: 22 }];

  const font = (o: Partial<ExcelJS.Font> = {}): Partial<ExcelJS.Font> => ({ name: FONT, size: 11, color: { argb: C.charcoal }, ...o });
  const set = (addr: string, value: CellValue | { formula: string }, o: { bold?: boolean; numFmt?: string; align?: ExcelJS.Alignment["horizontal"]; color?: string; size?: number; italic?: boolean } = {}) => {
    const c = ws.getCell(addr);
    c.value = value as ExcelJS.CellValue;
    c.font = font({ bold: o.bold, size: o.size, italic: o.italic, color: o.color ? { argb: o.color } : undefined });
    if (o.numFmt) c.numFmt = o.numFmt;
    if (o.align) c.alignment = { horizontal: o.align, vertical: "middle" };
    return c;
  };
  const label = (addr: string, text: string, o: { size?: number; align?: ExcelJS.Alignment["horizontal"] } = {}) => set(addr, text, { bold: true, ...o });
  const box = (addr: string, kind: "yellow" | "peach", value: CellValue | { formula: string } = null, numFmt?: string, align?: ExcelJS.Alignment["horizontal"]) => {
    const c = set(addr, value, { numFmt, align });
    const line = { style: "medium" as const, color: { argb: kind === "yellow" ? C.yellowLine : C.peachLine } };
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: kind === "yellow" ? C.yellow : C.peach } };
    c.border = { top: line, bottom: line, left: line, right: line };
    return c;
  };
  const band = (row: number, text: string, from = "B", to = "F") => {
    for (const col of "BCDEF".slice("BCDEF".indexOf(from), "BCDEF".indexOf(to) + 1)) {
      ws.getCell(`${col}${row}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.teal } };
    }
    set(`${from}${row}`, text, { bold: true, color: "FFFFFFFF", size: 12 });
    ws.getRow(row).height = 20;
  };
  const rule = (row: number, cols: string) => {
    for (const col of cols) ws.getCell(`${col}${row}`).border = { top: { style: "thin", color: { argb: C.charcoal } } };
  };

  // Logo, top right.
  try {
    const logo = wb.addImage({ buffer: (await readFile(LOGO)) as unknown as ExcelJS.Buffer, extension: "png" });
    ws.addImage(logo, { tl: { col: 4.6, row: 0.6 }, ext: { width: 190, height: 71 } });
  } catch {
    set("F2", "otta", { bold: true, size: 28, color: C.teal, align: "right" });
  }

  // Sign-off
  label("B2", "Processed by");
  box("C2", "peach");
  label("B3", "Underwriter");
  box("C3", "peach");
  label("B4", "Authoriser");
  box("C4", "peach");

  // Risk type
  label("E6", "Policy Type Modifier");
  label("B7", "Risk Type", { size: 14 });
  ws.mergeCells("C7:D7");
  box("C7", "yellow", v.C7, undefined, "center").font = font({ bold: true, size: 14 });
  set("E7", 0, { bold: true, numFmt: "0%", align: "center" });
  ws.getRow(7).height = 24;

  // Broker details
  band(9, "Broker Details");
  set("H9", "Paste photos of property here", { italic: true, color: C.tealDark });
  const brokerRows: [number, string, string][] = [
    [11, "Broking firm", "C11"],
    [12, "Broker", "C12"],
    [13, "Street Address (Number Name)", "C13"],
    [14, "City", "C14"],
    [15, "Post Code", "C15"],
  ];
  for (const [row, text, cell] of brokerRows) {
    label(`B${row}`, text);
    box(cell, "yellow", v[cell] ?? null);
  }
  const binder: [number, string, CellValue, string?][] = [
    [11, "Version:", "#13, 1 July 2026"],
    [12, "Quote Date & Time:", new Date(meta.createdAt), "d/mm/yyyy h:mm"],
    [13, "Binder:", "B1216CS2500026"],
    [14, "Binder Start Date:", new Date("2025-10-23T00:00:00Z"), "d/mm/yyyy"],
    [15, "Binder End Date:", new Date("2026-12-01T00:00:00Z"), "d/mm/yyyy"],
  ];
  for (const [row, text, value, fmt] of binder) {
    label(`E${row}`, text, { align: "right" });
    set(`F${row}`, value, { numFmt: fmt, align: "right" });
  }

  // Commission and fees / Landlord quote
  band(17, "Commission and Fees", "B", "C");
  band(17, "Landlord Quote", "E", "F");
  label("B19", "Commission");
  box("C19", "peach", 0.15, "0%");
  label("B20", "Underwriter Fee");
  box("C20", "peach", 120, NZD);
  set("D20", "GST Exclusive");
  label("E19", "Landlord Cover Type");
  box("F19", "peach", "Protect +");
  label("E20", "Meth level");
  box("F20", "peach", "1.5mcg");
  label("E21", "Additional Contents SI");
  box("F21", "peach", 0, NZD);

  // Insured and properties
  band(23, "Details of the Insured and the Properties");
  label("B25", "The Insured");
  box("C25", "yellow", v.C25);
  label("B26", "Inception Date");
  box("C26", "yellow", v.C26, DATE);
  set("D26", { formula: 'IF(C26="","",IF(OR(C26<F14,C26>F15),"ERROR - Outside Binder Period",""))' }, { bold: true, color: C.red });
  label("B27", "Expiry Date");
  set("C27", { formula: 'IF(C26="","",EDATE(C26,12))' }, { numFmt: DATE });
  label("E25", "Interested Party");
  box("F25", "yellow", v.F25, undefined, "right");
  label("E26", "Intentional Damage");
  box("F26", "peach", 50000, NZD, "right");
  label("E27", "Loading/Discount");
  set("F27", 0, { numFmt: "0%", align: "right" });
  label("E28", "Other load/disc");
  box("F28", "peach", 0, "0%", "right");
  set("G28", { formula: 'IF(F28<>0,"Please enter rationale in Underwriting Notes","")' }, { bold: true, color: C.red });

  ["C", "D", "E", "F"].forEach((col, i) => label(`${col}30`, `Location ${i + 1}`));
  const locRows: [number, string, string?][] = [
    [31, "Street Address (Number Name)"],
    [32, "Suburb"],
    [33, "City"],
    [34, "Post Code"],
    [35, "Region"],
    [37, "Sum Insured", NZD],
    [38, "Number of Units"],
  ];
  for (const [row, text, fmt] of locRows) {
    label(`B${row}`, text);
    box(`C${row}`, "yellow", v[`C${row}`] ?? null, fmt);
    for (const col of "DEF") box(`${col}${row}`, "peach", null, fmt);
  }
  label("B39", "Sum Insured per Unit");
  for (const col of "CDEF") {
    const c = set(`${col}39`, { formula: `IF(OR(${col}37="",N(${col}38)=0),"",${col}37/${col}38)` }, { numFmt: NZD });
    if (col === "C") c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.yellow } };
  }

  label("B41", "Notes");
  for (let r = 41; r <= 48; r++) {
    box(`C${r}`, "yellow", v[`C${r}`] ?? null).alignment = { wrapText: false, vertical: "middle" };
    for (const col of "DEF") box(`${col}${r}`, "peach");
  }

  // Policy settings
  label("B49", "Subjectivity");
  box("C49", "peach", "Nil");
  label("B50", "Endorsements");
  box("C50", "peach", "Nil");
  label("B52", "Excess");
  box("C52", "peach", 1000, NZD);
  label("B53", "Flood Excess");
  box("C53", "peach", 1000, NZD);
  label("E53", "Fire Service levy");
  label("B54", "Capital additions (CA)");
  box("C54", "peach", 100000, NZD);
  set("D54", "Maximum of $100,000");
  set("E54", 0, { numFmt: NZD2 });
  label("B55", "Property under construction (PUC)");
  box("C55", "peach", 100000, NZD);
  set("D55", "Maximum of $100,000");
  set("E55", 0, { numFmt: NZD2 });
  label("B56", "Landlords Chattels (LC)");
  box("C56", "yellow", v.C56 ?? 20000, NZD);
  set("D56", "Maximum of $50,000");
  set("E56", { formula: "C56*Rates!$C$4/100" }, { numFmt: NZD2 });

  // Premium per unit (premium is the underwriter's rate; levies are calculated)
  band(58, "Premium per unit");
  label("B60", "Premium per unit");
  label("B61", "NHI levy per unit");
  label("B62", "FSL (incl LC) per unit");
  label("B64", "Total per unit (excl GST)");
  rule(64, "BCDEF");
  for (const col of "CDEF") {
    box(`${col}60`, "peach", 0, NZD2);
    set(`${col}61`, { formula: `IF(N(${col}39)=0,0,MIN(${col}39,Rates!$C$6)*Rates!$C$5/100)` }, { numFmt: NZD2 });
    set(`${col}62`, { formula: `IF(N(${col}39)=0,0,MIN(${col}39,Rates!$C$7)*Rates!$C$4/100${col === "C" ? "+$E$56/MAX(1,N(C38))" : ""})` }, { numFmt: NZD2 });
    set(`${col}64`, { formula: `SUM(${col}60:${col}62)` }, { numFmt: NZD2 });
  }

  band(66, "Premium per location");
  label("B68", "Premium per location");
  label("B69", "NHI per location");
  label("B70", "FSL (incl LC) per location");
  label("B71", "Number of units");
  label("B73", "Total per location (excl GST)");
  rule(73, "BCDEF");
  for (const col of "CDEF") {
    set(`${col}68`, { formula: `${col}60*${col}71` }, { numFmt: NZD2 });
    set(`${col}69`, { formula: `${col}61*${col}71` }, { numFmt: NZD2 });
    set(`${col}70`, { formula: `${col}62*${col}71` }, { numFmt: NZD2 });
    set(`${col}71`, { formula: `N(${col}38)` });
    set(`${col}73`, { formula: `SUM(${col}68:${col}70)` }, { numFmt: NZD2 });
  }

  band(75, "Total Premium");
  label("B77", "Underwriter fee");
  set("C77", { formula: "C20" }, { numFmt: NZD2 });
  label("B78", "FSL (CA & PUC)");
  set("C78", { formula: "E54+E55" }, { numFmt: NZD2 });
  label("B80", "Total (excl GST)");
  set("C80", { formula: "SUM(C73:F73)+C77+C78" }, { numFmt: NZD2 });
  label("B81", "GST");
  set("C81", { formula: "ROUND(C80*Rates!$C$8,2)" }, { numFmt: NZD2 });
  rule(82, "BCD");
  label("B82", "Total (incl GST)");
  set("C82", { formula: "C80+C81" }, { numFmt: NZD2, bold: true });

  band(84, "Underwriter use only: notes and rationale");
  ws.mergeCells("B86:F93");
  box("B86", "yellow").alignment = { wrapText: true, vertical: "top" };

  // Flood mapping links for this address
  const loc = propertyLocation(answers);
  label("B95", "Flood mapping");
  const link = (addr: string, text: string, url: string) => {
    const c = ws.getCell(addr);
    c.value = { text, hyperlink: url };
    c.font = font({ underline: true, color: { argb: C.tealDark } });
  };
  link("C95", loc.flood.national.name, loc.flood.national.url);
  link("C96", `${loc.region || "Regional"}: ${loc.flood.regional.name}`, loc.flood.regional.url);

  // Quote register
  set("B98", "Quote Register", { bold: true }).font = font({ bold: true, underline: true });
  ["Name", "Address", "Broker Name", "Inception Date", "Processed by", "Preparation Date"].forEach((h, i) => label(`${"BCDEFG"[i]}99`, h));
  const reg: [string, string, string?][] = [
    ["B100", 'IF(C25="","",C25)'],
    ["C100", 'C31&IF(C32<>"",", "&C32,"")&IF(C33<>"",", "&C33,"")'],
    ["D100", 'IF(C12="","",C12)'],
    ["E100", 'IF(C26="","",C26)', "d/mm/yyyy"],
    ["F100", 'IF(C2="","",C2)'],
    ["G100", "F12", "d/mm/yyyy"],
  ];
  for (const [addr, formula, fmt] of reg) {
    const c = set(addr, { formula }, { numFmt: fmt });
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.yellow } };
  }

  // Rates used by the levy formulas (editable).
  const rates = wb.addWorksheet("Rates", { views: [{ showGridLines: false }] });
  rates.columns = [{ width: 2 }, { width: 46 }, { width: 16 }, { width: 60 }];
  rates.getCell("B2").value = "Rates used by the UW Notes formulas";
  rates.getCell("B2").font = font({ bold: true, size: 13, color: { argb: C.tealDark } });
  const rateRows: [number, string, number, string, string][] = [
    [4, "Fire and Emergency levy (FSL), $ per $100", 0.1074, "0.0000", "From the V13 worksheet (LC $20,000 = $21.48). Confirm the current FENZ rate."],
    [5, "Natural Hazards (NHI) levy, $ per $100", 0.16, "0.00", "Confirm the current Natural Hazards Commission levy rate."],
    [6, "NHI levy cap per dwelling", 300000, NZD, "Confirm the current cap."],
    [7, "FSL cap per dwelling", 100000, NZD, "Confirm the current cap."],
    [8, "GST", 0.15, "0%", ""],
  ];
  for (const [row, text, value, fmt, note] of rateRows) {
    rates.getCell(`B${row}`).value = text;
    rates.getCell(`B${row}`).font = font({ bold: true });
    const c = rates.getCell(`C${row}`);
    c.value = value;
    c.numFmt = fmt;
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.peach } };
    c.font = font();
    rates.getCell(`D${row}`).value = note;
    rates.getCell(`D${row}`).font = font({ italic: true, color: { argb: C.grey }, size: 10 });
  }

  // Broker list
  const list = wb.addWorksheet("Broker List", { views: [{ showGridLines: false, state: "frozen", ySplit: 1 }] });
  list.columns = [
    { header: "Broking firm", width: 32 },
    { header: "Broker", width: 26 },
    { header: "Email", width: 34 },
  ];
  list.getRow(1).eachCell((c) => {
    c.font = font({ bold: true, color: { argb: "FFFFFFFF" } });
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.teal } };
  });
  for (const u of users) list.addRow([brokerages.find((b) => b.id === u.brokerageId)?.name ?? "", u.name, u.email]).font = font();

  ws.eachRow((row) => {
    if (!row.height) row.height = 17;
  });
}
