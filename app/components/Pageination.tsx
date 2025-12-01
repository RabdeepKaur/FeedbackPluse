"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) params.delete("page");
    else params.set("page", String(page));

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 mt-8">
      <button
        disabled={currentPage <= 1}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
        onClick={() => goToPage(currentPage - 1)}
      >
        Previous
      </button>

      <span className="px-4 py-2">
        Page {currentPage} / {totalPages}
      </span>

      <button
        disabled={currentPage >= totalPages}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
        onClick={() => goToPage(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}
