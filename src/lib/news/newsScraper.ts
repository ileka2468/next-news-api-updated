import { load } from "cheerio";
import { newsSources } from "./constants";
import { Source } from "@/types/news";
import { findElement } from "@/lib/utils/cheerio";
import { articleFromItem } from "@/lib/news/utils";
import { BadRequest, TimeoutException } from "@/exceptions/server";

interface Article {
  source: string;
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
}

/**
 * Fetches articles from a specific RSS feed source.
 * @param source The news source to fetch articles from.
 * @returns An array of Article objects.
 */
export const fetchNewsFromRSS = async (source: Source): Promise<Article[]> => {
  let response;
  try {
    response = await fetch(source.url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/113.0",
      },
    });
  } catch (error: any) {
    console.log(`Failed to fetch RSS feed ${source.name}, ${error.message}`);
    return [];
  }

  if (response.status !== 200) {
    console.log(`Bad response from RSS feed ${source.url}`);
    return [];
  }

  const responseText = await response.text();
  const $ = load(responseText, { xmlMode: true });

  const items = findElement($, "item");

  if (!items) {
    console.log(`No items found in ${source.url}`);
    return [];
  }

  const articles: Article[] = [];

  for (let i = 0; i < items.length; i++) {
    const element = items.eq(i);
    const itemElement = $(element);

    const baseArticle = articleFromItem(itemElement);
    if (!baseArticle) continue;

    const article: Article = { source: source.name, ...baseArticle };

    articles.push(article);
    if (articles.length >= 30) break; // 30 articles is enough bandwidth doesnt grow on trees
  }

  if (articles.length === 0) {
    console.log(`No valid articles found from ${source.url}`);
  }

  return articles;
};

/**
 * Retrieves articles from a specific news source by its code.
 * @param sourceName The code of the news source.
 * @returns An array of Article objects.
 */
export const getSourceNews = async (sourceName: string): Promise<Article[]> => {
  const source = newsSources.find(
    (src) => src.code === sourceName.toUpperCase()
  );

  if (!source) {
    console.log(`${sourceName} source doesn't exist`);
    throw new BadRequest(`Invalid source name`);
  }

  try {
    const articles = await fetchNewsFromRSS(source);
    return articles;
  } catch (error: any) {
    console.log(
      `getNewsSource failed: for ${source.name}, reason: ${error.message}`
    );
    return [];
  }
};

/**
 * Retrieves articles from a random news source.
 * @returns An array of Article objects.
 */
export const getRandomNews = async (): Promise<Article[]> => {
  const sourceIndex = Math.floor(Math.random() * newsSources.length);
  const source = newsSources[sourceIndex];

  try {
    const articles = await fetchNewsFromRSS(source);
    return articles;
  } catch (error: any) {
    console.log(
      `getRandomNews failed: for ${source.name}, reason: ${error.message}`
    );
    return [];
  }
};

/**
 * Retrieves articles from all news sources matching the specified political bias.
 * @param bias The political bias to filter sources by ("left", "right", or "center").
 * @returns An array of Article objects aggregated from all matching sources.
 */
export const getNewsByBias = async (
  bias: "left" | "right" | "center"
): Promise<Article[]> => {
  // Filter sources by the specified political bias
  const sources = newsSources.filter((source) => source.politicalBias === bias);

  if (sources.length === 0) {
    console.log(`No sources found with bias: ${bias}`);
    return [];
  }

  const fetchPromises = sources.map((source) => fetchNewsFromRSS(source));

  // Execute fetches concurrently
  const results = await Promise.allSettled(fetchPromises);

  const aggregatedArticles: Article[] = [];

  results.forEach((result, index) => {
    const source = sources[index];
    if (result.status === "fulfilled") {
      aggregatedArticles.push(...result.value);
    } else {
      console.log(
        `Failed to fetch articles from ${source.name}: ${result.reason}`
      );
    }
  });

  if (aggregatedArticles.length === 0) {
    console.log(`No articles found for bias: ${bias}`);
  }

  return aggregatedArticles;
};
