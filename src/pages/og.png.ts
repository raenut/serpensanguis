import type { APIRoute } from "astro";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import satori from "satori";
import sharp from "sharp";
import config from "@/config";

export const GET: APIRoute = async () => {
  const fontDir = join(process.cwd(), "public", "fonts");
  const [fontin, kslmt] = await Promise.all([
    readFile(join(fontDir, "fontin.ttf")),
    readFile(join(fontDir, "kslmt.ttf")),
  ]);

  const mixedText = (value: string) =>
    Array.from(value).map((character, index) => ({
      type: "span",
      props: {
        key: index,
        style: {
          fontFamily: /^[\u0000-\u00ff]$/.test(character)
            ? "Site Fontin"
            : "Site KSLMT",
        },
        children: character,
      },
    }));

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          background: "#fefbfb",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Site Fontin",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: "-1px",
                right: "-1px",
                border: "4px solid #000",
                background: "#ecebeb",
                opacity: "0.9",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "center",
                margin: "2.5rem",
                width: "88%",
                height: "80%",
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                border: "4px solid #000",
                background: "#fefbfb",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "center",
                margin: "2rem",
                width: "88%",
                height: "80%",
              },
              children: {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    margin: "20px",
                    width: "90%",
                    height: "90%",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "90%",
                          maxHeight: "90%",
                          overflow: "hidden",
                          textAlign: "center",
                        },
                        children: [
                          {
                            type: "p",
                            props: {
                              style: { fontSize: 72, fontWeight: "bold" },
                              children: mixedText(config.site.title),
                            },
                          },
                          {
                            type: "p",
                            props: {
                              style: { fontSize: 28 },
                              children: mixedText(config.site.description),
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          justifyContent: "flex-end",
                          width: "100%",
                          marginBottom: "8px",
                          fontSize: 28,
                        },
                        children: {
                          type: "span",
                          props: {
                            style: { overflow: "hidden", fontWeight: "bold" },
                            children: mixedText(
                              new URL(config.site.url).hostname
                            ),
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: [
        {
          name: "Site Fontin",
          data: fontin,
          weight: 400,
          style: "normal",
        },
        {
          name: "Site Fontin",
          data: fontin,
          weight: 700,
          style: "normal",
        },
        {
          name: "Site KSLMT",
          data: kslmt,
          weight: 400,
          style: "normal",
        },
        {
          name: "Site KSLMT",
          data: kslmt,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(pngBuffer), {
    headers: { "Content-Type": "image/png" },
  });
};
