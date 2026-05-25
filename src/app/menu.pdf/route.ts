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
    // "load" fires after images + stylesheets; brief wait lets webfonts settle.
    await page.setContent(html, { waitUntil: "load", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 800));
    const pdf = await page.pdf({
      format: "A5",
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
