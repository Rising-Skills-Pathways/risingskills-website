/* ============================================================
   RISING SKILLS PATHWAYS INITIATIVE — site.js
   Loads header.html / footer.html into every page so the nav,
   logo, and footer only need editing in ONE place. Runs the
   mobile nav toggle and scroll-reveal after the partials load.
   ============================================================ */

async function loadPartial(url, mountId) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url} responded ${res.status}`);
    mount.outerHTML = await res.text();
  } catch (err) {
    console.error(`Rising Skills Pathways: could not load ${url}.`, err);
    mount.innerHTML = '<p style="padding:16px;color:#900;">Site navigation failed to load. If you are viewing this file directly from disk, run a local server instead (see README) — this works automatically once hosted.</p>';
  }
}

function setActiveNavLink() {
  const page = document.body.dataset.page;
  if (!page) return;
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
    if (a.dataset.page === page) {
      a.setAttribute('aria-current', 'page');
    } else {
      a.removeAttribute('aria-current');
    }
  });
}

function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    const open = links.classList.contains('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  const close = () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  // close with the Escape key, or when the window is widened back to desktop
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  window.matchMedia('(min-width: 821px)').addEventListener('change', e => { if (e.matches) close(); });
}

function initReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
}

/* ---- YouTube cards: fill thumbnail + link from data-youtube="..." ---- */
function youtubeId(url) {
  if (!url) return null;
  const m = url.trim().match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  return /^[A-Za-z0-9_-]{11}$/.test(url.trim()) ? url.trim() : null; // bare video ID also works
}

function playlistId(url) {
  const m = (url || '').match(/[?&]list=([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
}

function initVideoCards() {
  document.querySelectorAll('.video-card[data-youtube]').forEach(card => {
    const url = card.dataset.youtube;
    const id = youtubeId(url);
    const list = playlistId(url);
    if (!id && !list) return; // empty slot: card keeps linking to the channel
    const thumb = card.querySelector('.video-thumb');
    const title = card.querySelector('.video-caption b, .gallery-caption b');

    if (id) {
      // single video (or a video inside a playlist)
      card.href = list
        ? `https://www.youtube.com/watch?v=${id}&list=${list}`
        : `https://www.youtube.com/watch?v=${id}`;
      if (thumb && !thumb.querySelector('img')) {
        const img = document.createElement('img');
        img.src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
        img.alt = title ? `Video thumbnail: ${title.textContent}` : 'Video thumbnail';
        img.loading = 'lazy';
        thumb.prepend(img);
      }
    } else {
      // playlist link: YouTube gives no thumbnail without an API key,
      // so keep the coloured tile and label it as a playlist
      card.href = `https://www.youtube.com/playlist?list=${list}`;
      if (thumb && !thumb.querySelector('.playlist-badge')) {
        const badge = document.createElement('span');
        badge.className = 'playlist-badge';
        badge.textContent = 'Playlist';
        thumb.append(badge);
      }
    }
  });
}

/* ---- Contact form: send via Formspree, fall back to email until set up ---- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = form.querySelector('.form-status');
  const button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (data.get('_gotcha')) return; // spam bot

    // Formspree not set up yet: open the visitor's email app instead
    if (form.action.includes('YOUR_FORM_ID')) {
      const body = `Name: ${data.get('name')}\nSchool / organisation: ${data.get('organisation')}\nContact: ${data.get('contact')}\n\n${data.get('message')}`;
      window.location.href = `mailto:info@risingskills.org?subject=${encodeURIComponent('Message from risingskills.org')}&body=${encodeURIComponent(body)}`;
      return;
    }

    button.disabled = true;
    status.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      status.textContent = "Thank you — your message has been sent. We'll be in touch soon.";
    } catch (err) {
      status.textContent = 'Sorry, that didn’t go through. Please email us at info@risingskills.org.';
    } finally {
      button.disabled = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  initVideoCards();
  initContactForm();
  await Promise.all([
    loadPartial('header.html', 'site-header-mount'),
    loadPartial('footer.html', 'site-footer-mount'),
  ]);
  setActiveNavLink();
  initNavToggle();
  initReveal();
});
