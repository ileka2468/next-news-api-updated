import { NextResponse } from "next/server";
import { handleError } from "@/exceptions";
import { getNewsByBias } from "@/lib/news/newsScraper";
import { ServerException } from "@/exceptions/server";
import { makeSuccessResponse } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bias = searchParams.get("bias");

  // Validate the bias param
  if (!bias || !["left", "right", "center"].includes(bias.toLowerCase())) {
    const error = new ServerException(
      "Invalid or missing bias parameter. Valid values are 'left', 'right', or 'center'."
    );
    return handleError(error);
  }

  try {
    // Fetch articles based on bias
    const articles = await getNewsByBias(
      bias.toLowerCase() as "left" | "right" | "center"
    );

    if (articles.length === 0) {
      const error = new ServerException(
        "No articles found for the specified bias."
      );
      return handleError(error);
    }

    const successResponse = makeSuccessResponse(articles);
    return NextResponse.json(successResponse, { status: 200 });
  } catch (error: any) {
    console.log("GET /api/news/bias Failed", error.message);
    return handleError(error);
  }
}

export const revalidate = 0;
