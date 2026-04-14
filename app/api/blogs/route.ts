import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, getPostsByCategory } from "@/lib/posts";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const posts = category 
    ? await getPostsByCategory(category) 
    : await getAllPosts();

  const responseBody = { posts, total: posts.length };
  const responseInit = {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  };

  return NextResponse.json(responseBody, responseInit);
}
