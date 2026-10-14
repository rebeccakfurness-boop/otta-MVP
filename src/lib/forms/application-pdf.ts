import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { BlendMode, PDFDocument, rgb, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";
import type { Field, FormDefinition } from "@/content/forms";
import { site } from "@/content/site";
import { CONFIRM_FIELD, displayValue, gridTotal, gridValues, moneyText, unitRows, visibleSections, type Answers, type GridField } from "./application";

// Draws an online form (building application, travel proposal, ...) as an A4 PDF in Otta branding.
// Used for the broker's "Download PDF" button and the copy attached to the
// email. A form with no answers prints as a blank form for filling by hand.

const hex = (h: string) => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);
const colour = {
  blue: hex("#014c69"),
  teal: hex("#61b9ad"),
  tealText: hex("#2e7d74"),
  charcoal: hex("#303133"),
  body: hex("#5f6368"),
  box: hex("#f1f8f7"),
  boxLine: hex("#bfe1dc"),
  shade: hex("#eef3f2"),
  white: rgb(1, 1, 1),
};

const A4 = { w: 595.28, h: 841.89 };
const M = 40; // page margin
const CONTENT = A4.w - M * 2;
const FOOTER = 46;

type Fonts = { regular: PDFFont; semibold: PDFFont; heading: PDFFont };

export async function buildApplicationPdf(
  form: FormDefinition,
  answers: Answers,
  meta: { reference?: string; brokerage?: string; submittedBy?: string; completedBy?: "broker" | "client" | "public" } = {},
) {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const [regular, semibold, heading, logoBytes] = await Promise.all([
    readFile(path.join(process.cwd(), "src/lib/pdf/fonts/Poppins-Regular.ttf")),
    readFile(path.join(process.cwd(), "src/lib/pdf/fonts/Poppins-SemiBold.ttf")),
    readFile(path.join(process.cwd(), "src/lib/pdf/fonts/Raleway-Bold.ttf")),
    readFile(path.join(process.cwd(), "public/brand/otta-logo.png")),
  ]);
  const fonts: Fonts = {
    regular: await doc.embedFont(regular, { subset: true }),
    semibold: await doc.embedFont(semibold, { subset: true }),
    heading: await doc.embedFont(heading, { subset: true }),
  };
  const logo = await doc.embedPng(logoBytes);
  // Fields the portal fills in for the broker don't count as answers.
  const prefilled = new Set(["broker", "signedDate"]);
  const blank = Object.entries(answers).every(([k, v]) => !v || prefilled.has(k));

  doc.setTitle(form.title);
  doc.setAuthor(site.name);
  doc.setSubject(meta.reference ? `Application ${meta.reference}` : form.title);

  const w = new Writer(doc, fonts, logo, form);

  for (const part of form.parts) {
    w.newPage(part.band);
    const sections = visibleSections(form, answers, blank).filter((s) => s.part === part.id);
    for (const section of sections) {
      w.section(section.title, section.shaded);
      if (section.intro) w.paragraph(section.intro, { font: fonts.semibold, colour: colour.tealText, size: 9.5 });
      for (const field of section.fields) {
        if (field.kind === "units") w.units(field, answers, blank);
        else if (field.kind === "grid") w.grid(field, answers, blank);
        else w.field(field, answers[field.name], blank);
      }
      if (section.note) w.paragraph(`Note: ${section.note}`, { font: fonts.semibold, size: 9 });
      w.endSection();
    }
    if (part.text) {
      w.gap(6);
      for (const block of part.text) {
        if (block.heading) w.section(block.heading);
        if (block.table) w.textTable(block.table.head, block.table.rows);
        for (const p of block.paragraphs ?? []) w.paragraph(p);
        (block.numbered ?? []).forEach((n, i) => w.paragraph(`${i + 1}.  ${n}`));
        for (const b of block.bullets ?? []) w.paragraph(b, { bullet: true });
        w.endSection();
      }
    }
    if (part.signOff) {
      w.gap(4);
      w.signOff(part.signOff, answers, blank);
      if (!blank && answers[CONFIRM_FIELD] === "on") {
        const note =
          meta.completedBy === "client" || meta.completedBy === "public"
            ? "Completed online by the applicant, who confirmed they have read and agree to the declaration."
            : "Submitted online through the Otta Broker Portal. The broker confirmed the applicant has read and agreed to the declaration.";
        w.paragraph(note, {
          size: 8.5,
          colour: colour.body,
        });
      }
    }
  }

  w.footers(meta);
  return doc.save();
}

class Writer {
  page!: PDFPage;
  y = 0;
  private shadeFrom: number | null = null;

  constructor(
    private doc: PDFDocument,
    private f: Fonts,
    private logo: PDFImage,
    private form: FormDefinition,
  ) {}

  newPage(band: string) {
    this.page = this.doc.addPage([A4.w, A4.h]);
    const p = this.page;
    // Logo and address, top right.
    const logoH = 34;
    const logoW = (this.logo.width / this.logo.height) * logoH;
    p.drawImage(this.logo, { x: A4.w - M - logoW, y: A4.h - 30 - logoH, width: logoW, height: logoH });
    const address = [site.address.slice(0, 2).join(", "), site.address[2], "www.ottainsurance.co.nz"];
    address.forEach((line, i) => {
      const font = i === 2 ? this.f.semibold : this.f.regular;
      const width = font.widthOfTextAtSize(line, 8);
      p.drawText(line, { x: A4.w - M - width, y: A4.h - 82 - i * 10.5, size: 8, font, color: colour.charcoal });
    });
    // Title, top left.
    p.drawText(this.form.pdfTitle[0], { x: M, y: A4.h - 66, size: 21, font: this.f.heading, color: colour.blue });
    p.drawText(this.form.pdfTitle[1], { x: M, y: A4.h - 90, size: 21, font: this.f.heading, color: colour.blue });
    // Teal rule over a blue band carrying the page heading.
    const bandTop = A4.h - 124;
    p.drawRectangle({ x: 0, y: bandTop, width: A4.w, height: 4, color: colour.teal });
    p.drawRectangle({ x: 0, y: bandTop - 20, width: A4.w, height: 20, color: colour.blue });
    const bw = this.f.semibold.widthOfTextAtSize(band, 10);
    p.drawText(band, { x: (A4.w - bw) / 2, y: bandTop - 14, size: 10, font: this.f.semibold, color: colour.white });
    this.y = bandTop - 40;
  }

  private continuePage() {
    this.closeShade();
    this.page = this.doc.addPage([A4.w, A4.h]);
    this.page.drawRectangle({ x: 0, y: A4.h - 6, width: A4.w, height: 6, color: colour.teal });
    this.page.drawText(this.form.title, { x: M, y: A4.h - 32, size: 9, font: this.f.semibold, color: colour.blue });
    this.y = A4.h - 56;
  }

  /** Make room for the next element, starting a new page when needed. */
  private need(height: number) {
    if (this.y - height < FOOTER + 10) {
      const shaded = this.shadeFrom !== null;
      this.continuePage();
      if (shaded) this.shadeFrom = this.y + 8;
    }
  }

  gap(n: number) {
    this.y -= n;
  }

  section(title: string, shaded = false) {
    this.need(48);
    if (shaded) this.shadeFrom = this.y + 8;
    this.page.drawText(title, { x: M, y: this.y - 12, size: 12.5, font: this.f.heading, color: colour.tealText });
    this.y -= 24;
  }

  endSection() {
    this.closeShade();
    this.y -= 10;
  }

  private closeShade() {
    if (this.shadeFrom === null) return;
    const top = this.shadeFrom;
    const bottom = this.y - 2;
    // Draw the shade behind what is already on the page.
    this.page.drawRectangle({ x: 0, y: bottom, width: A4.w, height: top - bottom, color: colour.shade, opacity: 1, blendMode: BlendMode.Multiply });
    this.page.drawRectangle({ x: 0, y: bottom - 2, width: A4.w, height: 2, color: colour.teal });
    this.shadeFrom = null;
    this.y -= 6;
  }

  private wrap(text: string, font: PDFFont, size: number, width: number) {
    const lines: string[] = [];
    for (const para of text.split(/\n/)) {
      let line = "";
      for (const word of para.split(/\s+/)) {
        const next = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(next, size) <= width) line = next;
        else {
          if (line) lines.push(line);
          // Break a single over-long word.
          let rest = word;
          while (font.widthOfTextAtSize(rest, size) > width) {
            let i = rest.length;
            while (i > 1 && font.widthOfTextAtSize(rest.slice(0, i), size) > width) i--;
            lines.push(rest.slice(0, i));
            rest = rest.slice(i);
          }
          line = rest;
        }
      }
      lines.push(line);
    }
    return lines;
  }

  paragraph(text: string, opts: { font?: PDFFont; size?: number; colour?: ReturnType<typeof rgb>; bullet?: boolean } = {}) {
    const size = opts.size ?? 9;
    const font = opts.font ?? this.f.regular;
    const indent = opts.bullet ? 14 : 0;
    const lines = this.wrap(text, font, size, CONTENT - indent);
    const lh = size * 1.45;
    for (const [i, line] of lines.entries()) {
      this.need(lh);
      if (opts.bullet && i === 0) this.page.drawText("•", { x: M + 3, y: this.y - size, size, font, color: colour.body });
      this.page.drawText(line, { x: M + indent, y: this.y - size, size, font, color: opts.colour ?? colour.charcoal });
      this.y -= lh;
    }
    this.y -= 4;
  }

  /** A question with its answer box, or yes/no boxes. */
  field(field: Field, value: string | undefined, blank: boolean) {
    const size = 9;
    const labelW = field.kind === "yesno" ? CONTENT - 96 : CONTENT * 0.46;
    const labelLines = this.wrap(field.label, this.f.regular, size, labelW);
    const hintLines = field.hint ? this.wrap(field.hint, this.f.regular, 8, labelW) : [];

    if (field.kind === "yesno") {
      const h = Math.max(20, labelLines.length * 13 + hintLines.length * 11 + 4);
      this.need(h + 4);
      this.drawLabel(labelLines, hintLines, this.y);
      this.yesNo(A4.w - M - 88, this.y - 2, blank ? undefined : value);
      this.y -= h + 4;
      return;
    }

    const boxX = M + labelW + 10;
    const boxW = CONTENT - labelW - 10;
    // A blank form lists the choices so they can be circled by hand.
    const shown = blank ? (field.kind === "choice" ? field.options.join("  /  ") : "") : displayValue(field, value);
    const valueLines = shown ? this.wrap(shown, this.f.regular, size, boxW - 12) : [""];
    const minBox = field.kind === "textarea" ? 54 : 18;
    const boxH = Math.max(minBox, valueLines.length * 12.5 + 6);
    const h = Math.max(boxH, labelLines.length * 13 + hintLines.length * 11);
    this.need(h + 6);
    this.drawLabel(labelLines, hintLines, this.y);
    this.page.drawRectangle({ x: boxX, y: this.y - boxH, width: boxW, height: boxH, color: colour.box, borderColor: colour.boxLine, borderWidth: 0.6 });
    valueLines.forEach((line, i) =>
      this.page.drawText(line, {
        x: boxX + 6,
        y: this.y - 12.5 - i * 12.5,
        size,
        font: this.f.regular,
        color: blank ? colour.body : colour.charcoal,
      }),
    );
    this.y -= h + 6;
  }

  private drawLabel(lines: string[], hint: string[], top: number) {
    lines.forEach((l, i) => this.page.drawText(l, { x: M, y: top - 12 - i * 13, size: 9, font: this.f.regular, color: colour.charcoal }));
    hint.forEach((l, i) =>
      this.page.drawText(l, { x: M, y: top - 12 - lines.length * 13 - i * 11, size: 8, font: this.f.regular, color: colour.body }),
    );
  }

  private yesNo(x: number, top: number, value: string | undefined) {
    (["yes", "no"] as const).forEach((option, i) => {
      const bx = x + i * 46;
      const on = value === option;
      this.page.drawRectangle({
        x: bx,
        y: top - 17,
        width: 42,
        height: 17,
        color: on ? colour.teal : colour.white,
        borderColor: on ? colour.teal : colour.boxLine,
        borderWidth: 0.8,
      });
      const t = option.toUpperCase();
      const font = on ? this.f.semibold : this.f.regular;
      const tw = font.widthOfTextAtSize(t, 8.5);
      this.page.drawText(t, { x: bx + (42 - tw) / 2, y: top - 12, size: 8.5, font, color: on ? colour.white : colour.body });
    });
  }

  units(field: Extract<Field, { kind: "units" }>, answers: Answers, blank: boolean) {
    const rows = blank ? Array.from({ length: 6 }, () => ({}) as Record<string, string>) : unitRows(field, answers);
    const colW = CONTENT / field.columns.length;
    const rowH = 20;
    this.need(rowH * 2 + 6);
    const header = () => {
      this.page.drawRectangle({ x: M, y: this.y - rowH, width: CONTENT, height: rowH, color: colour.shade, borderColor: colour.blue, borderWidth: 1 });
      field.columns.forEach((c, i) => {
        const tw = this.f.semibold.widthOfTextAtSize(c.label, 9.5);
        this.page.drawText(c.label, { x: M + i * colW + (colW - tw) / 2, y: this.y - 14, size: 9.5, font: this.f.semibold, color: colour.blue });
      });
      this.y -= rowH;
    };
    header();
    for (const row of rows) {
      if (this.y - rowH < FOOTER + 10) {
        this.continuePage();
        header();
      }
      field.columns.forEach((c, i) => {
        this.page.drawRectangle({ x: M + i * colW, y: this.y - rowH, width: colW, height: rowH, color: colour.white, borderColor: colour.boxLine, borderWidth: 0.6 });
        const raw = row[c.key] ?? "";
        const text = c.kind === "money" && raw ? moneyText(raw) : raw;
        const tw = this.f.regular.widthOfTextAtSize(text, 9);
        this.page.drawText(text, { x: M + i * colW + (colW - tw) / 2, y: this.y - 13.5, size: 9, font: this.f.regular, color: colour.charcoal });
      });
      this.y -= rowH;
    }
    this.y -= 8;
  }

  /** A fixed table of numbers with row labels and an optional totals row. */
  grid(field: GridField, answers: Answers, blank: boolean) {
    const { rows, totals } = gridValues(field, answers);
    const labelW = CONTENT * 0.34;
    const colW = (CONTENT - labelW) / field.columns.length;
    const rowH = 19;
    const headerLines = field.columns.map((c) => this.wrap(c.label, this.f.semibold, 8.5, colW - 8));
    const headH = Math.max(...headerLines.map((l) => l.length)) * 11 + 10;
    this.need(14 + headH + rowH * 2);
    this.page.drawText(field.label, { x: M, y: this.y - 10, size: 9, font: this.f.regular, color: colour.charcoal });
    this.y -= 16;
    const header = () => {
      this.page.drawRectangle({ x: M, y: this.y - headH, width: CONTENT, height: headH, color: colour.shade, borderColor: colour.blue, borderWidth: 1 });
      headerLines.forEach((lines, i) =>
        lines.forEach((l, j) => {
          const tw = this.f.semibold.widthOfTextAtSize(l, 8.5);
          this.page.drawText(l, { x: M + labelW + i * colW + (colW - tw) / 2, y: this.y - 13 - j * 11, size: 8.5, font: this.f.semibold, color: colour.blue });
        }),
      );
      this.y -= headH;
    };
    header();
    const drawRow = (label: string, values: string[], bold = false) => {
      if (this.y - rowH < FOOTER + 10) {
        this.continuePage();
        header();
      }
      const font = bold ? this.f.semibold : this.f.regular;
      this.page.drawRectangle({ x: M, y: this.y - rowH, width: labelW, height: rowH, color: colour.white, borderColor: colour.boxLine, borderWidth: 0.6 });
      this.page.drawText(label, { x: M + 6, y: this.y - 13, size: 9, font, color: colour.charcoal });
      values.forEach((v, i) => {
        this.page.drawRectangle({ x: M + labelW + i * colW, y: this.y - rowH, width: colW, height: rowH, color: bold ? colour.shade : colour.white, borderColor: colour.boxLine, borderWidth: 0.6 });
        const tw = font.widthOfTextAtSize(v, 9);
        this.page.drawText(v, { x: M + labelW + i * colW + (colW - tw) / 2, y: this.y - 13, size: 9, font, color: colour.charcoal });
      });
      this.y -= rowH;
    };
    const cell = (v: string) => {
      const n = Number(v.replace(/[$,\s]/g, ""));
      return field.money && v && Number.isFinite(n) ? gridTotal(field, n) : v;
    };
    for (const row of rows) drawRow(row.label, field.columns.map((c) => (blank ? "" : cell(row.values[c.key]))));
    if (field.total) drawRow("Total", field.columns.map((c) => (blank ? "" : gridTotal(field, totals[c.key]))), true);
    this.y -= 10;
  }

  /** A comparison table with wrapped cells; the first column is the row label. */
  textTable(head: string[], rows: string[][]) {
    const firstW = CONTENT * 0.24;
    const colW = (CONTENT - firstW) / (head.length - 1);
    const widths = head.map((_, i) => (i === 0 ? firstW : colW));
    const xs = widths.map((_, i) => M + widths.slice(0, i).reduce((a, b) => a + b, 0));
    const draw = (cells: string[], header: boolean) => {
      const font = header ? this.f.semibold : this.f.regular;
      const lines = cells.map((c, i) => this.wrap(c, i === 0 && !header ? this.f.semibold : font, 8.5, widths[i] - 10));
      const h = Math.max(...lines.map((l) => l.length)) * 11 + 9;
      this.need(h);
      cells.forEach((_, i) => {
        this.page.drawRectangle({
          x: xs[i],
          y: this.y - h,
          width: widths[i],
          height: h,
          color: header ? colour.blue : i === 0 ? colour.shade : colour.white,
          borderColor: colour.boxLine,
          borderWidth: 0.6,
        });
        lines[i].forEach((l, j) =>
          this.page.drawText(l, {
            x: xs[i] + 5,
            y: this.y - 13 - j * 11,
            size: 8.5,
            font: header || i === 0 ? this.f.semibold : this.f.regular,
            color: header ? colour.white : colour.charcoal,
          }),
        );
      });
      this.y -= h;
    };
    draw(head, true);
    for (const row of rows) draw(row, false);
    this.y -= 10;
  }

  signOff(fields: Field[], answers: Answers, blank: boolean) {
    this.need(46);
    const gap = 12;
    const colW = (CONTENT - gap * (fields.length - 1)) / fields.length;
    fields.forEach((field, i) => {
      const x = M + i * (colW + gap);
      this.page.drawText(field.label, { x, y: this.y - 10, size: 9, font: this.f.semibold, color: colour.tealText });
      this.page.drawRectangle({ x, y: this.y - 40, width: colW, height: 24, color: colour.box, borderColor: colour.boxLine, borderWidth: 0.6 });
      const value = blank ? "" : displayValue(field, answers[field.name]);
      const font = field.name === "signature" ? this.f.heading : this.f.regular;
      if (value) this.page.drawText(this.wrap(value, font, 10, colW - 12)[0], { x: x + 6, y: this.y - 32, size: 10, font, color: colour.charcoal });
    });
    this.y -= 54;
  }

  footers(meta: { reference?: string; brokerage?: string; submittedBy?: string }) {
    const pages = this.doc.getPages();
    const left = [meta.reference && `Reference ${meta.reference}`, meta.brokerage, meta.submittedBy].filter(Boolean).join("  ·  ");
    pages.forEach((p, i) => {
      p.drawRectangle({ x: 0, y: 0, width: A4.w, height: 24, color: colour.blue });
      if (left) p.drawText(left, { x: M, y: 8.5, size: 7.5, font: this.f.regular, color: colour.white });
      const right = `Page ${i + 1} of ${pages.length}`;
      const rw = this.f.regular.widthOfTextAtSize(right, 7.5);
      p.drawText(right, { x: A4.w - M - rw, y: 8.5, size: 7.5, font: this.f.regular, color: colour.white });
    });
  }
}
