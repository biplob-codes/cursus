import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginationProps = {
  /** Current 1-based page */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /**
   * Base path without query, e.g. "/plans" or "/notes"
   */
  basePath: string;
  /**
   * Extra query params to preserve across page links (e.g. q, tags).
   * The `page` key is managed by this component and will be overwritten.
   */
  searchParams?: Record<string, string | undefined>;
  className?: string;
};

function pageHref(
  basePath: string,
  page: number,
  searchParams?: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) params.set(key, value);
    }
  }

  if (page > 1) params.set("page", String(page));
  else params.delete("page");

  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Build a compact page list: 1 … 4 5 6 … 12 */
function getPageNumbers(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];
  const showLeftEllipsis = current > 3;
  const showRightEllipsis = current < total - 2;

  pages.push(1);

  if (showLeftEllipsis) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (showRightEllipsis) {
    pages.push("ellipsis");
  }

  if (total > 1) {
    pages.push(total);
  }

  // Dedupe consecutive numbers that might overlap with first/last
  return pages.filter((item, index, arr) => {
    if (item === "ellipsis") return true;
    return arr.indexOf(item) === index;
  });
}

export function Pagination({
  page,
  totalPages,
  basePath,
  searchParams,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1 pt-6", className)}
    >
      {/* Previous */}
      {hasPrev ? (
        <Link
          href={pageHref(basePath, page - 1, searchParams)}
          className={cn(
            "inline-flex h-7 w-7 items-center justify-center rounded-md",
            "text-muted-foreground transition-colors",
            "hover:bg-muted hover:text-foreground",
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
        </Link>
      ) : (
        <span
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/40"
          aria-disabled="true"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
        </span>
      )}

      {/* Page numbers */}
      {pages.map((item, index) => {
        if (item === "ellipsis") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex h-7 w-7 items-center justify-center text-xs text-muted-foreground"
            >
              …
            </span>
          );
        }

        const isActive = item === page;

        return (
          <Link
            key={item}
            href={pageHref(basePath, item, searchParams)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-xs tabular-nums transition-colors",
              isActive
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item}
          </Link>
        );
      })}

      {/* Next */}
      {hasNext ? (
        <Link
          href={pageHref(basePath, page + 1, searchParams)}
          className={cn(
            "inline-flex h-7 w-7 items-center justify-center rounded-md",
            "text-muted-foreground transition-colors",
            "hover:bg-muted hover:text-foreground",
          )}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
        </Link>
      ) : (
        <span
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/40"
          aria-disabled="true"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
        </span>
      )}
    </nav>
  );
}
