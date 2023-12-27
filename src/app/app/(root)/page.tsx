import Categories from "@/components/categories";
import SearchInput from "@/components/search-input";
import db from "@/lib/db";
import React from "react";

const AppPage = async () => {
  const categories = await db.category.findMany();

  return (
    <div className="h-full p-4 space-y-2">
      <SearchInput />
      <Categories categories={categories} />
    </div>
  );
};

export default AppPage;
