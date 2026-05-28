import puppeteer from "puppeteer";
import { getBookletData, renderBookletHtml } from "@/lib/menu-booklet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const data = await getBookletData();
  const html = renderBookletHtml(data, origin);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1240, height: 1754, deviceScaleFactor: 1 });
    // "load" fires after images + stylesheets; brief wait lets webfonts settle.
    await page.setContent(html, { waitUntil: "load", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1200));
    const pdf = await page.pdf({
      width: "1240px",
      height: "1754px",
      printBackground: true,
      preferCSSPageSize: true,
    });
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="SweetLifeMenuNewry.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } finally {
    await browser.close();
  }
}
