import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://yseut.pages.dev/",
    title: "西西弗斯的末日",
    description: "Essays, books, movies, and personal notes.",
    author: "yseut",
    profile: "https://t.me/raenut",
    ogImage: "4.JPG",
    lang: "en",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: false,
      //url: "https://github.com/raenut/serpensanguis/edit/main/",
    },
    search: "pagefind",
  },
  socials: [
    { name: "github",   url: "https://github.com/raenut" },
    { name: "x",   url: "https://douban.com/username" },
    { name: "telegram", url: "https://t.me/raenut" },
    { name: "mail",     url: "mailto:r@proton.me" },

  ],
  shareLinks: [
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    //{ name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    //{ name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
    //{ name: "whatsapp", url: "https://wa.me/?text=" },
  ],
});