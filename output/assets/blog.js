/* ===================================
   AdhiSeal Blog — Interactivity
   blog.adhiseal.com
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Reading Progress Bar ----
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = (window.scrollY / docH) * 100;
      progressBar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
  }

  // ---- Scroll to Top ----
  const scrollBtn = document.getElementById('scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ---- State/City Filter ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const articleCards = document.querySelectorAll('.article-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      let visible = 0;
      articleCards.forEach(card => {
        const match = filter === 'all' || card.dataset.state === filter || card.dataset.city === filter;
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });
      updateCount(visible);
    });
  });

  // ---- Live Search ----
  const searchInputs = document.querySelectorAll('.search-input, .hero-search input');
  searchInputs.forEach(input => {
    input.addEventListener('input', () => {
      const q = input.value.toLowerCase().trim();
      let visible = 0;
      articleCards.forEach(card => {
        const title = card.dataset.title || '';
        const city  = card.dataset.city  || '';
        const state = card.dataset.state || '';
        const match = !q || title.includes(q) || city.includes(q) || state.includes(q);
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });
      updateCount(visible);
      // Reset filter buttons
      if (q) filterBtns.forEach(b => b.classList.remove('active'));
    });
  });

  function updateCount(n) {
    const countEl = document.querySelector('.articles-count');
    if (countEl) countEl.textContent = n + ' articles';
  }

  // ---- Table of Contents Active Highlight ----
  const tocLinks = document.querySelectorAll('.toc-list a');
  if (tocLinks.length) {
    const headings = document.querySelectorAll('.article-content h2, .article-content h3');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.toc-list a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    headings.forEach(h => observer.observe(h));
  }

  // ---- Fade-in on Scroll ----
  const fadeEls = document.querySelectorAll('.article-card, .sidebar-widget');
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => fadeObserver.observe(el));

  // ---- Active nav link ----
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') && path.includes(a.getAttribute('href').replace('.html', ''))) {
      a.classList.add('active');
    }
  });

});
