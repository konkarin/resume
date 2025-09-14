<template>
  <a
    v-if="title"
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    class="link-card"
  >
    <div class="link-card-content">
      <div class="text-content">
        <h3 class="link-title">{{ title }}</h3>
        <p class="link-description">{{ description }}</p>
        <div class="link-source">
          <img v-if="logo" :src="logo" alt="Website Logo" class="source-logo" />
          <span class="source-url">{{ url }}</span>
        </div>
      </div>
      <div v-if="image" class="image-container">
        <img :src="image" alt="Article Thumbnail" class="link-image" />
      </div>
    </div>
  </a>
  <a
    v-else
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    class="plain-link"
    >{{ url }}</a
  >
</template>

<script setup lang="ts">
import { ref, onMounted, onServerPrefetch } from "vue";

const { url } = defineProps<{
  url: string;
}>();

const title = ref("");
const description = ref("");
const image = ref("");
const logo = ref("");
const alt = ref("");

const fetchOg = async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const html = await response.text();

    const doc = await (async () => {
      if (typeof window !== "undefined") {
        const parser = new window.DOMParser();
        return parser.parseFromString(html, "text/html");
      } else {
        const { JSDOM } = await import("jsdom");
        const dom = new JSDOM(html);
        return dom.window.document;
      }
    })();

    const og: Record<string, string | null> = Object.fromEntries(
      [...doc.head.children]
        .filter(
          (element) =>
            element.tagName === "META" &&
            element.getAttribute("property")?.startsWith("og:")
        )
        .map((element) => {
          return [
            element.getAttribute("property"),
            element.getAttribute("content"),
          ];
        })
    );
    title.value = og["og:title"] || doc.title || "";
    description.value = og["og:description"] || "";
    image.value = og["og:image"] || "";
    alt.value = og["og:image:alt"] || "";

    const link: Record<string, string | null> = Object.fromEntries(
      [...doc.head.children]
        .filter(
          (element) =>
            element.tagName === "LINK" &&
            element.getAttribute("rel")?.includes("icon")
        )
        .map((element) => {
          return [element.getAttribute("rel"), element.getAttribute("href")];
        })
    );
    logo.value = link.icon && link.icon.startsWith("http") ? link.icon : "";
  } catch (error) {
    console.error("Error fetching OGP data:", error);
  }
};

onServerPrefetch(fetchOg);

onMounted(() => {
  if (!title.value) {
    fetchOg();
  }
});
</script>

<style scoped>
.plain-link {
  display: block;
  margin: 1rem 0;
}
.link-card {
  display: block;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  margin: 1rem 0;
}

.link-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.link-card-content {
  display: flex;
  justify-content: space-between;
}

.text-content {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.link-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.link-description {
  font-size: 0.875rem;
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-source {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #999;
}

.source-logo {
  width: 24px;
  border-radius: 4px;
}

.image-container {
  width: 300px;
  height: 150px;
  flex-shrink: 0;
}

.link-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* レスポンシブ対応 */
@media (max-width: 600px) {
  .link-card-content {
    flex-direction: column-reverse;
  }
  .image-container {
    width: 100%;
    height: auto;
  }
  .link-image {
    aspect-ratio: 16/9;
  }
}
</style>
