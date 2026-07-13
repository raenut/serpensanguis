import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import satori from "satori";
import sharp from "sharp";
import { getPostSlug } from "@/utils/getPostPaths";
import config from "@/config";

export async function getStaticPaths() {
  if (!config.features.dynamicOgImage) {
    return [];
  }

  const posts = await getCollection("posts").then(p =>
    p.filter(({ data }) => !data.draft && !data.ogImage)
  );

  return posts.map(post => ({
    params: { slug: getPostSlug(post.id, post.filePath) },
    props: post,
  }));
}

export const GET: APIRoute = async ({ props }) => {
  if (!config.features.dynamicOgImage) {
    return new Response(null, { status: 404, statusText: "Not found" });
  }

  const fontDir = join(process.cwd(), "public", "fonts");
  const [fontin, kslmt] = await Promise.all([
    readFile(join(fontDir, "fontin.ttf")),
    readFile(join(fontDir, "kslmt.ttf")),
  ]);

  const mixedText = (value: string) => {
    const parts = Array.from(value).reduce<
      Array<{ value: string; fontFamily: "Site Fontin" | "Site KSLMT" }>
    >((runs, character) => {
      const fontFamily = /^[\u0000-\u00ff]$/.test(character)
        ? "Site Fontin"
        : "Site KSLMT";
      const previous = runs.at(-1);

      if (fontFamily === "Site Fontin" && previous?.fontFamily === fontFamily) {
        previous.value += character;
      } else {
        runs.push({ value: character, fontFamily });
      }

      return runs;
    }, []);

    return parts.map((part, index) => ({
      type: "span",
      props: {
        key: index,
        style: { fontFamily: part.fontFamily },
        children: part.value,
      },
    }));
  };

  const titleWidthUnits = Array.from(props.data.title as string).reduce(
    (total, character) =>
      total + (/^[\u0000-\u00ff]$/.test(character) ? 0.55 : 1),
    0
  );
  const titleFontSize = Math.min(
    72,
    Math.max(18, Math.floor(940 / Math.max(titleWidthUnits, 1)))
  );

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
                      type: "p",
                      props: {
                        style: {
                          display: "flex",
                          whiteSpace: "nowrap",
                          fontSize: titleFontSize,
                          fontWeight: "bold",
                          marginTop: "20px",
                          maxHeight: "84%",
                          overflow: "hidden",
                        },
                        children: mixedText(props.data.title as string),
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          marginBottom: "26px",
                          fontSize: 36,
                        },
                        children: [
                          {
                            type: "span",
                            props: {
                              children: [
                                {
                                  type: "span",
                                  props: {
                                    style: {
                                      overflow: "hidden",
                                      fontWeight: "bold",
                                      fontFamily: "Site Fontin, Site KSLMT",
                                    },
                                    children: "yseut.pages.dev",
                                  },
                                },
                              ],
                            },
                          },
                          {
                            type: "span",
                            props: {
                              style: {
                                display: "flex",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                fontWeight: "bold",
                              },
                              children: mixedText(config.site.title),
                            },
                          },
                        ],
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
