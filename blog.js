let articles = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchArticles();
    setupEventListeners();
    initTheme();
});

async function fetchArticles() {
    try {
        const response = await fetch('data/articles.json');
        articles = await response.json();
        renderHero(articles.find(a => a.featured));
        renderArticles(articles);
    } catch (error) {
        console.error("Error loading articles:", error);
    }
}

function renderHero(article) {
    const heroSection = document.getElementById('featured-hero');
    if (!heroSection || !article) return;

    heroSection.innerHTML = `
        <div class="order-2 lg:order-1">
            <span class="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 text-sm font-bold mb-4 uppercase">Featured Article</span>
            <h1 class="text-4xl md:text-5xl font-black mb-6 leading-tight">${article.title}</h1>
            <p class="text-gray-500 dark:text-gray-400 text-lg mb-8">${article.excerpt}</p>
            <div class="flex items-center gap-4 mb-8">
                <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">${article.author[0]}</div>
                <div>
                    <p class="font-bold">${article.author}</p>
                    <p class="text-sm text-gray-500">${article.date} · ${article.readTime} read</p>
                </div>
            </div>
            <a href="article.html?id=${article.id}" class="inline-block bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform">Read Full Article</a>
        </div>
        <div class="order-1 lg:order-2">
            <img src="${article.image}" alt="${article.title}" class="w-full h-80 lg:h-[450px] object-cover rounded-2xl shadow-2xl">
        </div>
    `;
}

function renderArticles(data) {
    const grid = document.getElementById('article-grid');
    if (!grid) return;

    grid.innerHTML = data.map(article => `
        <article class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all group">
            <a href="article.html?id=${article.id}">
                <div class="relative overflow-hidden">
                    <img src="${article.image}" alt="${article.title}" class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500">
                    <span class="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-gray-900/90 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">${article.category}</span>
                </div>
                <div class="p-6">
                    <div class="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <span>${article.date}</span>
                        <span>•</span>
                        <span>${article.readTime}</span>
                    </div>
                    <h3 class="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">${article.title}</h3>
                    <p class="text-gray-500 dark:text-gray-400 text-sm line-clamp-3">${article.excerpt}</p>
                    <div class="mt-6 pt-6 border-t dark:border-gray-700 flex items-center gap-3">
                        <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 rounded-full flex items-center justify-center text-xs font-bold">
                            ${article.author[0]}
                        </div>
                        <span class="text-sm font-medium">${article.author}</span>
                    </div>
                </div>
            </a>
        </article>
    `).join('');
}

function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = articles.filter(a => 
                a.title.toLowerCase().includes(term) || 
                a.excerpt.toLowerCase().includes(term)
            );
            renderArticles(filtered);
        });
    }

    // Category Filter
    const filters = document.querySelectorAll('.cat-filter');
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active', 'bg-blue-600', 'text-white'));
            btn.classList.add('active', 'bg-blue-600', 'text-white');
            
            const cat = btn.getAttribute('data-category');
            if (cat === 'All') {
                renderArticles(articles);
            } else {
                const filtered = articles.filter(a => a.category === cat);
                renderArticles(filtered);
            }
        });
    });

    // Dark Mode
    document.getElementById('themeToggle').addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });
}

function initTheme() {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}