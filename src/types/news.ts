export interface Source {
  code: string;
  name: string;
  url: string;
  politicalBias?: "left" | "right" | "center";
}

export interface BaseArticle {
  title: string;
  link: string;
  description?: string;
  pubDate: string;
}

interface Article extends BaseArticle {
  source: string;
}
