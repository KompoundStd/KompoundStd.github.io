// ------------------------------------------------------------------------------------------------------------------
// Fill these in and the site updates itself. Leave one empty ("") and its button says "coming soon" or is left out.
// ------------------------------------------------------------------------------------------------------------------
const SITE = {
  // NOT A BUG: Idle Defense
  steam: "",        // the Steam store page, e.g. "https://store.steampowered.com/app/1234560/"
  itch: "",         // the itch.io demo page, e.g. "https://kompoundstd.itch.io/not-a-bug"
  // Wipe Them Out! (its demo is on the same store page)
  "wto-steam": "https://store.steampowered.com/app/5154590/Wipe_Them_Out/",
  "wto-demo": "https://store.steampowered.com/app/5154590/Wipe_Them_Out/",
  email: "",        // the contact address
  socials: [
    // ["X", "https://x.com/..."],
    // ["YouTube", "https://youtube.com/@..."],
    // ["Discord", "https://discord.gg/..."],
  ],
};

// The store and demo buttons.
document.querySelectorAll("[data-link], [data-game-link]").forEach((a) => {
  const url = SITE[a.dataset.link || a.dataset.gameLink];
  if (url) {
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
  } else {
    a.setAttribute("aria-disabled", "true");
    a.removeAttribute("href");
    a.insertAdjacentHTML("beforeend", " <small>(coming soon)</small>");
  }
});

// Contact links.
const contact = document.querySelector("[data-contact]");
const links = [];
if (SITE.email) links.push(["Email " + SITE.email, "mailto:" + SITE.email]);
SITE.socials.forEach(([name, url]) => links.push([name, url]));
links.forEach(([label, url]) => {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.className = "btn";
  a.href = url;
  a.textContent = label;
  if (!url.startsWith("mailto:")) { a.target = "_blank"; a.rel = "noopener"; }
  li.appendChild(a);
  contact.appendChild(li);
});
if (!links.length) document.querySelector("[data-contact-intro]").textContent = "Contact details are coming soon.";

document.querySelector("[data-year]").textContent = new Date().getFullYear();

// The feature clips load and play only while on screen (and not at all for people who prefer less motion).
const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clips = document.querySelectorAll("video[data-lazy]");
if (!still && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const v = e.target;
      if (e.isIntersecting) { v.preload = "auto"; v.play().catch(() => {}); }
      else v.pause();
    });
  }, { threshold: 0.35 });
  clips.forEach((v) => io.observe(v));
}
if (still) document.querySelectorAll("video[autoplay]").forEach((v) => { v.removeAttribute("autoplay"); v.pause(); });

// Screenshot viewer.
const box = document.querySelector(".lightbox");
const boxImg = box.querySelector("img");
let opener = null;
function closeBox() { box.hidden = true; boxImg.src = ""; if (opener) opener.focus(); }
document.querySelectorAll(".shot-grid a").forEach((a) => {
  a.addEventListener("click", (ev) => {
    ev.preventDefault();
    opener = a;
    boxImg.src = a.href;
    boxImg.alt = a.querySelector("img").alt;
    box.hidden = false;
    box.querySelector(".lightbox-close").focus();
  });
});
box.addEventListener("click", (ev) => { if (ev.target !== boxImg) closeBox(); });
document.addEventListener("keydown", (ev) => { if (ev.key === "Escape" && !box.hidden) closeBox(); });
