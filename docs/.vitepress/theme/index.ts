import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { YouTubeEmbed } from "@miletorix/vitepress-youtube-embed";
import "@miletorix/vitepress-youtube-embed/style.css";

import ListItem from "../components/ListItem.vue";
import LinkCard from "../components/LinkCard.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("LinkCard", LinkCard);
    app.component("ListItem", ListItem);
    app.component("YouTubeEmbed", YouTubeEmbed);
  },
} satisfies Theme;
