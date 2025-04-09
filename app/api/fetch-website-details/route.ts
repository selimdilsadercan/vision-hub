import { NextResponse } from "next/server";

async function fetchWebsiteInfos(website: string) {
  try {
    // Validate and prepare the URL
    if (!website.startsWith("http")) {
      website = "https://" + website;
    }

    // Dub Meta Tags API URL
    const dubApiUrl = `https://api.dub.co/metatags?url=${website}`;

    // Fetch metadata using Dub Meta Tags API
    const metaResponse = await fetch(dubApiUrl);

    if (metaResponse.status !== 200) {
      throw new Error(`Failed to fetch metadata. Status code: ${metaResponse.status}`);
    }

    // Decode response body using UTF-8
    const metaData = await metaResponse.json();

    // Extract title, description, and image
    const title = metaData["title"] ?? "No Title Found";
    const description = metaData["description"] ?? "No Description Found";
    const image = metaData["image"] ?? "";

    // Fetch favicon using Google Favicon API
    const favicon = `https://www.google.com/s2/favicons?sz=64&domain_url=${website}`;

    // Return the data as a WebsiteStruct
    return {
      url: website,
      title: title,
      description: description,
      image: image,
      favicon: favicon
    };
  } catch (e) {
    throw new Error(`Error fetching website information: ${e}`);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return new NextResponse(JSON.stringify({ error: "URL is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const websiteDetails = await fetchWebsiteInfos(url);

    return new NextResponse(JSON.stringify(websiteDetails), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in fetch-website-details route:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch website details" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
