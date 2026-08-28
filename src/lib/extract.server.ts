import JSZip from "jszip";

function decodeBase64(base64: string): Uint8Array {
  const clean = base64.includes(",") ? base64.slice(base64.indexOf(",") + 1) : base64;
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function cleanup(text: string) {
  return text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function xmlToText(xml: string) {
  return cleanup(
    xml
      .replace(/<\/w:p>|<\/a:p>|<\/w:br\s*\/>/g, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'"),
  );
}

export async function extractText(
  fileName: string,
  base64: string,
): Promise<{ text: string; pages: number; fileType: string }> {
  const lower = fileName.toLowerCase();
  const bytes = decodeBase64(base64);

  if (lower.endsWith(".pdf")) {
    const { extractText: extractPdfText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(bytes);
    const { text, totalPages } = await extractPdfText(pdf, { mergePages: true });
    return {
      text: cleanup(Array.isArray(text) ? text.join("\n\n") : text),
      pages: totalPages ?? 1,
      fileType: "PDF",
    };
  }

  if (lower.endsWith(".docx") || lower.endsWith(".pptx")) {
    const zip = await JSZip.loadAsync(bytes);
    const isDocx = lower.endsWith(".docx");
    const parts = Object.keys(zip.files).filter((name) =>
      isDocx ? name === "word/document.xml" : /^ppt\/slides\/slide\d+\.xml$/.test(name),
    );
    parts.sort();
    const chunks: string[] = [];
    for (const part of parts) {
      const xml = await zip.files[part]!.async("string");
      chunks.push(xmlToText(xml));
    }
    return {
      text: cleanup(chunks.join("\n\n")),
      pages: isDocx ? Math.max(1, Math.round(chunks.join(" ").length / 1800)) : parts.length || 1,
      fileType: isDocx ? "DOCX" : "PPT",
    };
  }

  const text = cleanup(new TextDecoder().decode(bytes));
  return { text, pages: Math.max(1, Math.round(text.length / 1800)), fileType: "TXT" };
}
