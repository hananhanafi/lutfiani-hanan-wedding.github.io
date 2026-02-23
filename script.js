// ── Countdown Timer ──────────────────────────────
(function () {
  const weddingDate = new Date('2026-07-18T15:00:00-07:00').getTime();
  const $d = document.getElementById('cd-days');
  const $h = document.getElementById('cd-hours');
  const $m = document.getElementById('cd-mins');
  const $s = document.getElementById('cd-secs');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now = Date.now();
    const diff = weddingDate - now;
    if (diff <= 0) {
      $d.textContent = '0';
      $h.textContent = '00';
      $m.textContent = '00';
      $s.textContent = '00';
      return;
    }
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);
    $d.textContent = days;
    $h.textContent = pad(hours);
    $m.textContent = pad(mins);
    $s.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
})();

// ── Navbar scroll effect ─────────────────────────
(function () {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('bg-[#2d1f2e]/90', 'backdrop-blur-lg', 'shadow-lg');
    } else {
      nav.classList.remove('bg-[#2d1f2e]/90', 'backdrop-blur-lg', 'shadow-lg');
    }
  });
})();

// ── Mobile menu toggle ───────────────────────────
(function () {
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  btn.addEventListener('click', () => menu.classList.toggle('hidden'));
  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => menu.classList.add('hidden'))
  );
})();

// ── Scroll reveal (all variants) ─────────────────
(function () {
  const allReveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  allReveals.forEach(el => observer.observe(el));
})();

// ── Parallax scroll engine ─────────────────────────
(function () {
  // Skip on mobile for performance
  if (window.innerWidth < 768) return;

  const parallaxEls = document.querySelectorAll('[data-parallax]');
  const galleryItems = document.querySelectorAll('.gallery-item img');
  const sections = document.querySelectorAll('section');
  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    const viewH = window.innerHeight;

    // 1. Elements with data-parallax attribute
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0;
      const rect = el.closest('section')?.getBoundingClientRect() || el.getBoundingClientRect();
      const sectionTop = rect.top + scrollY;
      const offset = scrollY - sectionTop;

      // Only animate when section is in/near viewport
      if (rect.top < viewH * 1.2 && rect.bottom > -viewH * 0.3) {
        const translate = offset * speed;
        // Preserve existing transforms by using a CSS custom property approach
        el.style.transform = el.style.transform
          ? el.style.transform.replace(/translateY\([^)]*\)/, `translateY(${translate}px)`)
          : `translateY(${translate}px)`;
        // Simpler: just set translateY
        el.style.transform = `translateY(${translate}px)`;
      }
    });

    // 2. Gallery images — subtle vertical shift for depth
    galleryItems.forEach((img, i) => {
      const rect = img.getBoundingClientRect();
      if (rect.top < viewH && rect.bottom > 0) {
        const progress = (viewH - rect.top) / (viewH + rect.height);
        const shift = (progress - 0.5) * 30 * (i % 2 === 0 ? 1 : -1);
        img.style.transform = `scale(1) translateY(${shift}px)`;
      }
    });

    // 3. Section content — subtle depth offset
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < viewH && rect.bottom > 0) {
        const progress = (viewH - rect.top) / (viewH + rect.height);
        const inner = section.querySelector('.max-w-5xl, .max-w-4xl, .max-w-3xl, .max-w-2xl');
        if (inner && !inner.dataset.parallax) {
          const shift = (progress - 0.5) * 12;
          inner.style.transform = `translateY(${shift}px)`;
        }
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  updateParallax();
})();

// ── Smooth navbar link underline ──────────────────
(function () {
  document.querySelectorAll('#navbar a[href^="#"]').forEach(link => {
    link.classList.add('relative', 'group');
    const underline = document.createElement('span');
    underline.className = 'absolute -bottom-1 left-0 w-0 h-0.5 bg-champagne transition-all duration-300 group-hover:w-full rounded-full';
    link.appendChild(underline);
  });
})();

// ── Confetti burst on copy ────────────────────────
function burstConfetti(x, y) {
  const colors = ['#f8bbd0','#f48fb1','#e1bee7','#ce93d8','#ffe0b2','#e57373'];
  for (let i = 0; i < 18; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    const angle = (Math.PI * 2 / 18) * i + (Math.random() * 0.5 - 0.25);
    const dist = 60 + Math.random() * 80;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist - 40;
    const rot = Math.random() * 720 - 360;
    el.style.setProperty('--tx', tx + 'px');
    el.style.setProperty('--ty', ty + 'px');
    el.style.setProperty('--rot', rot + 'deg');
    el.animate([
      { transform: 'translate(0,0) rotate(0) scale(1)', opacity: 1 },
      { transform: `translate(${tx}px,${ty}px) rotate(${rot}deg) scale(0)`, opacity: 0 }
    ], { duration: 800 + Math.random()*400, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  }
}

// ── Falling flower petals ────────────────────────
(function () {
  const container = document.getElementById('particles');
  const petalColors = ['#f8bbd0', '#f48fb1', '#fce4ec', '#e1bee7', '#e57373', '#ffffff', '#f06292', '#ce93d8'];
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const size = Math.random() * 14 + 8;
    const color = petalColors[Math.floor(Math.random() * petalColors.length)];
    p.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="${color}" opacity="${Math.random()*0.4+0.3}"><ellipse cx="10" cy="8" rx="5" ry="8" transform="rotate(${Math.random()*60-30} 10 10)"/></svg>`;
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = Math.random() * 12 + 10 + 's';
    p.style.animationDelay = Math.random() * 15 + 's';
    container.appendChild(p);
  }
})();

// ── Global floating petals (full page) ──────────
(function () {
  const gpc = document.getElementById('globalPetals');
  const gColors = ['#f8bbd0', '#f48fb1', '#fce4ec', '#e1bee7', '#e57373', '#ffffff', '#f06292'];
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 12 + 6;
    const color = gColors[Math.floor(Math.random() * gColors.length)];
    p.style.position = 'absolute';
    p.style.top = '-20px';
    p.style.left = Math.random() * 100 + '%';
    p.style.pointerEvents = 'none';
    p.style.opacity = '0';
    p.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="${color}" opacity="${Math.random()*0.25+0.15}"><ellipse cx="10" cy="8" rx="5" ry="8" transform="rotate(${Math.random()*60-30} 10 10)"/></svg>`;
    gpc.appendChild(p);

    function animatePetal() {
      const dur = 15000 + Math.random() * 20000;
      const startX = Math.random() * 100;
      const drift = (Math.random() - 0.5) * 200;
      p.style.left = startX + '%';
      p.animate([
        { transform: 'translateY(-20px) rotate(0deg) translateX(0)', opacity: 0 },
        { opacity: Math.random()*0.2+0.1, offset: 0.1 },
        { opacity: Math.random()*0.15+0.08, offset: 0.9 },
        { transform: `translateY(${window.innerHeight + 40}px) rotate(${Math.random()*360}deg) translateX(${drift}px)`, opacity: 0 }
      ], { duration: dur, easing: 'linear', fill: 'forwards' }).onfinish = () => {
        animatePetal();
      };
    }
    setTimeout(animatePetal, Math.random() * 12000);
  }
})();

// ── Gallery Lightbox ───────────────────────────────
(function () {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const items = document.querySelectorAll('.gallery-item[data-gallery]');
  const srcs = Array.from(items).map(el => el.querySelector('img').src);
  let current = 0;

  function openLightbox(index) {
    current = index;
    lightboxImg.src = srcs[current];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  function navigate(dir) {
    current = (current + dir + srcs.length) % srcs.length;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = srcs[current];
      lightboxImg.style.opacity = '1';
    }, 200);
  }

  items.forEach(item => {
    item.addEventListener('click', () => openLightbox(parseInt(item.dataset.gallery)));
  });
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => navigate(-1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => navigate(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
})();

// ── Copy to Clipboard ─────────────────────────────
function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    // Confetti burst from button position
    const rect = btn.getBoundingClientRect();
    burstConfetti(rect.left + rect.width/2, rect.top + rect.height/2);

    // Show toast
    const toast = document.getElementById('copyToast');
    toast.classList.remove('opacity-0', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');
    setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-4');
    }, 2000);

    // Brief button feedback
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<svg class="w-5 h-5 text-dusty" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="m4.5 12.75 6 6 9-13.5"/></svg>';
    setTimeout(() => { btn.innerHTML = originalHTML; }, 1500);
  });
}

// ── Digital Time Capsule ─────────────────────────
(function () {
  const form = document.getElementById('timeCapsuleForm');
  const formCard = document.getElementById('capsuleFormCard');
  const successDiv = document.getElementById('capsuleSuccess');
  const successMsg = document.getElementById('capsuleSuccessMsg');
  const newBtn = document.getElementById('capsuleNewBtn');
  const countEl = document.getElementById('capsuleCount');

  if (!form) return;

  const dateLabels = {
    wedding: 'Wedding Day — July 18, 2026',
    '1year': '1st Anniversary — July 18, 2027',
    '5year': '5th Anniversary — July 18, 2031',
    '10year': '10th Anniversary — July 18, 2036'
  };

  // Load existing capsule count from localStorage
  function getCapsules() {
    try { return JSON.parse(localStorage.getItem('timeCapsules') || '[]'); }
    catch { return []; }
  }

  function updateCount() {
    const capsules = getCapsules();
    if (countEl) countEl.textContent = capsules.length;
  }

  updateCount();

  // TODO: Replace with your actual EmailJS Service ID and Template ID
  const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

  const submitBtn = form.querySelector('button[type="submit"]');
  const submitBtnHTML = submitBtn.innerHTML;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('capsuleName').value.trim();
    const letter = document.getElementById('capsuleLetter').value.trim();
    const deliveryDate = form.querySelector('input[name="deliveryDate"]:checked').value;

    if (!name || !letter) return;

    // Disable button & show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 3v3m0 12v3m-7.794-4.206 2.121-2.121m9.346-9.346 2.121-2.121M3 12h3m12 0h3M6.206 6.206l2.121 2.121m9.346 9.346 2.121 2.121"/></svg> Sending...';

    // Send via EmailJS
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name: name,
      delivery_date: dateLabels[deliveryDate],
      message: letter
    }).then(function () {
      // Save to localStorage as backup
      const capsules = getCapsules();
      capsules.push({
        id: Date.now(),
        name: name,
        letter: letter,
        deliveryDate: deliveryDate,
        deliveryLabel: dateLabels[deliveryDate],
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('timeCapsules', JSON.stringify(capsules));

      // Show success
      form.classList.add('hidden');
      successDiv.classList.remove('hidden');
      successMsg.textContent = `Thank you, ${name}! Your letter will be opened on ${dateLabels[deliveryDate]}.`;
      updateCount();

      // Mini confetti burst for celebration
      if (typeof burstConfetti === 'function') burstConfetti();
    }).catch(function (err) {
      console.error('EmailJS error:', err);
      alert('Oops! Something went wrong sending your letter. Please try again.');
    }).finally(function () {
      submitBtn.disabled = false;
      submitBtn.innerHTML = submitBtnHTML;
    });
  });

  // "Write another letter" button
  if (newBtn) {
    newBtn.addEventListener('click', function () {
      form.reset();
      successDiv.classList.add('hidden');
      form.classList.remove('hidden');
    });
  }
})();
