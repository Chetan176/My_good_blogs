let articles = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchArticles();
    setupFilters();
    setupSearch();
});

async function fetchArticles() {
    try {
        const response = await fetch('data/articles.json');
        articles = await response.json();
        renderHero();
        renderGrid(articles);
    } catch (err) {
        console.error("Data fetch error", err);
    }
}

function renderHero() {
    const hero = articles.find(a => a.featured) || articles[0];
    const container = document.getElementById('hero-container');
    if (!container) return;

    container.innerHTML = `
        <a href="article.html?id=${hero.id}" class="group grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div class="lg:col-span-7 overflow-hidden rounded-3xl">
                <img src="${hero.image}" class="w-full h-[400px] lg:h-[500px] object-cover group-hover:scale-105 transition duration-700">
            </div>
            <div class="lg:col-span-5">
                <span class="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-sm font-black mb-6 inline-block">EDITOR'S PICK</span>
                <h1 class="text-4xl lg:text-5xl font-black mb-6 group-hover:text-blue-600 transition">${hero.title}</h1>
                <p class="text-gray-500 text-lg mb-8 line-clamp-3">${hero.excerpt}</p>
                <div class="flex items-center gap-3">
                    <div class="font-bold border-b-2 border-blue-600">Read the full story</div>
                    <i data-lucide="arrow-right" class="w-5 h-5 text-blue-600"></i>
                </div>
            </div>
        </a>
    `;
    lucide.createIcons();
}

function renderGrid(items) {
    const grid = document.getElementById('article-grid');
    if (!grid) return;

    grid.innerHTML = items.map(a => `
        <div class="article-card group">
            <a href="article.html?id=${a.id}">
                <div class="relative mb-6 overflow-hidden rounded-2xl">
                    <img src="${a.image}" class="w-full h-64 object-cover group-hover:scale-110 transition duration-700">
                    <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-black uppercase">${a.category}</div>
                </div>
                <h3 class="text-2xl font-black mb-4 group-hover:text-blue-600 transition leading-tight">${a.title}</h3>
                <p class="text-gray-500 line-clamp-2 mb-6">${a.excerpt}</p>
                <div class="flex items-center justify-between text-sm text-gray-400 font-bold">
                    <span>${a.date}</span>
                    <span class="text-blue-600">${a.readTime}</span>
                </div>
            </a>
        </div>
    `).join('');
}

function setupFilters() {
    const btns = document.querySelectorAll('.cat-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.category;
            const filtered = cat === 'All' ? articles : articles.filter(a => a.category === cat);
            renderGrid(filtered);
        });
    });
}

function setupSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    input.addEventListener('keyup', function() {
        const val = this.value.toLowerCase().trim();

        if (val === "") {
            renderGrid(articles);
            return;
        }

        const filtered = articles.filter(article =>
            article.title.toLowerCase().includes(val) ||
            article.category.toLowerCase().includes(val) ||
            article.excerpt.toLowerCase().includes(val)
        );

        renderGrid(filtered);
    });
}
