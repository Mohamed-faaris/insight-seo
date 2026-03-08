import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { SeoReport } from "@/lib/seo-types";

export async function exportReportAsPdf(report: SeoReport) {
  const reportEl = document.getElementById("seo-report");
  if (!reportEl) return;

  const canvas = await html2canvas(reportEl, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#0a0f1c",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  let position = 0;
  const pageHeight = pdf.internal.pageSize.getHeight();

  while (position < pdfHeight) {
    if (position > 0) pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, -position, pdfWidth, pdfHeight);
    position += pageHeight;
  }

  pdf.save(`seo-report-${new URL(report.url).hostname}-${new Date().toISOString().split("T")[0]}.pdf`);
}
