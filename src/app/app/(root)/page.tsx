import Categories from "@/components/categories";
import Companions from "@/components/companions";
import SearchInput from "@/components/search-input";
import db from "@/lib/db";
import React from "react";

type Props = {
  searchParams: {
    name: string;
    categoryId: string;
  };
};

const AppPage = async ({ searchParams }: Props) => {
  const categoriesPromise = db.category.findMany();
  const companionPromise = db.companion.findMany({
    where: {
      categoryId: searchParams.categoryId,
      name: {
        search: searchParams.name,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  const [categories, companions] = await Promise.all([categoriesPromise, companionPromise]);

  return (
    <div className="h-full p-4 space-y-2">
      <SearchInput />
      <Categories categories={categories} />
      <Companions data={companions} />
    </div>
  );
};

export default AppPage;
