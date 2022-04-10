import algoliasearch from "algoliasearch";

const client = algoliasearch(process.env.ALGOLIA_ADMIN_KEY, process.env.ALGOLIA_API_KEY);
export const productIndex = client.initIndex("products");
