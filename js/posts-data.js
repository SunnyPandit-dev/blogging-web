/**
 * posts-data.js
 * ─────────────────────────────────────────────────────────────────
 * This file acts as our "database". In a real project you'd fetch
 * this from a server (REST API / CMS). Here we keep it simple:
 * just a plain JavaScript array of objects that any other script
 * can import or read from the global `window.POSTS` variable.
 *
 * Each post object has the following shape:
 *   id        – unique number, used in the URL (?id=1)
 *   title     – post headline
 *   author    – writer's name
 *   date      – publication date (ISO string for easy sorting)
 *   category  – one of: "AI/ML", "Web Dev", "CS Theory"
 *   excerpt   – short teaser shown on the card (≤ 160 chars)
 *   content   – full HTML string rendered on post.html
 *   readTime  – estimated reading time shown to the user
 *   gradient  – CSS gradient string used as the card thumbnail
 * ─────────────────────────────────────────────────────────────────
 */

const POSTS = [
  {
    id: 1,
    title: "Intro to Neural Networks",
    author: "Dr. Priya Mehta",
    date: "2026-09-10",
    category: "AI/ML",
    readTime: "8 min read",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    excerpt:
      "Neural networks are the backbone of modern AI. Understand how layers of artificial neurons learn patterns from data — no math degree required.",
    content: `
      <h2>What Is a Neural Network?</h2>
      <p>A neural network is a computational model loosely inspired by the biological neurons in the human brain. It consists of layers of interconnected nodes (neurons) that transform an input signal into a meaningful output.</p>

      <h3>The Three Core Layers</h3>
      <ul>
        <li><strong>Input Layer:</strong> Receives raw data (e.g., pixel values of an image).</li>
        <li><strong>Hidden Layers:</strong> Apply weighted transformations and non-linear activation functions (ReLU, Sigmoid, Tanh) to extract features.</li>
        <li><strong>Output Layer:</strong> Produces the final prediction (e.g., "cat" vs "dog").</li>
      </ul>

      <h3>How Does Learning Happen?</h3>
      <p>Training a neural network involves two phases:</p>
      <ol>
        <li><strong>Forward Pass:</strong> Data flows from input to output, producing a prediction.</li>
        <li><strong>Backpropagation:</strong> The error (loss) is calculated and propagated backwards. Using <em>gradient descent</em>, weights are updated to reduce this error.</li>
      </ol>

      <pre><code>// Pseudocode: one training iteration
for each batch in training_data:
    prediction  = forward_pass(batch)
    loss        = compute_loss(prediction, true_label)
    gradients   = backpropagate(loss)
    weights    -= learning_rate * gradients</code></pre>

      <h3>Activation Functions — Why They Matter</h3>
      <p>Without activation functions, every layer is just a linear transformation and stacking layers adds no power. Non-linear activations let the network learn complex decision boundaries.</p>
      <ul>
        <li><strong>ReLU (Rectified Linear Unit):</strong> f(x) = max(0, x) — fast, widely used.</li>
        <li><strong>Sigmoid:</strong> Squashes output between 0 and 1 — good for binary classification outputs.</li>
        <li><strong>Softmax:</strong> Converts raw scores to probabilities — used in multi-class output layers.</li>
      </ul>

      <h3>Key Takeaways</h3>
      <p>Neural networks learn by adjusting millions of internal weights via backpropagation. The "depth" (number of hidden layers) gives rise to the term <em>Deep Learning</em>. Start with small architectures, understand the data flow, then scale up.</p>
    `,
  },

  {
    id: 2,
    title: "Understanding Big-O Notation",
    author: "Arjun Sharma",
    date: "2026-09-03",
    category: "CS Theory",
    readTime: "6 min read",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    excerpt:
      "Big-O is the universal language for describing algorithm efficiency. Master it and you'll write code that scales — and ace technical interviews.",
    content: `
      <h2>Why Algorithmic Complexity Matters</h2>
      <p>Imagine sorting 10 names vs 10 million names. An algorithm that works fine at small scale can become unusably slow at large scale. Big-O notation gives us a mathematical shorthand to express <em>how an algorithm's runtime grows</em> relative to its input size <code>n</code>.</p>

      <h3>The Most Common Complexity Classes</h3>
      <table>
        <thead>
          <tr><th>Notation</th><th>Name</th><th>Example</th></tr>
        </thead>
        <tbody>
          <tr><td>O(1)</td><td>Constant</td><td>Array index lookup</td></tr>
          <tr><td>O(log n)</td><td>Logarithmic</td><td>Binary search</td></tr>
          <tr><td>O(n)</td><td>Linear</td><td>Linear search</td></tr>
          <tr><td>O(n log n)</td><td>Linearithmic</td><td>Merge sort, Heap sort</td></tr>
          <tr><td>O(n²)</td><td>Quadratic</td><td>Bubble sort, nested loops</td></tr>
          <tr><td>O(2ⁿ)</td><td>Exponential</td><td>Recursive Fibonacci (naïve)</td></tr>
        </tbody>
      </table>

      <h3>Reading Big-O Intuitively</h3>
      <p>Drop constants and lower-order terms — Big-O describes the <em>dominant growth factor</em>:</p>
      <ul>
        <li><code>3n² + 5n + 12</code> → <strong>O(n²)</strong></li>
        <li><code>100 + log n</code> → <strong>O(log n)</strong></li>
        <li><code>n/2</code> → <strong>O(n)</strong></li>
      </ul>

      <h3>Practical Example: Linear vs Binary Search</h3>
      <pre><code>// O(n) — check every element
function linearSearch(arr, target) {
  for (let i = 0; i &lt; arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// O(log n) — halve the search space each iteration
function binarySearch(sortedArr, target) {
  let low = 0, high = sortedArr.length - 1;
  while (low &lt;= high) {
    const mid = Math.floor((low + high) / 2);
    if (sortedArr[mid] === target) return mid;
    else if (sortedArr[mid] &lt; target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}</code></pre>

      <h3>Space Complexity</h3>
      <p>Big-O also describes memory usage. An algorithm can be O(n) in time but O(1) in space (in-place sort), which can be critical for memory-constrained systems.</p>

      <h3>Key Takeaways</h3>
      <p>Always analyse the worst-case (Big-O), best-case (Ω), and average-case (Θ). In interviews, aim for the most efficient solution possible — and know how to justify it with Big-O.</p>
    `,
  },

  {
    id: 3,
    title: "Git Workflow Basics",
    author: "Sneha Kulkarni",
    date: "2026-08-25",
    category: "Web Dev",
    readTime: "5 min read",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    excerpt:
      "Git is the version-control backbone of every serious software project. Learn branching, merging, and the GitHub Flow that real teams use daily.",
    content: `
      <h2>Version Control — The Why</h2>
      <p>Without version control, you'd save files as <code>project_final_v3_REAL_final.zip</code>. Git gives every change a history, lets multiple developers work in parallel, and makes rolling back mistakes trivial.</p>

      <h3>Core Git Concepts</h3>
      <ul>
        <li><strong>Repository (repo):</strong> The folder tracked by Git.</li>
        <li><strong>Commit:</strong> A snapshot of your changes with a message.</li>
        <li><strong>Branch:</strong> An independent line of development.</li>
        <li><strong>Merge:</strong> Combine two branches together.</li>
        <li><strong>Remote:</strong> A hosted copy (GitHub, GitLab, etc.).</li>
      </ul>

      <h3>The GitHub Flow (Industry Standard)</h3>
      <ol>
        <li>Create a feature branch from <code>main</code>.</li>
        <li>Make commits on that branch.</li>
        <li>Open a Pull Request for code review.</li>
        <li>Merge into <code>main</code> after approval.</li>
        <li>Deploy from <code>main</code>.</li>
      </ol>

      <h3>Essential Commands Cheat Sheet</h3>
      <pre><code># Start tracking a project
git init

# Stage and commit changes
git add .
git commit -m "feat: add login page"

# Create and switch to a new branch
git checkout -b feature/user-auth

# Push branch to GitHub
git push origin feature/user-auth

# Merge main into your branch (keep branch up-to-date)
git fetch origin
git merge origin/main

# View commit history (compact)
git log --oneline --graph --all</code></pre>

      <h3>Commit Message Convention</h3>
      <p>Follow <strong>Conventional Commits</strong> — it makes history readable and enables automated changelogs:</p>
      <ul>
        <li><code>feat:</code> — new feature</li>
        <li><code>fix:</code> — bug fix</li>
        <li><code>docs:</code> — documentation only</li>
        <li><code>refactor:</code> — code restructure, no behavior change</li>
        <li><code>chore:</code> — tooling / config updates</li>
      </ul>

      <h3>Key Takeaways</h3>
      <p>Commit early, commit often. Never commit directly to <code>main</code> on a team project. Always write meaningful commit messages — your future self (and your teammates) will thank you.</p>
    `,
  },

  {
    id: 4,
    title: "REST API Fundamentals",
    author: "Rahul Nair",
    date: "2026-08-15",
    category: "Web Dev",
    readTime: "7 min read",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    excerpt:
      "REST APIs power every modern web app. Understand HTTP methods, status codes, and endpoint design so you can build and consume APIs with confidence.",
    content: `
      <h2>What Is a REST API?</h2>
      <p>REST (Representational State Transfer) is an architectural style for designing networked applications. A REST API exposes <em>resources</em> (users, posts, products) through predictable URLs and standard HTTP methods.</p>

      <h3>The Six REST Constraints</h3>
      <ol>
        <li><strong>Client-Server:</strong> UI and data storage are separate concerns.</li>
        <li><strong>Stateless:</strong> Each request contains all information needed; no session state on server.</li>
        <li><strong>Cacheable:</strong> Responses can declare themselves cacheable.</li>
        <li><strong>Uniform Interface:</strong> Consistent URL structure and HTTP methods.</li>
        <li><strong>Layered System:</strong> Client can't tell if it's talking to the actual server or a proxy.</li>
        <li><strong>Code on Demand (optional):</strong> Server can send executable code (e.g., JS).</li>
      </ol>

      <h3>HTTP Methods → CRUD Mapping</h3>
      <table>
        <thead>
          <tr><th>HTTP Method</th><th>CRUD Operation</th><th>Example Endpoint</th></tr>
        </thead>
        <tbody>
          <tr><td>GET</td><td>Read</td><td>GET /api/posts</td></tr>
          <tr><td>POST</td><td>Create</td><td>POST /api/posts</td></tr>
          <tr><td>PUT</td><td>Full Update</td><td>PUT /api/posts/1</td></tr>
          <tr><td>PATCH</td><td>Partial Update</td><td>PATCH /api/posts/1</td></tr>
          <tr><td>DELETE</td><td>Delete</td><td>DELETE /api/posts/1</td></tr>
        </tbody>
      </table>

      <h3>Status Code Quick Reference</h3>
      <ul>
        <li><strong>2xx Success:</strong> 200 OK, 201 Created, 204 No Content</li>
        <li><strong>3xx Redirect:</strong> 301 Moved Permanently, 304 Not Modified</li>
        <li><strong>4xx Client Error:</strong> 400 Bad Request, 401 Unauthorized, 404 Not Found</li>
        <li><strong>5xx Server Error:</strong> 500 Internal Server Error, 503 Service Unavailable</li>
      </ul>

      <h3>Fetching an API in JavaScript</h3>
      <pre><code>// Modern fetch() with async/await
async function getPosts() {
  try {
    const response = await fetch('https://api.example.com/posts');
    
    if (!response.ok) {
      throw new Error(\`HTTP error: \${response.status}\`);
    }
    
    const posts = await response.json();
    console.log(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  }
}</code></pre>

      <h3>Key Takeaways</h3>
      <p>Design APIs around resources (nouns), not actions (verbs). Use HTTP methods semantically. Always return appropriate status codes. Document your API — future consumers (including you) will thank you.</p>
    `,
  },

  {
    id: 5,
    title: "CSS Grid vs Flexbox",
    author: "Sneha Kulkarni",
    date: "2026-08-05",
    category: "Web Dev",
    readTime: "6 min read",
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    excerpt:
      "Grid and Flexbox are both powerful CSS layout tools — but they solve different problems. Know when to use each and you'll never struggle with layout again.",
    content: `
      <h2>Two Layout Models, Two Jobs</h2>
      <p>A common misconception: Flexbox and Grid are competing technologies. They aren't — they're <em>complementary</em>. Understanding their core purpose is the key:</p>
      <ul>
        <li><strong>Flexbox:</strong> One-dimensional layout — arrange items in a <em>row</em> OR a <em>column</em>.</li>
        <li><strong>CSS Grid:</strong> Two-dimensional layout — arrange items in <em>rows AND columns simultaneously</em>.</li>
      </ul>

      <h3>When to Use Flexbox</h3>
      <p>Use Flexbox for UI components and small-scale layouts:</p>
      <ul>
        <li>Navigation bars (items in a row)</li>
        <li>Centering a single element</li>
        <li>Button groups</li>
        <li>Card internals (icon + text side by side)</li>
      </ul>
      <pre><code>/* Center anything — the classic Flexbox trick */
.container {
  display: flex;
  justify-content: center; /* horizontal axis */
  align-items: center;     /* vertical axis */
  min-height: 100vh;
}</code></pre>

      <h3>When to Use CSS Grid</h3>
      <p>Use Grid for page-level layouts and complex, two-axis designs:</p>
      <ul>
        <li>Page layout (header, sidebar, main, footer)</li>
        <li>Photo galleries</li>
        <li>Dashboard widgets</li>
        <li>Blog post grids</li>
      </ul>
      <pre><code>/* Responsive card grid — no media queries needed! */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}</code></pre>

      <h3>The Golden Rule</h3>
      <p>Ask yourself: <em>"Do I need to control one axis or two?"</em></p>
      <ul>
        <li>One axis → <strong>Flexbox</strong></li>
        <li>Two axes → <strong>Grid</strong></li>
      </ul>

      <h3>Using Both Together (The Pro Move)</h3>
      <p>Real layouts combine both. Use Grid for the macro page structure, then Flexbox inside each Grid cell for micro-component alignment. They nest perfectly.</p>

      <h3>Key Takeaways</h3>
      <p>Don't pick sides — master both. Grid replaced float-based layouts. Flexbox replaced inline-block tricks. Together, they cover 95% of all layout scenarios in modern CSS.</p>
    `,
  },

  {
    id: 6,
    title: "What Is Machine Learning Bias?",
    author: "Dr. Priya Mehta",
    date: "2026-07-28",
    category: "AI/ML",
    readTime: "9 min read",
    gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    excerpt:
      "Bias in ML models isn't just a technical glitch — it can perpetuate real-world discrimination. Every CS student building AI systems must understand this.",
    content: `
      <h2>The Problem With Biased Models</h2>
      <p>In 2018, Amazon scrapped an AI recruiting tool because it systematically downgraded résumés from women. The model had been trained on historical hiring data — which reflected past biases. This is Machine Learning Bias: when a model produces systematically unfair or skewed outcomes.</p>

      <h3>Types of Bias in ML</h3>
      <ul>
        <li><strong>Historical Bias:</strong> Training data reflects past societal inequalities (e.g., gender pay gaps encoded in salary data).</li>
        <li><strong>Sampling Bias:</strong> Training data doesn't represent the deployment population (e.g., a facial recognition system trained mostly on lighter skin tones).</li>
        <li><strong>Label Bias:</strong> Human annotators introduce their own prejudices into ground-truth labels.</li>
        <li><strong>Confirmation Bias:</strong> Researchers unconsciously favour outcomes that confirm their hypothesis during model selection.</li>
        <li><strong>Aggregation Bias:</strong> A model trained on a general population performs poorly on specific subgroups.</li>
      </ul>

      <h3>The Bias–Variance Trade-off (Statistical Bias)</h3>
      <p>Note: <em>statistical bias</em> is different from <em>societal bias</em>. In ML theory:</p>
      <ul>
        <li><strong>High Bias:</strong> Model is too simple (underfits) — misses patterns.</li>
        <li><strong>High Variance:</strong> Model is too complex (overfits) — memorises training data, fails on new data.</li>
        <li><strong>Goal:</strong> Find the sweet spot with regularisation, cross-validation, and appropriate model complexity.</li>
      </ul>

      <h3>Measuring Fairness</h3>
      <p>There is no single universal fairness metric. Common metrics include:</p>
      <ul>
        <li><strong>Demographic Parity:</strong> Equal positive prediction rates across groups.</li>
        <li><strong>Equal Opportunity:</strong> Equal true positive rates across groups.</li>
        <li><strong>Calibration:</strong> Predicted probabilities are equally accurate across groups.</li>
      </ul>
      <p>Critically, some fairness definitions are mathematically <em>mutually exclusive</em> — satisfying one can violate another. This is an active research area.</p>

      <h3>Mitigation Strategies</h3>
      <ol>
        <li><strong>Pre-processing:</strong> Rebalance training data, remove or transform sensitive features.</li>
        <li><strong>In-processing:</strong> Add fairness constraints to the training objective.</li>
        <li><strong>Post-processing:</strong> Adjust model thresholds per demographic group after training.</li>
        <li><strong>Diverse Teams:</strong> Involve domain experts, ethicists, and affected communities early.</li>
        <li><strong>Audit regularly:</strong> Bias can drift over time as real-world data distributions shift.</li>
      </ol>

      <h3>Key Takeaways</h3>
      <p>Building AI systems carries ethical responsibility. Always audit your training data, define fairness criteria explicitly for your use case, and test performance across subgroups — not just aggregate accuracy. "The model just learned from data" is not an ethical defence.</p>
    `,
  },
];

// Make POSTS available globally so other scripts can use it.
// In a module-based project you'd use: export default POSTS;
// For a plain HTML/JS project, attaching to window is the standard approach.
window.POSTS = POSTS;
