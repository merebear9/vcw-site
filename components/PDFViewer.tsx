import { FileText, Download } from "lucide-react";

export default function PDFViewer({ url, title }: { url: string; title?: string }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-vcw-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-2 text-sm text-white">
          <FileText size={18} className="shrink-0 text-vcw-red" />
          <span className="truncate">{title ?? "Attached document"}</span>
        </div>
        <a
          href={url}
          download
          className="heading-font flex shrink-0 items-center gap-1.5 text-xs font-bold tracking-wide text-vcw-red hover:text-vcw-redLight"
        >
          <Download size={14} /> Download
        </a>
      </div>
      <iframe
        src={`${url}#view=FitH`}
        title={title ?? "PDF document"}
        className="h-[600px] w-full bg-white"
      />
    </div>
  );
}
