/**
 * main.js — TechScribe Interactivity Hub
 * ─────────────────────────────────────────────────────────────────
 * This file handles all interactive behaviour:
 *   1. Theme toggle (dark / light) with localStorage persistence
 *   2. Mobile navigation hamburger menu
 *   3. Navbar scroll shadow effect
 *   4. Newsletter form client-side validation
 *   5. Dynamic copyright year
 *   6. Single post page rendering (reads ?id= from URL)
 *   7. Related posts rendering on post.html
 * ─────────────────────────────────────────────────────────────────
 */

/**
 * Utility: escape HTML strings to protect against XSS injection
 */
function escapeHTML(str) {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ══════════════════════════════════════════════════════════════════
// 1. THEME TOGGLE
//    We store the user's preference in localStorage so it persists
//    between page loads. The <html> element has data-theme="dark"
//    by default in HTML. JS checks localStorage first.
// ══════════════════════════════════════════════════════════════════

/**
 * Apply a theme by setting data-theme on <html> and updating the
 * toggle button icon. Also saves the choice to localStorage.
 * @param {string} theme - "dark" or "light"
 */
function applyTheme(theme) {
  // Set the attribute — CSS variables in :root react to this
  document.documentElement.setAttribute("data-theme", theme);

  // Swap the icon in the toggle button
  const themeIcon = document.getElementById("theme-icon");
  if (themeIcon) {
    themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
    themeIcon.setAttribute("title", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }

  // Persist the user's choice
  localStorage.setItem("techscribe-theme", theme);
}

/**
 * Initialise the theme on page load.
 * Priority: 1) localStorage  2) OS preference  3) dark (default)
 */
function initTheme() {
  const saved = localStorage.getItem("techscribe-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (saved) {
    applyTheme(saved);
  } else if (prefersDark) {
    applyTheme("dark");
  } else {
    applyTheme("light");
  }
}

/**
 * Wire up the theme toggle button click handler.
 */
function setupThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });
}


// ══════════════════════════════════════════════════════════════════
// 2. MOBILE NAVIGATION
//    The hamburger button toggles a .nav-open class on the nav-links
//    list, which responsive.css animates in/out.
// ══════════════════════════════════════════════════════════════════

function setupMobileNav() {
  const hamburger = document.getElementById("hamburger");
  const navLinks  = document.getElementById("nav-links");
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("nav-open");

    // Update accessibility attributes
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    hamburger.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");

    // Animate the hamburger into an X
    hamburger.classList.toggle("is-open", isOpen);

    // Prevent body scroll while menu is open on mobile
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Close the nav when a link is clicked (single-page navigation)
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("nav-open");
      hamburger.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  // Close when clicking outside the nav area
  document.addEventListener("click", (e) => {
    const clickedOutside =
      !navLinks.contains(e.target) && !hamburger.contains(e.target);
    if (clickedOutside && navLinks.classList.contains("nav-open")) {
      navLinks.classList.remove("nav-open");
      hamburger.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });
}


// ══════════════════════════════════════════════════════════════════
// 3. NAVBAR SCROLL SHADOW
//    Adds a .scrolled class to the header when the page scrolls
//    past the navbar height. The CSS adds a box-shadow.
// ══════════════════════════════════════════════════════════════════

function setupNavbarScroll() {
  const header = document.getElementById("site-header");
  if (!header) return;

  // IntersectionObserver is more performant than a scroll event listener
  // We observe an invisible sentinel element at the top of <main>
  const sentinel = document.createElement("div");
  sentinel.style.cssText = "position:absolute;top:0;left:0;height:1px;width:1px;pointer-events:none;";
  document.body.prepend(sentinel);

  const observer = new IntersectionObserver(
    ([entry]) => {
      header.classList.toggle("scrolled", !entry.isIntersecting);
    },
    { rootMargin: "-70px 0px 0px 0px" }
  );
  observer.observe(sentinel);
}


// ══════════════════════════════════════════════════════════════════
// 4. NEWSLETTER FORM VALIDATION
//    Pure client-side UX — no form actually submits to a server.
// ══════════════════════════════════════════════════════════════════

function setupNewsletterForm() {
  const form    = document.getElementById("newsletter-form");
  const input   = document.getElementById("newsletter-email");
  const message = document.getElementById("form-message");
  const btn     = document.getElementById("newsletter-submit");

  if (!form || !input || !message) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email        = input.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      showFormMessage(message, "⚠️ Please enter your email address.", "error");
      input.focus();
      return;
    }

    if (!emailPattern.test(email)) {
      showFormMessage(message, "⚠️ Please enter a valid email address.", "error");
      input.focus();
      return;
    }

    btn.textContent = "Subscribing\u2026";
    btn.disabled    = true;

    setTimeout(() => {
      showFormMessage(
        message,
        `\u2705 Thanks! We'll send new articles to ${escapeHTML(email)}`,
        "success"
      );
      input.value     = "";
      btn.textContent = "Subscribe";
      btn.disabled    = false;
    }, 900);
  });
}

/**
 * Update the newsletter form message element.
 * @param {HTMLElement} el
 * @param {string} text
 * @param {"success"|"error"} type
 */
function showFormMessage(el, text, type) {
  el.textContent = text;
  el.className   = `form-message ${type}`;
}


// ══════════════════════════════════════════════════════════════════
// 5. DYNAMIC COPYRIGHT YEAR
// ══════════════════════════════════════════════════════════════════

function setCopyrightYear() {
  const yearEl = document.getElementById("copyright-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}


// ══════════════════════════════════════════════════════════════════
// 6. SINGLE POST PAGE — RENDER, EDIT, DELETE
//    Reads ?id= from the URL, finds the post in merged pool.
//    If the post exists in localStorage (user-authored), injects
//    Edit and Delete action buttons into the hero banner.
// ══════════════════════════════════════════════════════════════════

function renderPostPage() {
  // Guard: only run on post.html
  const article = document.getElementById("post-article");
  if (!article || !window.POSTS) return;

  const params = new URLSearchParams(window.location.search);
  const rawId  = params.get("id");

  // ── Build merged pool: user posts first, then static ──────────
  let userPosts = [];
  try {
    userPosts = JSON.parse(localStorage.getItem("userPosts")) || [];
  } catch {
    userPosts = [];
  }
  const allPosts = [...userPosts, ...window.POSTS];

  // ── Locate the post ───────────────────────────────────────────
  const post = allPosts.find((p) => String(p.id) === String(rawId));

  if (!post) {
    article.innerHTML = `
      <div class="post-not-found">
        <h2>404 — Post Not Found</h2>
        <p>The post you're looking for doesn't exist or has been moved.</p>
        <a href="index.html" class="btn btn-primary" style="margin-top:1.5rem;">← Back to Home</a>
      </div>
    `;
    return;
  }

  // ── Update tab title and meta description ─────────────────────
  document.title = `${post.title} — TechScribe`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", post.excerpt);

  // ── Is this a user-authored post? ────────────────────────────
  const isUserPost = userPosts.some((p) => String(p.id) === String(rawId));

  // ── Render hero banner ────────────────────────────────────────
  const hero = document.getElementById("post-hero");
  if (hero) {
    hero.style.background = post.gradient;

    const authorBioHTML = post.authorBio
      ? `<p class="post-hero-bio">\u201c${escapeHTML(post.authorBio)}\u201d</p>`
      : "";

    const userActionsHTML = isUserPost
      ? `<div class="post-user-actions" id="post-user-actions">
           <a href="add-article.html?edit=${encodeURIComponent(String(post.id))}"
              class="btn btn-sm btn-ghost post-action-btn"
              id="btn-edit-post"
              aria-label="Edit this article">
             \u270f\ufe0f Edit
           </a>
           <button
             class="btn btn-sm btn-danger post-action-btn"
             id="btn-delete-post"
             aria-label="Delete this article">
             \uD83D\uDDD1\uFE0F Delete
           </button>
         </div>`
      : "";

    hero.innerHTML = `
      <div class="post-hero-inner">
        <span class="post-hero-badge">${escapeHTML(post.category)}</span>
        <h1 class="post-hero-title">${escapeHTML(post.title)}</h1>
        <div class="post-hero-meta">
          <span class="post-meta-author">\u270d\ufe0f ${escapeHTML(post.author)}</span>
          <span>\uD83D\uDCC5 ${new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          <span>\u23f1\ufe0f ${escapeHTML(post.readTime)}</span>
        </div>
        ${authorBioHTML}
        ${userActionsHTML}
      </div>
    `;
  }

  // ── Render full post body ─────────────────────────────────────
  article.innerHTML = post.content;

  // ── Wire Delete button ────────────────────────────────────────
  if (isUserPost) {
    const deleteBtn = document.getElementById("btn-delete-post");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        const confirmed = window.confirm(
          `Delete "${post.title}"?\n\nThis action cannot be undone.`
        );
        if (!confirmed) return;

        let stored = [];
        try {
          stored = JSON.parse(localStorage.getItem("userPosts")) || [];
        } catch { stored = []; }

        const updated = stored.filter((p) => String(p.id) !== String(rawId));
        localStorage.setItem("userPosts", JSON.stringify(updated));

        window.location.href = "index.html";
      });
    }
  }

  // ── Render related posts ──────────────────────────────────────
  renderRelatedPosts(post, allPosts);
}


// ══════════════════════════════════════════════════════════════════
// 7. RELATED POSTS
//    Picks 3 random posts that are NOT the current post and
//    renders them as compact cards in the related-grid.
// ══════════════════════════════════════════════════════════════════

function renderRelatedPosts(currentPost, allPosts) {
  const relatedGrid = document.getElementById("related-grid");
  if (!relatedGrid || !window.POSTS) return;

  // Use the provided merged array, or fall back to static posts only
  const pool = allPosts || window.POSTS;

  // Filter out the current post, then shuffle, then take 3
  const others = pool.filter((p) => String(p.id) !== String(currentPost.id));

  // Fisher-Yates shuffle — fair random ordering
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]]; // ES6 destructuring swap
  }

  const related = others.slice(0, 3);

  relatedGrid.innerHTML = related
    .map(
      (post) => `
      <a href="post.html?id=${post.id}" class="related-card" aria-label="Read ${post.title}">
        <div class="related-thumb" style="background: ${post.gradient};"></div>
        <div class="related-body">
          <span class="related-cat">${post.category}</span>
          <p class="related-post-title">${post.title}</p>
        </div>
      </a>
    `
    )
    .join("");
}


// ══════════════════════════════════════════════════════════════════
// INIT — Run everything after DOM is ready
// (The 'defer' attribute on the script tag ensures this file runs
//  after the HTML is fully parsed, so no DOMContentLoaded needed)
// ══════════════════════════════════════════════════════════════════

function init() {
  initTheme();           // Must be first — applies saved/OS theme
  setupThemeToggle();    // Wire toggle button
  setupMobileNav();      // Wire hamburger
  setupNavbarScroll();   // Scroll shadow on header
  setupNewsletterForm(); // Form validation
  setCopyrightYear();    // Dynamic year in footer
  renderPostPage();      // Runs on post.html (no-op on other pages)
}

// Entry point
init();
