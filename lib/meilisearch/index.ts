import { MeiliSearch } from "meilisearch";

// CHANGE THE PROD
const client = new MeiliSearch({
  host:
    process.env.NODE_ENV === "production"
      ? "https://ecrevier.com"
      : "http://localhost:7700",
  ...(process.env.NODE_ENV === "production"
    ? {
        apiKey: process.env.NEXT_PUBLIC_MEILI_API_KEY,
      }
    : {}),
});

export default client;
