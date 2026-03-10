/* =========================================
   FRESKEY PIYO - MAIN SCRIPT
   ========================================= */

// === SEARCH FUNCTIONALITY ===
// Searchable index: all products and named sections on the page
const SEARCH_INDEX = [
    { label: 'Freskey Mini – 200ml Bottles', desc: 'Pack of 24 · Events Special · ₹120', section: 'shop', emoji: '💧' },
    { label: 'Freskey Travel – 500ml Bottles', desc: 'Pack of 20 · Best Seller · ₹180', section: 'shop', emoji: '💧' },
    { label: 'Freskey Home – 1 Litre Bottles', desc: 'Pack of 12 · Daily Standard · ₹216', section: 'shop', emoji: '💧' },
    { label: 'Freskey Jar – 20 Litre Refill', desc: 'Returnable · For Dispensers · ₹90', section: 'shop', emoji: '🫙' },
    { label: 'Shop / Order Products', desc: 'Browse all Freskey water products', section: 'shop', emoji: '🛒' },
    { label: 'Our Origin & Water Science', desc: 'pH, TDS, 7-stage purification', section: 'origin', emoji: '🔬' },
    { label: 'Sustainability – Green Pledge', desc: 'EPR, Collect Crush Create', section: 'responsibility', emoji: '♻️' },
    { label: 'Partner / Distributor Network', desc: 'Corporates, Retail, HoReCa, Events', section: 'partners', emoji: '🤝' },
    { label: 'Customer Reviews', desc: 'What our customers say', section: 'reviews', emoji: '⭐' },
    { label: 'Contact Us / Get Freskey', desc: 'Phone, Email, WhatsApp, Address', section: 'contact', emoji: '📞' },
    { label: 'Hydration Calculator', desc: 'Calculate your daily water intake', section: null, emoji: '💡', id: 'calcWeight' },
    { label: 'FAQ – Frequently Asked Questions', desc: 'BPA free? Delivery? Expiry?', section: 'contact', emoji: '❓' },
    { label: 'Quality Report', desc: 'FSSAI, BIS/ISI certifications', section: null, emoji: '📋', href: 'quality-report.html' },
    { label: 'Privacy Policy', desc: 'How we use your data', section: null, emoji: '🔒', href: 'privacy.html' },
    { label: 'Terms of Service', desc: 'Usage terms and conditions', section: null, emoji: '📄', href: 'terms.html' },
    { label: 'Cancellation & Refund Policy', desc: 'Returns and refunds process', section: null, emoji: '↩️', href: 'refund.html' },
];

function openSearch() {
    const overlay = document.getElementById('searchOverlay');
    if (!overlay) return;
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
    document.body.classList.add('overflow-hidden');
    setTimeout(() => document.getElementById('searchInput')?.focus(), 50);
}

function closeSearch() {
    const overlay = document.getElementById('searchOverlay');
    if (!overlay) return;
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    document.body.classList.remove('overflow-hidden');
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '<p class="text-gray-400 text-sm text-center py-6">Start typing to search...</p>';
}

function runSearch(query) {
    const resultsBox = document.getElementById('searchResults');
    if (!query.trim()) {
        resultsBox.innerHTML = '<p class="text-gray-400 text-sm text-center py-6">Start typing to search...</p>';
        return;
    }
    const q = query.toLowerCase();
    const hits = SEARCH_INDEX.filter(item =>
        item.label.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
    );

    if (hits.length === 0) {
        resultsBox.innerHTML = `<p class="text-gray-500 text-sm text-center py-6">No results found for "<strong>${query}</strong>"</p>`;
        return;
    }

    resultsBox.innerHTML = hits.map((item, i) => `
        <button data-idx="${i}" onclick="selectSearchResult(${i})"
            class="search-result-item w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left hover:bg-gray-50 transition-colors group">
            <span class="text-2xl w-9 text-center flex-shrink-0">${item.emoji}</span>
            <div class="flex-1 min-w-0">
                <div class="font-semibold text-sm text-gray-800 group-hover:text-brand-primary transition-colors">${item.label}</div>
                <div class="text-xs text-gray-400 truncate">${item.desc}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" class="flex-shrink-0"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
    `).join('');

    // Store hits for keyboard nav
    window._searchHits = hits;
    window._searchSelected = -1;
}

function selectSearchResult(idx) {
    const item = window._searchHits?.[idx] ?? SEARCH_INDEX[idx];
    if (!item) return;
    closeSearch();

    if (item.href) {
        window.location.href = item.href;
        return;
    }
    if (item.id) {
        const el = document.getElementById(item.id);
        if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
        return;
    }
    if (item.section) {
        const section = document.getElementById(item.section);
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function handleSearchKey(e) {
    const items = document.querySelectorAll('.search-result-item');
    if (!items.length) return;
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        window._searchSelected = Math.min((window._searchSelected ?? -1) + 1, items.length - 1);
        items.forEach((el, i) => el.classList.toggle('bg-gray-100', i === window._searchSelected));
        items[window._searchSelected]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        window._searchSelected = Math.max((window._searchSelected ?? 0) - 1, 0);
        items.forEach((el, i) => el.classList.toggle('bg-gray-100', i === window._searchSelected));
        items[window._searchSelected]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && window._searchSelected >= 0) {
        e.preventDefault();
        selectSearchResult(window._searchSelected);
    } else if (e.key === 'Escape') {
        closeSearch();
    }
}

// Close search on overlay backdrop click
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('searchOverlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSearch(); });
    }
    // Global Escape key to close search
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSearch();
    });
});

// 1. Splash Screen Logic
window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');
    // Ensure it shows for at least 1.5 seconds so users see the logo
    setTimeout(() => {
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
            }, 500);
        }
    }, 1200);
});

// 2. Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const closeBtn = document.querySelector('.close-btn');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        mobileNav.classList.add('active');
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        mobileNav.classList.remove('active');
    });
}

// 3. Highlight Active Menu Link
const currentLocation = location.href;
const menuItem = document.querySelectorAll('.nav-links li a');
const menuLength = menuItem.length;

for (let i = 0; i < menuLength; i++) {
    if (menuItem[i].href === currentLocation) {
        menuItem[i].classList.add("active-page");
    }
}

// 4. Lazy Load / Fade In Animation (Simple)
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-animation');
        }
    });
});
// (You can add class="hidden-anim" to elements you want to animate)

// === NEW: Scroll To Top Button Logic ===
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// === NEW: Active Nav Link on Scroll ===
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav .nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('text-brand-accent', '!text-brand-accent');
                    link.classList.add('text-brand-dark');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.remove('text-brand-dark');
                        link.classList.add('text-brand-accent');
                        // also extend underline
                        const span = link.querySelector('span');
                        if (span) span.style.width = '100%';
                    } else {
                        const span = link.querySelector('span');
                        if (span) span.style.width = '';
                    }
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => sectionObserver.observe(section));
});

// === NEW: Fade-in Animations on Scroll ===
document.addEventListener('DOMContentLoaded', () => {
    const fadeEls = document.querySelectorAll('.fade-in-up');
    if (fadeEls.length > 0) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        fadeEls.forEach(el => fadeObserver.observe(el));
    }
});

// === NEW: Toast Notification Helper (replaces alert) ===
function showToast(msg) {
    let toast = document.getElementById('freskey-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'freskey-toast';
        toast.style.cssText = `
            position:fixed; bottom:84px; left:50%; transform:translateX(-50%) translateY(20px);
            background:#042E2D; color:white; padding:12px 24px; border-radius:50px;
            font-family:'Montserrat',sans-serif; font-weight:700; font-size:0.85rem;
            z-index:9999; opacity:0; transition:opacity 0.3s, transform 0.3s;
            white-space:nowrap; box-shadow:0 4px 16px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2500);
}


function filterProd(cat, btnElement) {
    // Remove active style from all buttons
    const buttons = document.querySelectorAll('.p-tab-btn');
    buttons.forEach(btn => {
        btn.classList.remove('text-brand-dark');
        btn.classList.add('text-gray-500');
        btn.classList.remove("after:content-['']", "after:absolute", "after:bottom-0", "after:left-1/2", "after:-translate-x-1/2", "after:w-[30px]", "after:h-[3px]", "after:bg-brand-accent");
    });

    // Add active style to clicked button
    if (btnElement) {
        btnElement.classList.remove('text-gray-500');
        btnElement.classList.add('text-brand-dark');
        btnElement.classList.add("after:content-['']", "after:absolute", "after:bottom-0", "after:left-1/2", "after:-translate-x-1/2", "after:w-[30px]", "after:h-[3px]", "after:bg-brand-accent");
    }

    const products = document.querySelectorAll('.product-card');
    products.forEach(p => {
        if (cat === 'all') {
            p.classList.remove('hidden');
            p.classList.add('flex');
        } else {
            if (p.getAttribute('data-cat').includes(cat)) {
                p.classList.remove('hidden');
                p.classList.add('flex');
            } else {
                p.classList.add('hidden');
                p.classList.remove('flex');
            }
        }
    });
}

// Set initial active state logic visually for first button
document.addEventListener('DOMContentLoaded', () => {
    const firstBtn = document.querySelector('.p-tab-btn');
    if (firstBtn) {
        firstBtn.classList.remove('text-gray-500');
        firstBtn.classList.add('text-brand-dark');
    }
});


// === 4. Simple Cart Logic ===
let count = 0;
function addToCart(qty) {
    count += qty;
    const badge = document.getElementById("cartCount");
    badge.innerText = count;
    badge.classList.add("scale-150");
    setTimeout(() => { badge.classList.remove("scale-150"); }, 200);

    // Show WhatsApp button after first item is added
    const waBtn = document.getElementById('waCartBtn');
    if (waBtn && count > 0) {
        waBtn.classList.add('visible');
    }

    // Show a toast-style notification instead of blocking alert
    showToast(`✅ Item added to cart! Total: ${count} item(s)`);
}
function openCart() {
    if (count === 0) {
        alert("Your cart is empty! Get some water.");
    } else {
        alert("Cart contains " + count + " items. Checkout process start.");
    }
}

// === 5. Hydration Calculator ===
function calculateWater() {
    const w = parseFloat(document.getElementById('calcWeight').value);
    const a = parseFloat(document.getElementById('calcActivity').value);
    const resBox = document.getElementById('hydration-result');

    if (!w) {
        resBox.innerText = "Please enter weight.";
        return;
    }
    const litres = (w * 0.033 * a).toFixed(2);
    resBox.innerHTML = `You need approx <span class="text-3xl text-white">${litres} L</span> water daily.`;
}

// === 6. Modal Details Logic ===
const productData = {
    'mini': {
        title: "Freskey Mini (200ml)",
        table: `
        <table class="w-full border-collapse mt-5">
            <tr class="border-b border-gray-100"><td class="py-2 font-bold text-brand-dark">Serve Size</td><td class="py-2">200ml</td></tr>
            <tr class="border-b border-gray-100"><td class="py-2 font-bold text-brand-dark">Magnesium</td><td class="py-2">3 mg/l</td></tr>
            <tr class="border-b border-gray-100"><td class="py-2 font-bold text-brand-dark">Potassium</td><td class="py-2">1 mg/l</td></tr>
            <tr class="border-b border-gray-100"><td class="py-2 font-bold text-brand-dark">Bicarbonate</td><td class="py-2">5 mg/l</td></tr>
            <tr class="border-b border-gray-100"><td class="py-2 font-bold text-brand-dark">pH</td><td class="py-2">6.8 - 7.5</td></tr>
            <tr class="border-b border-gray-100"><td class="py-2 font-bold text-brand-dark">Shelf Life</td><td class="py-2">6 Months</td></tr>
        </table>
        `
    },
    'travel': {
        title: "Freskey Travel (500ml)",
        table: `
        <table class="w-full border-collapse mt-5">
            <tr class="border-b border-gray-100"><td class="py-2 font-bold text-brand-dark">Serve Size</td><td class="py-2">500ml</td></tr>
            <tr class="border-b border-gray-100"><td class="py-2 font-bold text-brand-dark">Magnesium</td><td class="py-2">3 mg/l</td></tr>
            <tr class="border-b border-gray-100"><td class="py-2 font-bold text-brand-dark">Potassium</td><td class="py-2">1 mg/l</td></tr>
            <tr class="border-b border-gray-100"><td class="py-2 font-bold text-brand-dark">Calcium</td><td class="py-2">2 mg/l</td></tr>
            <tr class="border-b border-gray-100"><td class="py-2 font-bold text-brand-dark">TDS</td><td class="py-2">~140 ppm</td></tr>
            <tr class="border-b border-gray-100"><td class="py-2 font-bold text-brand-dark">Plastic Type</td><td class="py-2">BPA Free PET</td></tr>
        </table>
        `
    },
    'home': {
        title: "Freskey Home (1 Litre)",
        table: `
        <table class="w-full border-collapse mt-5">
            <tr class="border-b border-gray-100"><td class="py-2 font-bold text-brand-dark">Serve Size</td><td class="py-2">1000ml</td></tr>
            <tr class="border-b border-gray-100"><td class="py-2 font-bold text-brand-dark">Batch Test</td><td class="py-2">PASSED</td></tr>
            <tr class="border-b border-gray-100"><td class="py-2 font-bold text-brand-dark">Micro-plastics</td><td class="py-2">0%</td></tr>
            <tr class="border-b border-gray-100"><td class="py-2 font-bold text-brand-dark">Taste Profile</td><td class="py-2">Sweet, Neutral</td></tr>
        </table>
        <p class="mt-4">Designed for fridge storage. Heavy duty PET prevents buckling.</p>
        `
    },
    'bulk': {
        title: "Freskey 20L Jar",
        table: `
        <table class="w-full border-collapse mt-5">
            <tr class="border-b border-gray-100"><td class="py-2 font-bold text-brand-dark">Type</td><td class="py-2">Returnable Polycarb</td></tr>
            <tr class="border-b border-gray-100"><td class="py-2 font-bold text-brand-dark">Washing</td><td class="py-2">7-step chemical wash</td></tr>
            <tr class="border-b border-gray-100"><td class="py-2 font-bold text-brand-dark">Sealing</td><td class="py-2">Tamper-proof Shrink Wrap</td></tr>
        </table>
        `
    }
};

function openDetails(pid) {
    const modal = document.getElementById('detailsModal');
    const data = productData[pid];
    document.getElementById('m-title').innerText = data.title;
    document.getElementById('m-content').innerHTML = data.table;
    modal.classList.remove('opacity-0', 'pointer-events-none');
    document.body.classList.add('overflow-hidden');
}

function closeModal() {
    document.getElementById('detailsModal').classList.add('opacity-0', 'pointer-events-none');
    document.body.classList.remove('overflow-hidden');
}

// Removed event listener that causes errors if detailsModal not rendered yet on all pages. Instead moving checking inside function or checking existence.
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('detailsModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
});



// === 7. Accordion Toggle ===
function toggleAccordion(header) {
    const content = header.nextElementSibling;
    const span = header.querySelector('span');

    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        span.innerText = '+';
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        span.innerText = '-';
    }
}

// === 8. Contact Form Handler ===
function handleForm(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const initialText = btn.innerText;
    btn.innerText = "Sending...";

    setTimeout(() => {
        const feedback = document.getElementById('form-feedback');
        if (feedback) feedback.classList.remove('hidden');
        e.target.reset();
        btn.innerText = "Sent!";
        setTimeout(() => { btn.innerText = initialText; }, 2000);
    }, 1000);
}
