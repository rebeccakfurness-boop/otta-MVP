"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/portal/Icon";
import { uploadsCopy as copy } from "@/content/forms/uploads";

const MAX_FILES = 10;
const MAX_TOTAL = 4 * 1024 * 1024;
const ACCEPT = "image/*,application/pdf,.doc,.docx,.xls,.xlsx,.csv,.txt";
const OK_TYPE = /^(image\/|application\/pdf|application\/msword|application\/vnd\.openxmlformats|application\/vnd\.ms-excel|text\/(plain|csv))/;

const size = (b: number) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

/** Shrinks a large photo to at most 1800px as a JPEG, so more fit under the limit. Other files pass through. */
async function shrink(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size < 400 * 1024) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.82));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.(png|webp|jpe?g)$/i, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

/** Supporting documents for an online form. The files ride with the form in a hidden file input named "attachments". */
export function AttachmentsInput({ hint }: { hint: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);

  const sync = (next: File[]) => {
    setFiles(next);
    if (input.current) {
      const dt = new DataTransfer();
      next.forEach((f) => dt.items.add(f));
      input.current.files = dt.files;
    }
  };

  async function add(list: FileList | null) {
    if (!list?.length) return;
    setBusy(true);
    setMessage("");
    let next = [...files];
    for (const raw of Array.from(list)) {
      if (!OK_TYPE.test(raw.type)) {
        setMessage(copy.wrongType(raw.name));
        continue;
      }
      if (next.length >= MAX_FILES) {
        setMessage(copy.tooMany);
        break;
      }
      const file = await shrink(raw);
      if (next.reduce((n, f) => n + f.size, 0) + file.size > MAX_TOTAL) {
        setMessage(copy.tooBig);
        continue;
      }
      next = [...next, file];
    }
    sync(next);
    setBusy(false);
  }

  const total = files.reduce((n, f) => n + f.size, 0);
  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          add(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center gap-2 border-2 border-dashed px-6 py-7 text-center transition-colors ${over ? "border-site-teal bg-[#f1f8f7]" : "border-[#d9d9d9]"}`}
      >
        <Icon name="plus" className="h-6 w-6 text-site-teal" />
        <p className="text-[14px] text-charcoal">
          <label className="cursor-pointer font-medium text-[#2e7d74] underline-offset-2 hover:underline">
            {busy ? "Adding" : copy.choose}
            <input
              type="file"
              multiple
              accept={ACCEPT}
              className="sr-only"
              onChange={(e) => {
                add(e.target.files);
                e.target.value = "";
              }}
            />
          </label>{" "}
          {copy.drop}
        </p>
        <p className="text-[13px] text-body">{hint}</p>
        <p className="text-[12px] text-[#8a8a8a]">{copy.limits}</p>
      </div>
      {/* What the form actually sends. */}
      <input ref={input} type="file" name="attachments" multiple hidden tabIndex={-1} aria-hidden />
      {message && <p className="mt-2 text-[13px] text-site-purple">{message}</p>}
      {files.length > 0 && (
        <ul className="mt-3 divide-y divide-[#eee] border border-[#eaeaea]">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center gap-3 px-4 py-2.5 text-[14px]">
              <Icon name="documents" className="h-4 w-4 shrink-0 text-site-teal" />
              <span className="min-w-0 flex-1 truncate text-charcoal">{f.name}</span>
              <span className="text-[12px] text-body">{size(f.size)}</span>
              <button type="button" onClick={() => sync(files.filter((_, j) => j !== i))} className="text-[12px] font-medium text-site-purple hover:underline">
                {copy.remove}
              </button>
            </li>
          ))}
          <li className="px-4 py-2 text-right text-[12px] text-body">
            {files.length} {files.length === 1 ? "document" : "documents"}, {size(total)} of 4 MB
          </li>
        </ul>
      )}
    </div>
  );
}
