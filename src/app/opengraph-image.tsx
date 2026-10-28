import { ImageResponse } from "next/og";

export const alt = "Smidify";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(
        "https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600",
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh) AppleWebKit/533.19.4",
          },
        },
      )
    ).text();
    const url = css.match(
      /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/,
    )?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function Image() {
  const font = await loadFont();
  const layer = (color: string, dx: number, dy: number) => (
    <div
      style={{
        position: "absolute",
        left: 100 + dx,
        top: 150 + dy,
        color,
        display: "flex",
      }}
    >
      Smidify
    </div>
  );
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#f3f2f2",
        fontFamily: font ? "Source Serif 4" : "Georgia, serif",
        fontWeight: 600,
        fontSize: 220,
        letterSpacing: "-0.03em",
      }}
    >
      {layer("#edbb00", -4, -3)}
      {layer("#d6006c", 4, 3)}
      {layer("#0088b0", 0, 0)}
      {layer("#201e1d", 0, 0)}
    </div>,
    {
      ...size,
      fonts: font
        ? [{ name: "Source Serif 4", data: font, weight: 600, style: "normal" }]
        : [],
    },
  );
}
