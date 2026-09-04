import { jsPDF } from "jspdf";

const DISCLAIMER =
  "Generated with the SASSA AI Productivity Assistant. AI-generated content must be reviewed and approved by a SASSA official before use. No beneficiary personal information is stored by the AI.";

export function downloadPdf(title: string, content: string) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(title, margin, margin);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  let y = margin + 24;
  for (const line of doc.splitTextToSize(content, width) as string[]) {
    if (y > pageHeight - margin - 40) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += 16;
  }

  doc.setFontSize(8);
  doc.setTextColor(120);
  const notes = doc.splitTextToSize(DISCLAIMER, width) as string[];
  if (y > pageHeight - margin - 40) {
    doc.addPage();
    y = margin;
  }
  doc.text(notes, margin, Math.min(y + 20, pageHeight - margin));
  doc.save(`${slug(title)}.pdf`);
}

export function downloadWord(title: string, content: string) {
  const body = content
    .split("\n")
    .map((line) => `<p>${escapeHtml(line) || "&nbsp;"}</p>`)
    .join("");
  const html = `<html xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head><body><h2>${escapeHtml(title)}</h2>${body}<hr/><p style="font-size:10px;color:#666">${DISCLAIMER}</p></body></html>`;
  const blob = new Blob([html], { type: "application/msword" });
  triggerDownload(blob, `${slug(title)}.doc`);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "sassa-output";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
