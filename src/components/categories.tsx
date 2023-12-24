"use client";

import { Category } from "@prisma/client";
import React from "react";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";

type Props = {
  categories: Category[];
};

const Categories = ({ categories }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryId = searchParams.get("categoryId");

  const handleClick = (id?: string) => {
    const query = { categoryId: id };
    const url = queryString.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true }
    );

    router.push(url);
  };
  return (
    <div className="w-full overflow-x-auto space-x-2 flex p1">
      <button
        onClick={() => handleClick(undefined)}
        className={cn(
          `
            flex items-center text-center 
            md:text-sm md:px-4 md:py-3
            text-xs px-2 py-3
            rounded-md bg-primary/10
            hover:opacity-75 transition flex-shrink-0 font-medium
         `,
          !categoryId && "bg-primary/25"
        )}
      >
        Newest
      </button>
      {categories.map((category) => (
        <button
          onClick={() => handleClick(category.id)}
          key={category.id}
          className={cn(
            `
               flex items-center text-center 
               md:text-sm md:px-4 md:py-3
               text-xs px-2 py-3
               rounded-md bg-primary/10
               hover:opacity-75 transition flex-shrink-0 font-medium
            `,
            categoryId === category.id && "bg-primary/25"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default Categories;
