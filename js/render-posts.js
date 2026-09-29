/**
 * render-posts.js
 * ─────────────────────────────────────────────────────────────────
 * Responsible for:
 *  1. Building and injecting post cards into #posts-grid
 *  2. Rendering category filter buttons in #filter-bar
 *  3. Handling filter button clicks (no page reload)
 *  4. Merging localStorage user posts with the static POSTS array
 *
 * This script runs AFTER posts-data.js (load order in index.html),
 * so window.POSTS is guaranteed to exist by the time this runs.
 * ─────────────────────────────────────────────────────────────────
 */

// ── Merge user posts (localStorage) with static posts ─────────────
// Reads the "userPosts" key, default to []. Newest user posts go first
// (they are already stored newest-first via unshift in storage.js),
// then the static posts follow.
function getMergedPosts() {
  let userPosts = [];
  try {
    userPosts = JSON.parse(localStorage.getItem("userPosts")) || [];
  } catch {
    userPosts = [];
  }
  // Concatenate: user posts first (newest), then curated static posts
  return [...userPosts, ...window.POSTS];
}

// ── Utility: format ISO date string → readable format ─────────────
// Input:  "2026-09-10"
// Output: "September 10, 2026"
function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Escape HTML special characters for safe injection.
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

// ── Build a single post card HTML string ──────────────────────────
// Returns a string of HTML with safe escaping for all dynamic user inputs.
function buildPostCard(post) {
  const safeTitle    = escapeHTML(post.title);
  const safeAuthor   = escapeHTML(post.author);
  const safeCategory = escapeHTML(post.category);
  const safeExcerpt  = escapeHTML(post.excerpt);
  const safeReadTime = escapeHTML(post.readTime);
  const authorInitial = safeAuthor.trim().charAt(0).toUpperCase() || "?";

  return `
    <article class="post-card" id="card-${post.id}" aria-label="${safeTitle}">
      <!-- Thumbnail: CSS gradient instead of an image file -->
      <a href="post.html?id=${post.id}" class="card-thumbnail" style="background: ${post.gradient};" aria-hidden="true" tabindex="-1">
        <span class="card-category-badge">${safeCategory}</span>
      </a>

      <!-- Card body -->
      <div class="card-body">
        <!-- Category + read time meta -->
        <div class="card-meta">
          <span class="card-category">${safeCategory}</span>
          <span class="card-dot" aria-hidden="true">·</span>
          <span class="card-read-time">${safeReadTime}</span>
        </div>

        <!-- Title links to the single post page with ?id= query param -->
        <h3 class="card-title">
          <a href="post.html?id=${post.id}" class="card-title-link">${safeTitle}</a>
        </h3>

        <!-- Short teaser paragraph -->
        <p class="card-excerpt">${safeExcerpt}</p>

        <!-- Footer: author + date + CTA -->
        <div class="card-footer">
          <div class="card-author-info">
            <!-- Generated avatar using first letter of author name -->
            <div class="author-avatar" aria-hidden="true">${authorInitial}</div>
            <div>
              <span class="author-name">${safeAuthor}</span>
              <span class="card-date">${formatDate(post.date)}</span>
            </div>
          </div>
          <a href="post.html?id=${post.id}" class="btn btn-sm btn-outline" aria-label="Read ${safeTitle}">
            Read More →
          </a>
        </div>
      </div>
    </article>
  `;
}

// ── Render a filtered (or full) list of posts into #posts-grid ────
function renderPosts(postsToRender) {
  const grid = document.getElementById("posts-grid");
  const emptyState = document.getElementById("empty-state");

  if (!grid) return; // Guard: only run on pages that have the grid

  if (postsToRender.length === 0) {
    // Show friendly empty state message
    grid.innerHTML = "";
    emptyState?.classList.remove("hidden");
    return;
  }

  emptyState?.classList.add("hidden");

  // Join all card HTML strings and inject at once (one DOM write = better performance)
  grid.innerHTML = postsToRender.map(buildPostCard).join("");

  // Trigger staggered animation: add "visible" class to each card with a delay
  const cards = grid.querySelectorAll(".post-card");
  cards.forEach((card, index) => {
    // Use setTimeout to stagger each card's entrance animation
    setTimeout(() => {
      card.classList.add("card-visible");
    }, index * 80); // 80ms delay between each card
  });
}

// ── Build category filter buttons ─────────────────────────────────
function renderFilterButtons() {
  const filterBar = document.getElementById("filter-bar");
  if (!filterBar) return;

  // Use merged array so categories from user posts also appear as filters
  const allPosts = getMergedPosts();

  // Extract unique categories; "All" is always first
  const categories = ["All", ...new Set(allPosts.map((p) => p.category))];

  // Build button HTML for each category
  filterBar.innerHTML = categories
    .map(
      (cat) => `
      <button
        class="filter-btn ${cat === "All" ? "active" : ""}"
        data-category="${cat}"
        id="filter-${cat.replace(/[^a-zA-Z]/g, "-")}"
        aria-pressed="${cat === "All" ? "true" : "false"}"
      >
        ${cat}
      </button>
    `
    )
    .join("");

  // Attach click listeners to each button
  filterBar.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", handleFilterClick);
  });
}

// ── Handle filter button click ────────────────────────────────────
function handleFilterClick(event) {
  const clickedBtn = event.currentTarget;
  const selectedCategory = clickedBtn.dataset.category;

  // Update active state: remove from all, add to clicked
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
    btn.setAttribute("aria-pressed", "false");
  });
  clickedBtn.classList.add("active");
  clickedBtn.setAttribute("aria-pressed", "true");

  // Filter the MERGED array (user posts + static posts)
  const allPosts = getMergedPosts();
  const filtered =
    selectedCategory === "All"
      ? allPosts
      : allPosts.filter((post) => post.category === selectedCategory);

  // Re-render the grid with the filtered set
  renderPosts(filtered);
}

// ── Update hero stat counters ─────────────────────────────────────
// Reads merged posts and writes live counts into #stat-articles and
// #stat-categories. Called on every page init so it always reflects
// the current localStorage + static post pool.
function updateHeroStats(allPosts) {
  const articlesEl   = document.getElementById("stat-articles");
  const categoriesEl = document.getElementById("stat-categories");
  if (!articlesEl && !categoriesEl) return; // not on homepage

  if (articlesEl) {
    articlesEl.textContent = allPosts.length;
  }
  if (categoriesEl) {
    const uniqueCategories = new Set(allPosts.map((p) => p.category));
    categoriesEl.textContent = uniqueCategories.size;
  }
}

// ── Entry point: runs when the DOM is ready ───────────────────────
// The 'defer' attribute on the script tag ensures this runs after
// the HTML is fully parsed — no need for DOMContentLoaded wrapper.
function initBlogGrid() {
  // Only run on index.html (page must have #posts-grid)
  if (!document.getElementById("posts-grid")) return;

  // Get merged array (user posts first, then static) once at init
  const allPosts = getMergedPosts();

  updateHeroStats(allPosts);  // Step 0: Sync article/category counts
  renderFilterButtons();      // Step 1: Build filter buttons
  renderPosts(allPosts);      // Step 2: Show all posts
}

// Call the init function
initBlogGrid();
