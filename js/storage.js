/**
 * storage.js — Add Article Form Logic
 * ─────────────────────────────────────────────────────────────────
 * Handles the "Write" page (add-article.html):
 *   1. Live word-count display on the textarea
 *   2. Form validation (inline errors, no libraries)
 *   3. Building an article object matching the posts-data.js schema
 *   4. Saving to localStorage under key "userPosts"
 *   5. Redirecting to index.html on success
 *
 * This script is only loaded on add-article.html. It is a no-op on
 * other pages because it guards with getElementById checks.
 * ─────────────────────────────────────────────────────────────────
 */

// ── Predefined gradient palette (6 options) ────────────────────────
// Each string is a valid CSS `background` value applied as inline style.
const GRADIENT_PALETTE = [
  "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",   // amber-gold
  "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",   // teal-mint
  "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)",   // crimson-orange
  "linear-gradient(135deg, #4776e6 0%, #8e54e9 100%)",   // indigo-violet
  "linear-gradient(135deg, #f953c6 0%, #b91d73 100%)",   // magenta-rose
  "linear-gradient(135deg, #56ccf2 0%, #2f80ed 100%)",   // sky-blue
];

/**
 * Pick a random gradient from the palette.
 * @returns {string} CSS gradient string
 */
function pickRandomGradient() {
  return GRADIENT_PALETTE[Math.floor(Math.random() * GRADIENT_PALETTE.length)];
}

/**
 * Estimate reading time from plain text content.
 * Average adult reads ~200 words per minute.
 * @param {string} text - raw text content
 * @returns {string} e.g. "4 min read"
 */
function estimateReadTime(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

/**
 * Extract the first 120 characters of text, trimmed to the last complete word.
 * Appends "…" if truncated.
 * @param {string} text - raw text
 * @returns {string} excerpt
 */
function buildExcerpt(text) {
  const cleaned = text.trim().replace(/\s+/g, " ");
  if (cleaned.length <= 120) return cleaned;
  // Trim to 120 chars then back up to the last space so we don't cut mid-word
  const truncated = cleaned.slice(0, 120).replace(/\s\S*$/, "");
  return truncated + "…";
}

/**
 * Generate a unique ID for user posts.
 * Uses timestamp to avoid collisions with static IDs (1-6).
 * Format: "u_<timestamp>" — never an integer, so no clash with POSTS array.
 * @returns {string}
 */
function generateId() {
  return "u_" + Date.now();
}

/**
 * Return today's date in ISO format: "YYYY-MM-DD"
 * @returns {string}
 */
function todayISO() {
  return new Date().toISOString().split("T")[0];
}

// ── localStorage helpers ───────────────────────────────────────────

const STORAGE_KEY = "userPosts";

/**
 * Read the stored user posts array from localStorage.
 * Returns an empty array if nothing is stored or JSON is invalid.
 * @returns {Array}
 */
function getUserPosts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Persist the user posts array to localStorage.
 * @param {Array} posts
 */
function saveUserPosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

/**
 * Append a single new post object to the stored array.
 * @param {Object} post
 */
function appendUserPost(post) {
  const posts = getUserPosts();
  posts.unshift(post); // newest first
  saveUserPosts(posts);
}

// ── Validation helpers ─────────────────────────────────────────────

/**
 * Show an inline error message for a field.
 * @param {string} errorId - ID of the error <p> element
 * @param {HTMLElement} inputEl - the input/select/textarea to mark invalid
 */
function showError(errorId, inputEl) {
  const errorEl = document.getElementById(errorId);
  if (errorEl) errorEl.classList.remove("hidden");
  if (inputEl) {
    inputEl.classList.add("input-error");
    inputEl.setAttribute("aria-invalid", "true");
  }
}

/**
 * Clear the inline error message for a field.
 * @param {string} errorId
 * @param {HTMLElement} inputEl
 */
function clearError(errorId, inputEl) {
  const errorEl = document.getElementById(errorId);
  if (errorEl) errorEl.classList.add("hidden");
  if (inputEl) {
    inputEl.classList.remove("input-error");
    inputEl.removeAttribute("aria-invalid");
  }
}

// ── Word counter ───────────────────────────────────────────────────

function setupWordCounter() {
  const textarea = document.getElementById("article-content");
  const counter  = document.getElementById("content-counter");
  if (!textarea || !counter) return;

  textarea.addEventListener("input", () => {
    const words = textarea.value.trim().split(/\s+/).filter(Boolean).length;
    counter.textContent = `${words} word${words !== 1 ? "s" : ""}`;
  });
}

/**
 * Basic HTML escaping to prevent XSS / HTML injection from user input.
 * @param {string} str
 * @returns {string}
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

// ── Form submission ────────────────────────────────────────────────

function setupAddArticleForm() {
  const form          = document.getElementById("add-article-form");
  if (!form) return; // not on add-article.html — bail out

  const titleInput     = document.getElementById("article-title");
  const authorInput    = document.getElementById("article-author");
  const authorBioInput = document.getElementById("article-author-bio");
  const categoryInput  = document.getElementById("article-category");
  const contentInput   = document.getElementById("article-content");
  const submitBtn      = document.getElementById("submit-article");
  const submitText     = document.getElementById("submit-text");
  const successBanner  = document.getElementById("write-success");

  // ── Check for edit mode early so UI labels are set before any interaction ──
  // initEditMode is defined below — called here after DOM references are ready.
  const { post: editPost, editId } = initEditMode(form);

  // Clear errors on user input (live feedback)
  titleInput?.addEventListener("input",     () => clearError("title-error",    titleInput));
  authorInput?.addEventListener("input",    () => clearError("author-error",   authorInput));
  categoryInput?.addEventListener("change", () => clearError("category-error", categoryInput));
  contentInput?.addEventListener("input",   () => clearError("content-error",  contentInput));

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // never reload the page

    // ── Validate all fields ──────────────────────────────────────
    let isValid = true;

    const title     = titleInput ? titleInput.value.trim() : "";
    const author    = authorInput ? authorInput.value.trim() : "";
    const authorBio = authorBioInput ? authorBioInput.value.trim() : "";
    const category  = categoryInput ? categoryInput.value : "";
    const content   = contentInput ? contentInput.value.trim() : "";

    if (!title) {
      showError("title-error", titleInput);
      isValid = false;
    } else {
      clearError("title-error", titleInput);
    }

    if (!author || author.length < 2) {
      showError("author-error", authorInput);
      isValid = false;
    } else {
      clearError("author-error", authorInput);
    }

    if (!category) {
      showError("category-error", categoryInput);
      isValid = false;
    } else {
      clearError("category-error", categoryInput);
    }

    if (!content) {
      showError("content-error", contentInput);
      isValid = false;
    } else {
      clearError("content-error", contentInput);
    }

    if (!isValid) {
      const firstError = form.querySelector("[aria-invalid='true']");
      if (firstError) firstError.focus();
      return;
    }

    // ── Shared sanitized content fields ──────────────────────────
    const sanitizedContent = content
      .split(/\n\s*\n/)
      .map((para) => `<p>${escapeHTML(para).replace(/\n/g, "<br>")}</p>`)
      .join("\n");

    if (editId && editPost) {
      // ── EDIT MODE: update existing post in-place ─────────────
      let stored = [];
      try {
        stored = JSON.parse(localStorage.getItem("userPosts")) || [];
      } catch { stored = []; }

      const updatedPost = {
        ...editPost,                        // keep id, date, gradient
        title:       escapeHTML(title),
        author:      escapeHTML(author),
        authorBio:   escapeHTML(authorBio),
        category:    escapeHTML(category),
        excerpt:     escapeHTML(buildExcerpt(content)),
        content:     sanitizedContent,
        readTime:    estimateReadTime(content),
        lastEdited:  todayISO(),            // record edit timestamp
      };

      const updatedArray = stored.map((p) =>
        String(p.id) === String(editId) ? updatedPost : p
      );
      localStorage.setItem("userPosts", JSON.stringify(updatedArray));

      // Success feedback
      submitBtn.disabled = true;
      if (submitText) submitText.textContent = "Saving…";
      if (successBanner) {
        // Update success message text for edit context
        const successMsg = successBanner.querySelector("strong");
        if (successMsg) successMsg.textContent = "Article updated!";
        const successP = successBanner.querySelector("p");
        if (successP) successP.textContent = "Redirecting to your article…";
        successBanner.classList.remove("hidden");
        successBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      // Redirect to the updated post page (not homepage)
      setTimeout(() => {
        window.location.href = `post.html?id=${encodeURIComponent(String(editId))}`;
      }, 1400);

    } else {
      // ── CREATE MODE: append as new post ───────────────────────
      const newPost = {
        id:        generateId(),
        title:     escapeHTML(title),
        author:    escapeHTML(author),
        authorBio: escapeHTML(authorBio),
        date:      todayISO(),
        category:  escapeHTML(category),
        excerpt:   escapeHTML(buildExcerpt(content)),
        content:   sanitizedContent,
        readTime:  estimateReadTime(content),
        gradient:  pickRandomGradient(),
      };

      appendUserPost(newPost);

      // Success feedback
      submitBtn.disabled = true;
      if (submitText) submitText.textContent = "Saving…";
      if (successBanner) {
        successBanner.classList.remove("hidden");
        successBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1400);
    }
  });
}

// ── Edit mode — pre-fill form if ?edit= param is present ──────────

/**
 * Check if we are in edit mode (?edit=<id>), and if so:
 *  - Look up the article in localStorage "userPosts"
 *  - Pre-fill all form fields
 *  - Return the existing post object (or null if not found / not edit mode)
 *
 * @param {HTMLFormElement} form
 * @returns {{ post: Object|null, editId: string|null }}
 */
function initEditMode(form) {
  const params = new URLSearchParams(window.location.search);
  const editId = params.get("edit");
  if (!editId || !form) return { post: null, editId: null };

  // Look up the post in localStorage
  let userPosts = [];
  try {
    userPosts = JSON.parse(localStorage.getItem("userPosts")) || [];
  } catch { userPosts = []; }

  const post = userPosts.find((p) => String(p.id) === String(editId));
  if (!post) return { post: null, editId: null }; // not a user post — ignore

  // ── Pre-fill form fields ───────────────────────────────────────
  const titleInput     = document.getElementById("article-title");
  const authorInput    = document.getElementById("article-author");
  const authorBioInput = document.getElementById("article-author-bio");
  const categoryInput  = document.getElementById("article-category");
  const contentInput   = document.getElementById("article-content");
  const submitText     = document.getElementById("submit-text");
  const pageTitle      = document.querySelector(".hero-title");

  // Reverse the paragraph encoding back to plain text for editing:
  // "<p>line 1<br>line 2</p>\n<p>line 3</p>" → "line 1\nline 2\n\nline 3"
  let rawContent = post.content || "";
  rawContent = rawContent
    .replace(/<br>/gi, "\n")            // restore newlines within paragraphs
    .replace(/<\/p>\s*<p>/gi, "\n\n")   // double-newline between paragraphs
    .replace(/<\/?p>/gi, "")            // strip remaining <p> tags
    .replace(/&amp;/g, "&")             // unescape HTML entities
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();

  if (titleInput)     titleInput.value = post.title || "";
  if (authorInput)    authorInput.value = post.author || "";
  if (authorBioInput) authorBioInput.value = post.authorBio || "";
  if (categoryInput)  categoryInput.value = post.category || "";
  if (contentInput)   contentInput.value = rawContent;

  // Update UI labels to reflect edit mode
  if (submitText) submitText.textContent = "Update Article →";
  if (pageTitle) {
    // Use textContent — never innerHTML — for user data
    const heading = pageTitle.querySelector(".gradient-text");
    if (heading) heading.textContent = "Edit Article";
    else         pageTitle.textContent = "Edit Article";
  }

  // Update page <title>
  document.title = "Edit Article — TechScribe";

  return { post, editId };
}

// ── Init ───────────────────────────────────────────────────────────
// Both functions guard internally — safe to call on any page.
setupWordCounter();
setupAddArticleForm();
