// Initial Sample Data for LocalStorage Persistence
const initialPosts = [
    {
        id: 1,
        title: "Getting Started with Modern Web Architecture",
        category: "Web Dev",
        date: "2026-04-10",
        content: "Building modular HTML, CSS, and JS codebases helps keep projects clean, extensible, and scalable.",
        comments: ["Great insights!", "Super helpful structure."]
    },
    {
        id: 2,
        title: "Fetching APIs dynamically using Vanilla JS",
        category: "JavaScript",
        date: "2026-04-12",
        content: "Fetch API allows frontend applications to dynamically pull external data asynchronously.",
        comments: ["Simple and clean."]
    }
];

function getStoredPosts() {
    const saved = localStorage.getItem('devblog_posts');
    return saved ? JSON.parse(saved) : initialPosts;
}

function savePosts(posts) {
    localStorage.setItem('devblog_posts', JSON.stringify(posts));
}

// Render Blog Posts
function renderPosts() {
    const grid = document.getElementById('postsGrid');
    if (!grid) return;

    const posts = getStoredPosts();
    grid.innerHTML = posts.map(post => `
        <article class="post-card">
            <div class="post-header">
                <span class="tag">${post.category}</span>
                <span class="post-date">${post.date}</span>
            </div>
            <h3>${post.title}</h3>
            <p>${post.content}</p>

            <div class="comments-section">
                <h4>Comments (${post.comments.length})</h4>
                <div class="comments-list">
                    ${post.comments.map(c => `<div class="comment-item">${escapeHtml(c)}</div>`).join('')}
                </div>
                <div class="form-group" style="margin-top:0.8rem;">
                    <input type="text" placeholder="Write a comment..." id="input-${post.id}" onkeypress="handleCommentSubmit(event, ${post.id})">
                </div>
            </div>
        </article>
    `).join('');
}

// Create New Post Handler
const createPostForm = document.getElementById('createPostForm');
if (createPostForm) {
    createPostForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('postTitle').value;
        const category = document.getElementById('postCategory').value;
        const content = document.getElementById('postContent').value;

        const posts = getStoredPosts();
        const newPost = {
            id: Date.now(),
            title,
            category,
            date: new Date().toISOString().split('T')[0],
            content,
            comments: []
        };

        posts.unshift(newPost);
        savePosts(posts);
        renderPosts();
        createPostForm.reset();
    });
}

// Comment Submission Handler
function handleCommentSubmit(event, postId) {
    if (event.key === 'Enter') {
        const input = document.getElementById(`input-${postId}`);
        const text = input.value.trim();
        if (!text) return;

        const posts = getStoredPosts();
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.comments.push(text);
            savePosts(posts);
            renderPosts();
        }
    }
}

// Public Quote API Fetcher
async function fetchNewQuote() {
    const quoteEl = document.getElementById('apiQuote');
    const authorEl = document.getElementById('apiAuthor');
    if (!quoteEl) return;

    try {
        quoteEl.textContent = "Loading new quote...";
        authorEl.textContent = "";
        const res = await fetch('https://dummyjson.com/quotes/random');
        const data = await res.json();
        quoteEl.textContent = `"${data.quote}"`;
        authorEl.textContent = `— ${data.author}`;
    } catch (err) {
        quoteEl.textContent = '"Simplicity is prerequisite for reliability."';
        authorEl.textContent = '— Edsger W. Dijkstra';
    }
}

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]);
}

// On Load
document.addEventListener('DOMContentLoaded', () => {
    renderPosts();
    fetchNewQuote();
});