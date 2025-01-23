import { newsSources } from "@/lib/news/constants";
import {
  fetchNewsFromRSS,
  getRandomNews,
  getSourceNews,
  getNewsByBias,
} from "@/lib/news/newsScraper";
import { isValidSource } from "@/lib/news/utils";
import { Source } from "@/types/news";

const source: Source = newsSources.find(
  (src) => src.code === "US-NYT"
) as Source;

describe("fetchNewsFromRSS", () => {
  it("should return a list of Articles", async () => {
    const result = await fetchNewsFromRSS(source);
    expect(result.length > 0).toBe(true);
  });
});

describe("getSourceNews", () => {
  it("should return a list of Articles from a selected source", async () => {
    const selectedSource = "US-NYT";
    const result = await getSourceNews(selectedSource);
    expect(result.length > 0).toBe(true);
    result.forEach((article) => {
      expect(article.source).toBe("New York Times");
    });
  });
});

describe("getRandomNews", () => {
  it("should return a list of Articles from a random source", async () => {
    const result = await getRandomNews();
    expect(result.length > 0).toBe(true);
    const validSources = newsSources.map((src) => src.name);
    result.forEach((article) => {
      expect(validSources).toContain(article.source);
    });
  });
});

describe("isValidSource", () => {
  it("should return true if the source exists", () => {
    const result = isValidSource("US-NYT");
    expect(result).toBe(true);
  });

  it("should return false if the source does not exist", () => {
    const result = isValidSource("INVALID-SOURCE");
    expect(result).toBe(false);
  });
});

describe("fetchAllSources", () => {
  it("should return a list of Articles from all sources", async () => {
    const allSources = [];
    for (let i = 0; i < newsSources.length; i++) {
      const articles = await fetchNewsFromRSS(newsSources[i]);
      allSources.push(articles);
    }
    expect(allSources.length === newsSources.length).toBe(true);
    allSources.forEach((articles, index) => {
      expect(articles.length > 0).toBe(true);
    });
  });
});

describe("getNewsByBias", () => {
  it("should return a list of Articles from left-leaning sources", async () => {
    const bias = "left";
    const result = await getNewsByBias(bias);
    expect(result.length > 0).toBe(true);
    // Verify that all articles are from left-leaning sources
    const leftSources = newsSources
      .filter((src) => src.politicalBias === "left")
      .map((src) => src.name);
    result.forEach((article) => {
      expect(leftSources).toContain(article.source);
    });
  });

  it("should return a list of Articles from right-leaning sources", async () => {
    const bias = "right";
    const result = await getNewsByBias(bias);
    expect(result.length > 0).toBe(true);
    // Verify that all articles are from right-leaning sources
    const rightSources = newsSources
      .filter((src) => src.politicalBias === "right")
      .map((src) => src.name);
    result.forEach((article) => {
      expect(rightSources).toContain(article.source);
    });
  });

  it("should return a list of Articles from center-leaning sources", async () => {
    const bias = "center";
    const result = await getNewsByBias(bias);
    expect(result.length > 0).toBe(true);
    // Verify that all articles are from center-leaning sources
    const centerSources = newsSources
      .filter((src) => src.politicalBias === "center")
      .map((src) => src.name);
    result.forEach((article) => {
      expect(centerSources).toContain(article.source);
    });
  });

  it("should return an empty list if no sources match the bias", async () => {
    // Assuming "neutral" is not a defined bias
    const bias = "neutral" as any; // Force an invalid bias
    const result = await getNewsByBias(bias);
    expect(result.length).toBe(0);
  });

  it("should handle biases with no available sources gracefully", async () => {
    // Temporarily remove all sources of a specific bias and test
    const originalSources = [...newsSources];
    const bias = "left";

    // Mock newsSources to have no left-leaning sources
    const mockNewsSources = newsSources.filter(
      (src) => src.politicalBias !== bias
    );
    // @ts-ignore
    newsSources.length = 0;
    // @ts-ignore
    newsSources.push(...mockNewsSources);

    const result = await getNewsByBias(bias);
    expect(result.length).toBe(0);

    // Restore original newsSources
    // @ts-ignore
    newsSources.length = 0;
    // @ts-ignore
    newsSources.push(...originalSources);
  });
});
