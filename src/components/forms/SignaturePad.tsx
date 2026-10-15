"use client";

import { useEffect, useRef, useState } from "react";
import { sigImage, sigMethod } from "@/lib/forms/application";

const W = 600;
const H = 160;
const INK = "#1f2a44";

/**
 * An electronic signature: the signer's printed name, plus a signature drawn
 * with a finger, pen or mouse, or typed. Either way the form carries a PNG of
 * the signature (hidden input `<name>__sig`), which goes into the PDF; the
 * server stamps the time it was signed when the form is submitted.
 */
export function SignaturePad({
  name,
  inputProps,
  invalid,
  onSigned,
}: {
  name: string;
  /** Props for the printed name input (id, aria attributes, default value). */
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  invalid: boolean;
  /** Called when the signature changes, so the form can re-check its answers. */
  onSigned?: () => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  // The signature as a PNG data URL. Kept in state: a hidden input's value would be reset on re-render.
  const [signature, setSignature] = useState("");
  const [mode, setMode] = useState<"draw" | "type">("draw");
  const [typed, setTyped] = useState(String(inputProps.defaultValue ?? ""));
  const [hasInk, setHasInk] = useState(false);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  const ctx = () => canvas.current?.getContext("2d") ?? null;
  const setImage = (value: string) => setSignature(value);
  // Tell the form once the new signature is in the DOM, so it re-checks its answers.
  const signedOnce = useRef(false);
  useEffect(() => {
    if (!signedOnce.current && !signature) return;
    signedOnce.current = true;
    onSigned?.();
    // onSigned is a fresh function on every render of the form; only the signature matters here.
  }, [signature]); // eslint-disable-line react-hooks/exhaustive-deps
  const clear = () => {
    const c = ctx();
    if (c) c.clearRect(0, 0, W, H);
    setHasInk(false);
    setImage("");
  };

  // Typed signatures are drawn in a handwriting style, so the PDF looks the same either way.
  const drawTyped = (value: string) => {
    const c = ctx();
    if (!c) return;
    c.clearRect(0, 0, W, H);
    const text = value.trim();
    if (!text) {
      setImage("");
      return;
    }
    let size = 64;
    c.font = `italic ${size}px "Brush Script MT", "Segoe Script", "Snell Roundhand", cursive`;
    while (c.measureText(text).width > W - 40 && size > 24) {
      size -= 4;
      c.font = `italic ${size}px "Brush Script MT", "Segoe Script", "Snell Roundhand", cursive`;
    }
    c.fillStyle = INK;
    c.textBaseline = "middle";
    c.fillText(text, 20, H / 2 + 4);
    setImage(canvas.current!.toDataURL("image/png"));
  };

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };
  const down = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (mode !== "draw") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = point(e);
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || mode !== "draw") return;
    const c = ctx();
    const p = point(e);
    if (!c || !last.current) return;
    c.strokeStyle = INK;
    c.lineWidth = 3;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.beginPath();
    c.moveTo(last.current.x, last.current.y);
    c.lineTo(p.x, p.y);
    c.stroke();
    last.current = p;
    setHasInk(true);
  };
  const up = () => {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    if (canvas.current) setImage(canvas.current.toDataURL("image/png"));
  };

  const tab = (m: "draw" | "type", label: string) => (
    <button
      type="button"
      onClick={() => {
        if (m === mode) return;
        clear();
        setMode(m);
        if (m === "type") drawTyped(typed);
      }}
      aria-pressed={mode === m}
      className={`px-3 py-1.5 text-[12px] font-medium tracking-[0.08em] uppercase transition-colors ${mode === m ? "bg-site-teal text-white" : "text-body hover:text-site-teal"}`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <input
        {...inputProps}
        type="text"
        name={name}
        autoComplete="name"
        placeholder="Full name"
        onChange={(e) => {
          setTyped(e.target.value);
          if (mode === "type") drawTyped(e.target.value);
        }}
        className={`mt-2 block w-full max-w-[600px] border bg-white px-3.5 py-2.5 text-[15px] text-charcoal outline-none transition focus:border-site-teal focus:ring-2 focus:ring-[#e6f4f2] ${invalid ? "border-site-purple" : "border-[#d9d9d9]"}`}
      />
      <div className="mt-3 flex max-w-[600px] items-center justify-between gap-3">
        <div className="inline-flex border border-[#d9d9d9]" role="group" aria-label="How to sign">
          {tab("draw", "Draw")}
          {tab("type", "Type")}
        </div>
        <button type="button" onClick={clear} className="text-[12px] font-medium tracking-[0.08em] text-site-teal uppercase hover:underline">
          Clear
        </button>
      </div>
      <div className={`relative mt-2 max-w-[600px] border ${invalid ? "border-site-purple" : "border-[#d9d9d9]"} bg-white`}>
        <canvas
          ref={canvas}
          width={W}
          height={H}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          aria-label={mode === "draw" ? "Signature box: draw your signature" : "Your typed signature"}
          role="img"
          className={`block aspect-[15/4] w-full max-w-[600px] touch-none ${mode === "draw" ? "cursor-crosshair" : ""}`}
        />
        <span aria-hidden className="pointer-events-none absolute right-4 bottom-6 left-4 border-b border-dashed border-[#c8c8c8]" />
        {mode === "draw" && !hasInk && (
          <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center text-[13px] text-[#9a9a9a]">
            Sign here with your finger, pen or mouse
          </span>
        )}
      </div>
      <input type="hidden" name={sigImage(name)} value={signature} readOnly />
      <input type="hidden" name={sigMethod(name)} value={mode === "type" ? "typed" : "drawn"} />
    </div>
  );
}
