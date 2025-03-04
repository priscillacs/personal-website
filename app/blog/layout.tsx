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
    <div className="container mx-auto px-0 md:px-6 pt-16 pb-12 relative">
      {/* Main wrapper */}
      <div className="flex flex-col">
        {/* Children will render full-width banner first */}
        {children}
      </div>

      {/* Categories sidebar - positioned absolutely */}
      <div className="hidden md:block absolute right-6 top-[370px] w-[280px]">
        <div className="sticky top-[120px]">
          <ConditionalSidebar
            categories={categories}
            categoryCounts={categoryCounts}
          />
        </div>
      </div>
    </div>
  );
}
