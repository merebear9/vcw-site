import { prisma } from "@/lib/prisma";
import DocumentUploadForm from "./DocumentUploadForm";
import DocumentList from "./DocumentList";

export default async function AdminDocumentsPage() {
  const documents = await prisma.document.findMany({ orderBy: { dateObtained: "desc" } });

  return (
    <div>
      <h1 className="heading-font mb-6 text-2xl font-black text-white">Public Records</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <DocumentList
          documents={documents.map((d) => ({
            id: d.id,
            title: d.title,
            category: d.category,
            dateObtained: d.dateObtained.toISOString(),
            fileUrl: d.fileUrl,
          }))}
        />
        <DocumentUploadForm />
      </div>
    </div>
  );
}
