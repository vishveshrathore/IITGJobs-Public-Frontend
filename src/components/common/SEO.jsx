import { useEffect } from "react";

const ensureMeta = (attrName, attrValue) => {
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  return el;
};

const ensureLink = (rel) => {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  return el;
};

export default function SEO({
  title,
  description,
  image,
  url,
  canonical,
  robots,
  jsonLd,
  siteName = "IITG Jobs",
}) {
  useEffect(() => {
    if (title) document.title = title;

    if (description !== undefined) {
      const metaDesc = ensureMeta("name", "description");
      metaDesc.setAttribute("content", description || "");
    }

    if (robots) {
      const metaRobots = ensureMeta("name", "robots");
      metaRobots.setAttribute("content", robots);
    }

    const ogTitle = ensureMeta("property", "og:title");
    ogTitle.setAttribute("content", title || "");

    const ogDesc = ensureMeta("property", "og:description");
    ogDesc.setAttribute("content", description || "");

    const ogType = ensureMeta("property", "og:type");
    ogType.setAttribute("content", "website");

    const ogUrl = ensureMeta("property", "og:url");
    ogUrl.setAttribute("content", url || window.location.href);

    if (siteName) {
      const ogSite = ensureMeta("property", "og:site_name");
      ogSite.setAttribute("content", siteName);
      const appName = ensureMeta("name", "application-name");
      appName.setAttribute("content", siteName);
    }

    if (image) {
      const ogImage = ensureMeta("property", "og:image");
      ogImage.setAttribute("content", image);
    }

    const twCard = ensureMeta("name", "twitter:card");
    twCard.setAttribute("content", image ? "summary_large_image" : "summary");

    const twTitle = ensureMeta("name", "twitter:title");
    twTitle.setAttribute("content", title || "");

    const twDesc = ensureMeta("name", "twitter:description");
    twDesc.setAttribute("content", description || "");

    if (image) {
      const twImage = ensureMeta("name", "twitter:image");
      twImage.setAttribute("content", image);
    }

    if (canonical) {
      const linkCanonical = ensureLink("canonical");
      linkCanonical.setAttribute("href", canonical);
    }

    let ldEl = document.getElementById("ld-json");
    if (jsonLd) {
      if (!ldEl) {
        ldEl = document.createElement("script");
        ldEl.type = "application/ld+json";
        ldEl.id = "ld-json";
        document.head.appendChild(ldEl);
      }
      ldEl.textContent = JSON.stringify(jsonLd);
    } else if (ldEl) {
      ldEl.remove();
    }
  }, [title, description, image, url, canonical, robots, jsonLd, siteName]);

  return null;
}
