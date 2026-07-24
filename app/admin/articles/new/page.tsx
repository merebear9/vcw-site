import ArticleForm from "../ArticleForm";

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="heading-font mb-6 text-2xl font-black text-white">New Article</h1>
      <ArticleForm
        mode="create"
        initial={{
          slug: "",
          title: "",
          excerpt: "",
          category: "County Government",
          tags: "",
          author: "Meredith McClain",
          featuredImage: "",
          accessLevel: "free",
          breaking: false,
          published: true,
          content: "",
          pdfUrl: "",
        }}
      />
    </div>
  );
}
