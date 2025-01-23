import { Source } from "@/types/news";

export const newsSources: Source[] = [
  // -------- United States Feeds --------

  // -------- Left-Leaning Sources --------
  {
    code: "US-NYT",
    name: "New York Times",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
    politicalBias: "left",
  },
  {
    code: "US-CNN",
    name: "CNN News",
    url: "http://rss.cnn.com/rss/cnn_allpolitics.rss",
    politicalBias: "left",
  },
  {
    code: "US-HP",
    name: "Huffington Post",
    url: "https://chaski.huffpost.com/us/auto/vertical/us-news",
    politicalBias: "left",
  },
  {
    code: "US-AL",
    name: "Axios",
    url: "https://www.axios.com/feeds/feed.rss",
    politicalBias: "left",
  },

  // -------- Right-Leaning Sources --------
  {
    code: "US-FN",
    name: "Fox News",
    url: "https://moxie.foxnews.com/google-publisher/latest.xml",
    politicalBias: "right",
  },
  {
    code: "US-NM",
    name: "Newsmax",
    url: "https://www.newsmax.com/rss/Politics/1/",
    politicalBias: "right",
  },

  // -------- Center-Leaning Sources --------
  {
    code: "US-R",
    name: "Reuters",
    url: "https://cdn.feedcontrol.net/8/1114-wioSIX3uu8MEj.xml",
    politicalBias: "center",
  },
  {
    code: "US-P",
    name: "Politico",
    url: "https://rss.politico.com/politics-news.xml",
    politicalBias: "center",
  },
  {
    code: "US-LAT",
    name: "Los Angeles Times",
    url: "https://www.latimes.com/local/rss2.0.xml",
    politicalBias: "center",
  },
  {
    code: "US-WSJ",
    name: "Wall Street Journal",
    url: "https://feeds.content.dowjones.io/public/rss/socialpoliticsfeed",
    politicalBias: "center",
  },
  {
    code: "US-ABC",
    name: "ABC News",
    url: "https://abcnews.go.com/abcnews/politicsheadlines",
    politicalBias: "center",
  },
  {
    code: "US-CBS",
    name: "CBS News",
    url: "https://www.cbsnews.com/latest/rss/politics",
    politicalBias: "center",
  },
];
