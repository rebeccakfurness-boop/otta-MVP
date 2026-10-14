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
