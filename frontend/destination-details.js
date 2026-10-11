/* ==========================================================
   GO TRIP — DESTINATION DETAILS
   Destination-specific photos (Wikimedia Commons + Wikipedia
   fallback) and Spring Boot tours API
   ========================================================== */

const API_URL = "http://localhost:8080/api/tours";
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";
const WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php";
const REQUEST_TIMEOUT = 10000;
const CACHE_PREFIX = "gotrip:photo:v2:";

const $ = (selector, parent = document) => parent.querySelector(selector);

const params = new URLSearchParams(window.location.search);
const selectedId = params.get("id");
const selectedName = params.get("name");

let currentDestinationName = "Destination";
let currentTour = null;
let currentPhotos = [];

/* ==========================================================
   DESTINATION DATA
   places: [search query, display caption]
   ========================================================== */

const destinations = {
  jaipur: {
    tagline: "The Pink City of royal forts and timeless stories",
    bestTime: "October to March",
    carry: "Comfortable walking shoes, sunscreen, water and light clothing.",
    transport: "Taxi, auto-rickshaw and local transport.",
    overview:
      "Explore Jaipur's royal forts, historic palaces, pink streets, traditional crafts and lively markets.",
    places: [
      ["Hawa Mahal Jaipur", "Hawa Mahal"],
      ["Amber Fort Jaipur", "Amber Fort"],
      ["City Palace Jaipur Rajasthan", "City Palace"],
      ["Jantar Mantar Jaipur", "Jantar Mantar"],
      ["Jal Mahal Jaipur", "Jal Mahal"],
      ["Nahargarh Fort Jaipur", "Nahargarh Fort"],
      ["Albert Hall Museum Jaipur", "Albert Hall Museum"],
      ["Patrika Gate Jaipur", "Patrika Gate"]
    ]
  },

  goa: {
    tagline: "Sunlit beaches, coastal charm and easy-going days",
    bestTime: "November to February",
    carry: "Beachwear, sunscreen, sunglasses, sandals and water.",
    transport: "Licensed taxis, local buses and rental scooters.",
    overview:
      "Discover Goa's coastline, historic churches, colourful streets, seafood and tropical scenery.",
    places: [
      ["Baga Beach Goa India", "Baga Beach"],
      ["Palolem Beach Goa India", "Palolem Beach"],
      ["Fort Aguada Goa India", "Fort Aguada"],
      ["Basilica of Bom Jesus Old Goa", "Basilica of Bom Jesus"],
      ["Dudhsagar Falls Goa India", "Dudhsagar Falls"],
      ["Chapora Fort Goa India", "Chapora Fort"],
      ["Fontainhas Panjim Goa", "Fontainhas"],
      ["Anjuna Beach Goa India", "Anjuna Beach"]
    ]
  },

  manali: {
    tagline: "Mountain air, pine forests and Himalayan views",
    bestTime: "March to June; winter for snow, subject to conditions",
    carry: "Warm layers, sturdy shoes, sunscreen and rain protection.",
    transport: "Local taxis, buses and pre-arranged transfers.",
    overview:
      "Enjoy Himalayan landscapes, mountain valleys, riverside walks, forest scenery and local culture.",
    places: [
      ["Hadimba Devi Temple Manali", "Hadimba Temple"],
      ["Solang Valley Manali Himachal Pradesh", "Solang Valley"],
      ["Atal Tunnel Rohtang Manali", "Atal Tunnel"],
      ["Old Manali Himachal Pradesh", "Old Manali"],
      ["Jogini Falls Manali", "Jogini Falls"],
      ["Vashisht Temple Manali", "Vashisht Temple"],
      ["Naggar Castle Himachal Pradesh", "Naggar Castle"],
      ["Beas River Manali India", "Beas River"]
    ]
  },

  kerala: {
    tagline: "Tea gardens, peaceful backwaters and tropical beauty",
    bestTime: "October to March",
    carry: "Light clothes, comfortable footwear, insect repellent and rainwear.",
    transport: "Taxi, local buses and pre-arranged transfers.",
    overview:
      "Explore Kerala's tea plantations, tropical scenery, backwaters, waterfalls and regional food.",
    places: [
      ["Munnar tea plantations Kerala India", "Munnar Tea Gardens"],
      ["Alleppey Kerala houseboats backwaters", "Alleppey Backwaters"],
      ["Fort Kochi Chinese fishing nets Kerala", "Fort Kochi"],
      ["Athirappilly Falls Kerala India", "Athirappilly Falls"],
      ["Periyar Lake Thekkady Kerala", "Periyar Lake"],
      ["Varkala Cliff Beach Kerala", "Varkala Beach"],
      ["Padmanabhaswamy Temple Thiruvananthapuram", "Padmanabhaswamy Temple"],
      ["Kumarakom Kerala backwaters", "Kumarakom"]
    ]
  },

  kashmir: {
    tagline: "Alpine lakes, gardens and dramatic mountain scenery",
    bestTime: "March to October; winter experiences depend on conditions",
    carry: "Season-appropriate warm clothing, comfortable shoes and sunscreen.",
    transport: "Local taxis and pre-arranged transfers.",
    overview:
      "Discover Kashmir's lakes, gardens, mountain valleys, local crafts and seasonal landscapes.",
    places: [
      ["Dal Lake Srinagar Kashmir shikara", "Dal Lake"],
      ["Mughal Garden Nishat Bagh Srinagar", "Nishat Bagh"],
      ["Shalimar Bagh Srinagar Kashmir", "Shalimar Bagh"],
      ["Gulmarg Kashmir gondola mountains", "Gulmarg"],
      ["Pahalgam Lidder River Kashmir", "Pahalgam"],
      ["Sonamarg Kashmir valley", "Sonamarg"],
      ["Betaab Valley Pahalgam Kashmir", "Betaab Valley"],
      ["Hazratbal Shrine Srinagar Kashmir", "Hazratbal Shrine"]
    ]
  },

  varanasi: {
    tagline: "Ancient ghats, sacred traditions and timeless streets",
    bestTime: "October to March",
    carry: "Comfortable shoes, modest clothing and drinking water.",
    transport: "Walking, local auto-rickshaws and licensed taxis.",
    overview:
      "Experience Varanasi's riverfront, historic ghats, temples, old lanes and distinctive cultural traditions.",
    places: [
      ["Dashashwamedh Ghat Varanasi Ganges", "Dashashwamedh Ghat"],
      ["Assi Ghat Varanasi India", "Assi Ghat"],
      ["Kashi Vishwanath Temple Varanasi", "Kashi Vishwanath Temple"],
      ["Sarnath Dhamek Stupa Varanasi", "Dhamek Stupa"],
      ["Manikarnika Ghat Varanasi", "Manikarnika Ghat"],
      ["Ramnagar Fort Varanasi Uttar Pradesh", "Ramnagar Fort"],
      ["Banaras Hindu University Vishwanath Temple", "BHU Temple"],
      ["Varanasi Ganges river boats ghats", "Ganges Riverfront"]
    ]
  },

  udaipur: {
    tagline: "Romantic lakes, royal palaces and elegant heritage",
    bestTime: "September to March",
    carry: "Comfortable footwear, sunglasses and light clothing.",
    transport: "Taxi, auto-rickshaw and local transfers.",
    overview:
      "Discover Udaipur's lakes, royal palaces, heritage streets, traditional crafts and scenic waterfronts.",
    places: [
      ["City Palace Udaipur Rajasthan", "City Palace"],
      ["Lake Pichola Udaipur India", "Lake Pichola"],
      ["Jag Mandir Udaipur Rajasthan", "Jag Mandir"],
      ["Saheliyon Ki Bari Udaipur", "Saheliyon Ki Bari"],
      ["Bagore Ki Haveli Udaipur", "Bagore Ki Haveli"],
      ["Fateh Sagar Lake Udaipur", "Fateh Sagar Lake"],
      ["Sajjangarh Monsoon Palace Udaipur", "Monsoon Palace"],
      ["Jagdish Temple Udaipur Rajasthan", "Jagdish Temple"]
    ]
  },

  rishikesh: {
    tagline: "River adventures, forested hills and peaceful escapes",
    bestTime: "September to April",
    carry: "Walking shoes, water bottle and weather-appropriate clothing.",
    transport: "Local taxis, auto-rickshaws and walking.",
    overview:
      "Explore Rishikesh's riverfront, suspension bridges, spiritual landmarks and outdoor experiences.",
    places: [
      ["Lakshman Jhula Rishikesh Uttarakhand", "Lakshman Jhula"],
      ["Ram Jhula Rishikesh India", "Ram Jhula"],
      ["Triveni Ghat Rishikesh", "Triveni Ghat"],
      ["Neelkanth Mahadev Temple Rishikesh", "Neelkanth Mahadev Temple"],
      ["Beatles Ashram Rishikesh", "Beatles Ashram"],
      ["Parmarth Niketan Rishikesh", "Parmarth Niketan"],
      ["Neer Garh Waterfall Rishikesh", "Neer Garh Waterfall"],
      ["Ganga River rafting Rishikesh Uttarakhand", "Ganga River"]
    ]
  },

  ladakh: {
    tagline: "High mountain passes, dramatic landscapes and open skies",
    bestTime: "May to September, subject to road access",
    carry: "Warm layers, sun protection, water and personal medicines.",
    transport: "Pre-arranged transfers; routes depend on weather and road conditions.",
    overview:
      "Explore Ladakh's high-altitude landscapes, monasteries, mountain lakes and scenic routes. Allow time to acclimatise.",
    places: [
      ["Pangong Tso Lake Ladakh India", "Pangong Tso"],
      ["Thiksey Monastery Ladakh", "Thiksey Monastery"],
      ["Hemis Monastery Ladakh India", "Hemis Monastery"],
      ["Shanti Stupa Leh Ladakh", "Shanti Stupa"],
      ["Nubra Valley Ladakh India", "Nubra Valley"],
      ["Khardung La Ladakh mountain pass", "Khardung La"],
      ["Leh Palace Ladakh India", "Leh Palace"],
      ["Magnetic Hill Ladakh India", "Magnetic Hill"]
    ]
  },

  darjeeling: {
    tagline: "Tea-covered hills, mountain views and colonial charm",
    bestTime: "March to May and October to November",
    carry: "Warm layers, walking shoes and rain protection.",
    transport: "Local taxis, shared jeeps and walking.",
    overview:
      "Discover Darjeeling's tea estates, heritage railway, hillside viewpoints and mountain scenery.",
    places: [
      ["Tiger Hill Darjeeling sunrise Kanchenjunga", "Tiger Hill"],
      ["Darjeeling Himalayan Railway toy train", "Darjeeling Toy Train"],
      ["Batasia Loop Darjeeling West Bengal", "Batasia Loop"],
      ["Happy Valley Tea Estate Darjeeling", "Happy Valley Tea Estate"],
      ["Peace Pagoda Darjeeling", "Peace Pagoda"],
      ["Padmaja Naidu Himalayan Zoological Park Darjeeling", "Himalayan Zoo"],
      ["Observatory Hill Darjeeling", "Observatory Hill"],
      ["Ghoom Monastery Darjeeling", "Ghoom Monastery"]
    ]
  },

  andaman: {
    tagline: "Turquoise waters, island beaches and tropical escapes",
    bestTime: "October to May, subject to sea conditions",
    carry: "Beachwear, sunscreen, sandals and reusable water bottle.",
    transport: "Ferries, local taxis and authorised island transfers.",
    overview:
      "Explore Andaman's island beaches, marine scenery, historic landmarks and tropical landscapes.",
    places: [
      ["Radhanagar Beach Havelock Island Andaman", "Radhanagar Beach"],
      ["Cellular Jail Port Blair Andaman", "Cellular Jail"],
      ["Elephant Beach Havelock Andaman", "Elephant Beach"],
      ["Ross Island Netaji Subhash Chandra Bose Island", "Ross Island"],
      ["North Bay Island Andaman lighthouse", "North Bay Island"],
      ["Baratang Limestone Caves Andaman", "Limestone Caves"],
      ["Neil Island Bharatpur Beach Andaman", "Bharatpur Beach"],
      ["Chidiya Tapu Andaman sunset", "Chidiya Tapu"]
    ]
  },

  agra: {
    tagline: "Mughal architecture and the timeless beauty of the Taj",
    bestTime: "October to March",
    carry: "Comfortable shoes, sun protection and drinking water.",
    transport: "Taxi, auto-rickshaw and local transport.",
    overview:
      "Discover Agra's Mughal architecture, the Taj Mahal, historic forts and traditional crafts.",
    places: [
      ["Taj Mahal Agra Uttar Pradesh India", "Taj Mahal"],
      ["Agra Fort Uttar Pradesh India", "Agra Fort"],
      ["Fatehpur Sikri Buland Darwaza Agra", "Fatehpur Sikri"],
      ["Itimad ud Daulah Tomb Agra India", "Tomb of Itimad-ud-Daulah"],
      ["Mehtab Bagh Agra Taj Mahal view", "Mehtab Bagh"],
      ["Akbar Tomb Sikandra Agra", "Akbar's Tomb"],
      ["Jama Masjid Agra Uttar Pradesh", "Jama Masjid"],
      ["Taj Mahal gardens reflecting pool Agra", "Taj Mahal Gardens"]
    ]
  }
};

/* ==========================================================
   GENERAL HELPERS
   ========================================================== */

function normaliseName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Finds destination data by tour name.
 * Exact match first ("Kerala"), then partial ("Kerala Backwaters Tour").
 * Unknown destinations get a generic set of searches so photos
 * still load for any tour added later in the backend.
 */
function getDestination(name) {
  const key = normaliseName(name);

  if (destinations[key]) return destinations[key];

  const partial = Object.keys(destinations).find(k => key.includes(k));
  if (partial) return destinations[partial];

  if (!key) return null;

  const label = String(name).trim();

  return {
    generic: true,
    places: [
      [`${label} India tourism`, label],
      [`${label} India landmark`, `${label} Landmark`],
      [`${label} India landscape`, `${label} Scenery`],
      [`${label} India temple`, `${label} Heritage`],
      [`${label} India market street`, `${label} Streets`],
      [`${label} India view`, `${label} Views`]
    ]
  };
}

function setText(selector, value, fallback = "") {
  const element = $(selector);
  if (!element) return;

  element.textContent = value == null || value === "" ? fallback : value;
}

function setHidden(selector, hidden) {
  const element = $(selector);
  if (element) element.hidden = hidden;
}

function formatPrice(value) {
  if (value == null || value === "") return "Price on request";

  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);

  return number.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  });
}

function showToast(message) {
  const toast = $("#destinationToast");

  if (!toast) {
    console.info(message);
    return;
  }

  toast.textContent = message;
  toast.hidden = false;
  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
    toast.hidden = true;
  }, 2800);
}

function setImage(element, src, alt = "") {
  if (!element || !src) return;

  element.style.display = "";
  element.src = src;
  element.alt = alt;
  element.onerror = () => {
    element.style.display = "none";
  };
}

/** fetch + JSON with a timeout, so a slow API never hangs the page. */
async function fetchJson(url, timeout = REQUEST_TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function stripHtml(html) {
  const doc = new DOMParser().parseFromString(String(html || ""), "text/html");
  return (doc.body.textContent || "").trim();
}

/* ==========================================================
   PHOTO CACHE (sessionStorage, fails silently)
   ========================================================== */

function readCache(key) {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(key, value) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — ignore */
  }
}

/* ==========================================================
   PHOTO SEARCH
   1) Wikimedia Commons — best match scored by relevance
   2) Wikipedia page image — fallback when Commons has nothing
   ========================================================== */

const BAD_TITLE =
  /\b(map|logo|flag|emblem|poster|stamp|coat of arms|diagram|locator|icon|signature|banner|brochure|ticket|chart|plan|sketch|drawing)\b/i;

function keywordsFrom(text) {
  return String(text)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(word => word.length > 3);
}

/** Higher score = better, more relevant, more suitable photo. */
function scoreCommonsPage(page, keywords) {
  const info = page.imageinfo?.[0];
  if (!info) return -1;

  const title = page.title.replace(/^File:/, "");
  if (BAD_TITLE.test(title)) return -1;

  const width = info.width || 0;
  const height = info.height || 0;
  if (width < 800) return -1;

  let score = 0;

  if (/\.jpe?g$/i.test(title)) score += 2;
  if (width >= 1600) score += 1;
  if (width > height) score += 2; // landscape suits cards and hero

  const lowerTitle = title.toLowerCase();
  keywords.forEach(word => {
    if (lowerTitle.includes(word)) score += 3;
  });

  return score;
}

async function searchCommons(query, caption) {
  const url = new URL(COMMONS_API);

  url.search = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `filetype:bitmap ${query}`,
    gsrnamespace: "6",
    gsrlimit: "12",
    prop: "imageinfo",
    iiprop: "url|size|extmetadata",
    iiurlwidth: "1200",
    format: "json",
    origin: "*"
  });

  const data = await fetchJson(url.toString());
  const pages = Object.values(data.query?.pages || {});
  const keywords = keywordsFrom(caption);

  const best = pages
    .map(page => ({ page, score: scoreCommonsPage(page, keywords) }))
    .filter(entry => entry.score >= 0)
    .sort((a, b) => b.score - a.score)[0]?.page;

  if (!best) return null;

  const info = best.imageinfo[0];
  const meta = info.extmetadata || {};

  return {
    title: best.title.replace(/^File:/, ""),
    url: info.thumburl || info.url,
    originalUrl: info.descriptionurl || "",
    credit: stripHtml(meta.Artist?.value) || "Wikimedia Commons",
    license: stripHtml(meta.LicenseShortName?.value) || ""
  };
}

async function searchWikipedia(caption, query) {
  const url = new URL(WIKIPEDIA_API);

  url.search = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: query || caption,
    gsrlimit: "3",
    prop: "pageimages|info",
    piprop: "thumbnail",
    pithumbsize: "1200",
    inprop: "url",
    format: "json",
    origin: "*"
  });

  const data = await fetchJson(url.toString());
  const pages = Object.values(data.query?.pages || {}).sort(
    (a, b) => (a.index || 0) - (b.index || 0)
  );

  const page = pages.find(item => item.thumbnail?.source);
  if (!page) return null;

  return {
    title: page.title,
    url: page.thumbnail.source,
    originalUrl: page.fullurl || "",
    credit: "Wikipedia",
    license: ""
  };
}

async function findPhoto(query, caption) {
  const cacheKey = query.toLowerCase();
  const cached = readCache(cacheKey);
  if (cached) return cached;

  let photo = null;

  try {
    photo = await searchCommons(query, caption);
  } catch (error) {
    console.warn("Commons search failed:", query, error);
  }

  if (!photo) {
    try {
      photo = await searchWikipedia(caption, query);
    } catch (error) {
      console.warn("Wikipedia search failed:", query, error);
    }
  }

  if (photo) writeCache(cacheKey, photo);
  return photo;
}

/** One photo per landmark; order follows the destination's place list. */
async function loadLocationPhotos(destination) {
  const results = await Promise.allSettled(
    destination.places.map(async ([query, caption]) => {
      const photo = await findPhoto(query, caption);
      return photo ? { ...photo, query, caption } : null;
    })
  );

  const usedUrls = new Set();
  const photos = [];

  results.forEach(result => {
    if (result.status !== "fulfilled" || !result.value) return;
    if (usedUrls.has(result.value.url)) return;

    usedUrls.add(result.value.url);
    photos.push(result.value);
  });

  return photos;
}

/* ==========================================================
   LOADING / ERROR
   ========================================================== */

function showLoading(show) {
  setHidden("#destinationLoading", !show);
}

function showError(message) {
  showLoading(false);
  setHidden("#destinationContent", true);
  setHidden("#destinationError", false);
  setText("#destinationErrorMessage", message);
}

/* ==========================================================
   HERO
   ========================================================== */

function renderHero(tour, destination, photos) {
  currentDestinationName = tour.name || selectedName || "Destination";

  document.title = `${currentDestinationName} Tour Details | Go Trip`;

  const tagline = destination?.tagline || tour.description;

  setText("#breadcrumbDestination", currentDestinationName);
  setText("#destinationLocation", tour.location || "India", "India");
  setText("#destinationName", currentDestinationName);
  setText(
    "#destinationShortDescription",
    tagline,
    `Explore ${currentDestinationName} with Go Trip.`
  );
  setText("#destinationDuration", tour.duration || "Duration varies");
  setText(
    "#destinationRating",
    tour.rating ? `★ ${tour.rating}` : "Explore this destination"
  );
  setText("#destinationPrice", formatPrice(tour.price));
  setText(
    "#destinationDescription",
    destination?.overview || tour.description,
    `Explore attractions and local experiences in ${currentDestinationName}.`
  );

  const caption = $("#heroImageCaption");

  if (caption) {
    caption.textContent = `${currentDestinationName} — ${
      tagline || "Explore with Go Trip"
    }`;

    const eyebrow = document.createElement("span");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = "EXPLORE WITH GO TRIP";
    caption.prepend(eyebrow);
  }

  const hero = $("#destinationHeroImage");

  if (photos[0]?.url) {
    setImage(hero, photos[0].url, `${currentDestinationName} — ${photos[0].caption}`);
  } else if (tour.image) {
    setImage(hero, tour.image, currentDestinationName);
  }
}

/* ==========================================================
   HIGHLIGHTS
   ========================================================== */

function renderHighlights(destination, photos) {
  const container = $("#destinationHighlights");
  if (!container) return;

  container.replaceChildren();

  const icons = ["📍", "📸", "✨", "🌿"];

  (destination?.places || []).slice(0, 4).forEach(([query, caption], index) => {
    const photoItem = photos.find(item => item.query === query);

    const card = document.createElement("article");
    card.className = "highlight-card experience-card";

    if (photoItem?.url) {
      const imageWrap = document.createElement("div");
      imageWrap.className = "experience-image-wrap";

      const img = document.createElement("img");
      img.src = photoItem.url;
      img.alt = `${caption}, ${currentDestinationName}`;
      img.loading = "lazy";
      img.onerror = () => imageWrap.remove();

      imageWrap.appendChild(img);
      card.appendChild(imageWrap);
    }

    const copy = document.createElement("div");
    copy.className = "experience-copy";

    const icon = document.createElement("span");
    icon.className = "highlight-icon";
    icon.textContent = icons[index % icons.length];

    const heading = document.createElement("h3");
    heading.textContent = caption;

    const description = document.createElement("p");
    description.textContent =
      `Discover ${caption}, a landmark or experience associated with ${currentDestinationName}. Check local access and opening information before visiting.`;

    copy.append(icon, heading, description);
    card.appendChild(copy);
    container.appendChild(card);
  });
}

/* ==========================================================
   GALLERY
   ========================================================== */

function renderGalleryMessage(gallery, text) {
  gallery.replaceChildren();

  const message = document.createElement("p");
  message.className = "gallery-message";
  message.textContent = text;
  gallery.appendChild(message);
}

function renderGallery(photos) {
  const gallery = $("#destinationGallery");
  if (!gallery) return;

  if (!photos.length) {
    renderGalleryMessage(
      gallery,
      "Location photos could not be loaded. Please try again later."
    );
    return;
  }

  gallery.replaceChildren();

  photos.slice(0, 8).forEach(item => {
    const figure = document.createElement("figure");
    figure.className = "gallery-item";

    const img = document.createElement("img");
    img.src = item.url;
    img.alt = `${item.caption}, ${currentDestinationName}`;
    img.loading = "lazy";
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", `Open ${item.caption}`);

    const caption = document.createElement("figcaption");
    caption.textContent = item.caption;

    const open = () => openPhotoViewer(item);

    img.addEventListener("click", open);
    img.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });

    img.onerror = () => {
      figure.remove();

      if (!gallery.querySelector(".gallery-item")) {
        renderGalleryMessage(gallery, "Location photos could not be loaded.");
      }
    };

    figure.append(img, caption);
    gallery.appendChild(figure);
  });
}

/* ==========================================================
   PHOTO VIEWER
   ========================================================== */

function createPhotoViewer() {
  const viewer = document.createElement("div");
  viewer.id = "photoViewer";
  viewer.className = "photo-viewer";
  viewer.hidden = true;
  viewer.setAttribute("role", "dialog");
  viewer.setAttribute("aria-modal", "true");
  viewer.setAttribute("aria-label", "Photo viewer");

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "photo-viewer-close";
  closeButton.textContent = "×";
  closeButton.setAttribute("aria-label", "Close image");

  const img = document.createElement("img");
  const caption = document.createElement("p");
  const credit = document.createElement("small");
  credit.className = "photo-viewer-credit";

  const sourceLink = document.createElement("a");
  sourceLink.target = "_blank";
  sourceLink.rel = "noopener noreferrer";
  sourceLink.textContent = "View original source";
  sourceLink.style.color = "#d6f3e3";

  viewer.append(closeButton, img, caption, credit, sourceLink);
  document.body.appendChild(viewer);

  const close = () => {
    viewer.hidden = true;
    document.body.style.overflow = "";
  };

  viewer.addEventListener("click", event => {
    if (event.target === viewer || event.target.closest(".photo-viewer-close")) {
      close();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !viewer.hidden) close();
  });

  return viewer;
}

function openPhotoViewer(item) {
  const viewer = $("#photoViewer") || createPhotoViewer();

  const img = viewer.querySelector("img");
  img.src = item.url;
  img.alt = `${item.caption}, ${currentDestinationName}`;

  viewer.querySelector("p").textContent = item.caption;

  const creditText = [item.credit, item.license].filter(Boolean).join(" · ");
  viewer.querySelector(".photo-viewer-credit").textContent = creditText
    ? `Photo: ${creditText}`
    : "";

  viewer.querySelector("a").href = item.originalUrl || item.url;

  viewer.hidden = false;
  document.body.style.overflow = "hidden";
  viewer.querySelector(".photo-viewer-close").focus();
}

/* ==========================================================
   ITINERARY
   ========================================================== */

function joinNames(names) {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

function renderItinerary(destination, photos) {
  const container = $("#destinationItinerary");
  if (!container) return;

  container.replaceChildren();

  const names = (destination?.places || []).map(([, caption]) => caption);

  const itinerary = [
    {
      day: "1",
      title: `Arrive in ${currentDestinationName}`,
      text: names.length
        ? `Check in according to your confirmed arrangements, settle in and enjoy a relaxed evening. Nearby highlights include ${joinNames(names.slice(0, 2))}.`
        : "Check in according to your confirmed arrangements, explore nearby attractions and enjoy a relaxed evening."
    },
    {
      day: "2",
      title: "Explore the destination highlights",
      text: names.length
        ? `Discover ${joinNames(names.slice(2, 5))} and other local experiences. Opening hours, travel times and weather may affect your plans.`
        : "Discover the selected landmarks and local experiences. Opening hours, travel times and weather may affect your plans."
    },
    {
      day: "3",
      title: "Local experiences and departure",
      text: names.length
        ? `Enjoy a final stop such as ${joinNames(names.slice(5, 7))} or a local food experience before your onward journey.`
        : "Enjoy a final sightseeing stop or local food experience before your onward journey."
    }
  ];

  itinerary.forEach((day, index) => {
    const item = document.createElement("article");
    item.className = "itinerary-item";

    const marker = document.createElement("div");
    marker.className = "day-marker";

    const number = document.createElement("span");
    number.textContent = day.day;
    marker.appendChild(number);

    const card = document.createElement("div");
    card.className = "itinerary-card";

    // Day 1 → photos[0], Day 2 → photos[2], Day 3 → photos[5] (spread out, no repeats)
    const photoItem = photos[[0, 2, 5][index]] || photos[index];

    if (photoItem?.url) {
      const img = document.createElement("img");
      img.className = "itinerary-photo";
      img.src = photoItem.url;
      img.alt = `${day.title} — ${photoItem.caption}`;
      img.loading = "lazy";
      img.onerror = () => img.remove();
      card.appendChild(img);
    }

    const eyebrow = document.createElement("span");
    eyebrow.className = "itinerary-eyebrow";
    eyebrow.textContent = `DAY ${day.day}`;

    const heading = document.createElement("h3");
    heading.textContent = day.title;

    const paragraph = document.createElement("p");
    paragraph.textContent = day.text;

    card.append(eyebrow, heading, paragraph);
    item.append(marker, card);
    container.appendChild(item);
  });
}

/* ==========================================================
   PACKAGE AND TRAVEL INFORMATION
   ========================================================== */

function addListItems(selector, items) {
  const container = $(selector);
  if (!container) return;

  container.replaceChildren();

  items.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    container.appendChild(li);
  });
}

function renderTravelInfo(destination) {
  setText(
    "#bestTimeToVisit",
    destination?.bestTime || "Check seasonal weather before travelling."
  );
  setText(
    "#whatToCarry",
    destination?.carry || "Carry suitable clothing and personal essentials."
  );
  setText(
    "#gettingAround",
    destination?.transport || "Confirm local transportation before travelling."
  );

  addListItems("#destinationInclusions", [
    "Only services explicitly listed in your selected package are included.",
    "Review the confirmed itinerary and booking voucher."
  ]);

  addListItems("#destinationExclusions", [
    "Transport, meals, accommodation and activities unless explicitly included.",
    "Personal expenses and optional activities unless confirmed in the package."
  ]);
}

/* ==========================================================
   FAQ
   ========================================================== */

function renderFAQs(destination) {
  const container = $("#destinationFaq") || $(".faq-list");
  if (!container) return;

  container.replaceChildren();

  const faqs = [
    [
      "What is the best time to visit?",
      destination?.bestTime || "Check local weather and seasonal conditions."
    ],
    [
      "Are activities included in the price?",
      "Only activities explicitly listed in your selected package are included."
    ],
    [
      "Are hotels and transfers included?",
      "These depend on the actual package. Review your booking details."
    ],
    [
      "Can weather affect the itinerary?",
      "Yes. Outdoor activities and routes may change due to weather and local guidance."
    ],
    [
      "What should I carry?",
      destination?.carry || "Carry comfortable clothes and personal essentials."
    ],
    [
      "How can I book this tour?",
      "Use the booking button to return to the Go Trip tours section."
    ]
  ];

  faqs.forEach(([question, answer]) => {
    const details = document.createElement("details");
    details.className = "faq-item";

    const summary = document.createElement("summary");
    summary.textContent = question;

    const paragraph = document.createElement("p");
    paragraph.textContent = answer;

    details.append(summary, paragraph);
    container.appendChild(details);
  });
}

/* ==========================================================
   BOOKING AND SHARE BUTTONS
   ========================================================== */


function setupBookingButtons(tour) {
    const buttons = [
        document.getElementById("bookSelectedTour"),
        document.getElementById("sidebarBookTour")
    ].filter(Boolean);

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            sessionStorage.setItem(
                "selectedTourForBooking",
                JSON.stringify(tour)
            );

            window.location.href = "index.html?openBooking=1";
        });
    });
}


function setupShareButton() {
  const button = $("#shareDestination");
  if (!button) return;

  button.onclick = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          text: `Explore ${currentDestinationName} with Go Trip`,
          url: window.location.href
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Destination link copied!");
      } else {
        showToast("Copy the URL from your browser address bar.");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        showToast("Unable to share right now.");
      }
    }
  };
}

/* ==========================================================
   COMPLETE DESTINATION RENDER
   Text content appears immediately; photos fill in afterwards
   so the page never waits on the image search.
   ========================================================== */

async function renderDestination(tour) {
  currentTour = tour;
  currentDestinationName = tour.name || selectedName || "Destination";

  const destination = getDestination(currentDestinationName);

  showLoading(false);
  setHidden("#destinationError", true);
  setHidden("#destinationContent", false);
  setText("#currentYear", new Date().getFullYear());

  // 1) Instant render without photos
  renderHero(tour, destination, []);
  renderHighlights(destination, []);
  renderItinerary(destination, []);
  renderTravelInfo(destination);
  renderFAQs(destination);
  setupBookingButtons(tour);

  const gallery = $("#destinationGallery");
  if (gallery) renderGalleryMessage(gallery, "Loading location photos…");

  // 2) Photos, then re-render the photo-based sections
  if (!destination) {
    renderGallery([]);
    return;
  }

  const photos = await loadLocationPhotos(destination);
  currentPhotos = photos;

  renderHero(tour, destination, photos);
  renderHighlights(destination, photos);
  renderGallery(photos);
  renderItinerary(destination, photos);

  
}

/* ==========================================================
   LOAD FROM SPRING BOOT
   ========================================================== */

async function loadDestination() {
  showLoading(true);
  setHidden("#destinationError", true);
  setHidden("#destinationContent", true);

  if (!selectedId && !selectedName) {
    showError(
      "Destination not selected. Return to Explore Tours and choose a destination."
    );
    return;
  }

  try {
    const tours = await fetchJson(API_URL);

    if (!Array.isArray(tours)) {
      throw new Error("The tours API did not return a list.");
    }

    const tour = tours.find(item =>
      selectedId
        ? String(item.id) === String(selectedId)
        : normaliseName(item.name) === normaliseName(selectedName)
    );

    if (!tour) {
      showError(
        "Tour not found in the backend. Check that the destination exists in /api/tours."
      );
      return;
    }

    await renderDestination(tour);
  } catch (error) {
    console.error("Destination loading failed:", error);

    showError(
      "Unable to load tour details. Make sure Spring Boot is running at http://localhost:8080 and try again."
    );
  }
}

/* ==========================================================
   INITIALISE
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  setupShareButton();
  setText("#currentYear", new Date().getFullYear());
  loadDestination();
});




function connectBookThisTourButton(tour) {
  const buttons = [
    document.getElementById("bookSelectedTour"),
    document.getElementById("sidebarBookTour")
  ].filter(Boolean);

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      // Selected tour ki ID aur details homepage ko bhejo.
      const tourId = tour.id;

      window.location.href =
        `index.html?tourId=${encodeURIComponent(tourId)}#tours`;
    });
  });
}
