import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { globalSearch, getSearchSuggestions } from "@/actions/search";

type SearchType = "assets" | "posts" | "blog" | "docs" | "users" | "registry";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "suggestions") {
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "5");
    const suggestions = await getSearchSuggestions(query, limit);
    return NextResponse.json(suggestions);
  }

  const query = searchParams.get("q");
  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' required" }, { status: 400 });
  }

  const typesParam = searchParams.get("types")?.split(",");
  const types = (typesParam as SearchType[]) || ["assets", "posts", "blog", "docs", "users", "registry"];
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

  const result = await globalSearch({ query, types, page, limit });
  return NextResponse.json(result);
}