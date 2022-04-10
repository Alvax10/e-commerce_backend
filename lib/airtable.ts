import Airtable from "airtable";

export const base = new Airtable({apiKey: process.env.API_KEY_AIRTABLE}).base(process.env.BASE_AIRTABLE);