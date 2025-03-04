import { getCategories, getCategoryCounts } from "../../lib/blog-utils";
import ConditionalSidebar from "./components/ConditionalSidebar";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();
  const categoryCounts = await getCategoryCounts();

  return (
    <div className="container mx-auto px-6 pt-16 pb-12">
      {/* Render the children with no fixed sidebar - children handle their own layout */}
      {children}

      {/* Categories sidebar is rendered only on main blog page and category pages */}
      <div className="fixed right-6 lg:right-10 xl:right-24 top-[380px] w-1/4 max-w-[280px] hidden md:block">
        <ConditionalSidebar
          categories={categories}
          categoryCounts={categoryCounts}
        />
      </div>
    </div>
  );
}
