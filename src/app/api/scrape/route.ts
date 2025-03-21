// src/app/api/scrape/route.ts
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL is required" },
      { status: 400 }
    );
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "networkidle2" });

    await page.waitForSelector("#productTitle");

    const html = await page.content();
    console.log("Page HTML:", html);

    const data = await page.evaluate(() => {
      const productName =
        (document.querySelector("#productTitle") as HTMLElement)?.innerText.trim() || "N/A";

      const price =
        (document.querySelector(".priceToPay .a-offscreen") as HTMLElement)?.innerText.trim() ||
        (document.querySelector(".a-price .a-offscreen") as HTMLElement)?.innerText.trim() ||
        "N/A";

      const description =
        (document.querySelector("#productDescription") as HTMLElement)?.innerText.trim() ||
        (document.querySelector("#feature-bullets") as HTMLElement)?.innerText.trim() ||
        "N/A";

      const image =
        (document.querySelector("#landingImage") as HTMLImageElement)?.src || null;

      return {
        productName,
        price,
        description,
        image,
      };
    });

    await browser.close();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Scraping failed:", error);
    return NextResponse.json(
      { error: "Scraping failed" },
      { status: 500 }
    );
  }
}