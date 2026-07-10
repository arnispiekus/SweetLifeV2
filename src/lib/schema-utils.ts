/**
 * JSON-LD serialization helper.
 *
 * Escapes `<` so a `</script>`-shaped substring inside the payload can't
 * break out of the script tag. Follows the Next.js official docs pattern
 * (see https://nextjs.org/docs/app/guides/json-ld) rather than pulling in
 * `serialize-javascript` (CVE-2024-11831). Mirrors the pattern already
 * shipped for elevateoco.com's Organization/WebSite schema components.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
