/* ============================================================
   ZHALD_DESIGN - Wedding Invitation Script
   ============================================================ */

// ============================================================
// CONFIG — diisi oleh generator atau manual
// ============================================================
const CONFIG = {
  // Data diisi dari generator.html via localStorage
  groomName:    localStorage.getItem('groomName')    || 'I Putu Arjuna',
  brideName:    localStorage.getItem('brideName')    || 'Ni Kadek Sari',
  groomFull:    localStorage.getItem('groomFull')    || 'I Putu Arjuna Pratama, S.T.',
  brideFull:    localStorage.getItem('brideFull')    || 'Ni Kadek Sari Dewi, S.Pd.',
  groomParents: localStorage.getItem('groomParents') || 'Putra dari Bapak I Made Wijaya & Ibu Ni Nyoman Sari',
  brideParents: localStorage.getItem('brideParents') || 'Putri dari Bapak I Wayan Ardika & Ibu Ni Made Sulastri',
  weddingDate:  localStorage.getItem('weddingDate')  || 'Minggu, 17 Agustus 2025',
  hashtag:      localStorage.getItem('hashtag')      || '#ArjunaSari2025',
  akadTime:     localStorage.getItem('akadTime')     || '08.00 WITA',
  akadPlace:    localStorage.getItem('akadPlace')    || 'Pura Agung Besakih, Karangasem, Bali',
  resepsiTime:  localStorage.getItem('resepsiTime')  || '11.00 – 15.00 WITA',
  resepsiPlace: localStorage.getItem('resepsiPlace') || 'Bali Room, Hotel Grand Hyatt Bali',
  mapsUrl:      localStorage.getItem('mapsUrl')      || 'https://www.google.com/maps?q=Pura+Besakih+Bali',
  mapsEmbed:    localStorage.getItem('mapsEmbed')    || 'https://maps.google.com/maps?q=Pura+Besakih+Bali&output=embed',
  groomBank:    localStorage.getItem('groomBank')    || 'BCA',
  groomRek:     localStorage.getItem('groomRek')     || '1234 5678 9012',
  groomRekName: localStorage.getItem('groomRekName') || 'I PUTU ARJUNA PRATAMA',
  brideBank:    localStorage.getItem('brideBank')    || 'Mandiri',
  brideRek:     localStorage.getItem('brideRek')     || '9876 5432 1098',
  brideRekName: localStorage.getItem('brideRekName') || 'NI KADEK SARI DEWI',
  // ⬇️ ISI DI SINI agar ucapan tamu tersimpan & bisa dilihat SEMUA orang yang buka undangan.
  // Dapatkan dari https://jsonbin.io -> buat Bin baru berisi {"messages":[]}
  // Bin ID  : ada di URL bin setelah dibuat (contoh: 65abč123...)
  // X-Access-Key : Master Key / Access Key dari dashboard jsonbin.io (bagian API Keys)
  jsonbinId:    'ISI_BIN_ID_DISINI',
  jsonbinKey:   'ISI_X_ACCESS_KEY_DISINI',
};

// ============================================================
// DOM READY
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  injectData();
  initPetals();
  initOpeningScreen();
  initCornerFrames();
  initStagger();
  initScrollReveal();
  initNavigation();
  initGallery();
  initLightbox();
  initUcapan();
  initCountdown();
  initMusic();
  initCopyButtons();
  initParallax();
  initCardTilt();
});

// ============================================================
// CORNER FRAMES — pasang ornamen sudut emas di tiap kartu section
// supaya bingkai tidak lagi terlihat sebagai kotak polos.
// Section cover & penutup dilewati karena sudah punya bingkai
// ornamen sendiri (.cover-frame / .penutup-frame).
// ============================================================
function initCornerFrames() {
  const skip = new Set(['cover', 'penutup']);
  document.querySelectorAll('#main-content > section').forEach(sec => {
    if (skip.has(sec.id)) return;
    ['tl', 'tr', 'bl', 'br'].forEach(pos => {
      const span = document.createElement('span');
      span.className = `corner-ornament ${pos}`;
      span.setAttribute('aria-hidden', 'true');
      sec.appendChild(span);
    });
  });
}

// ============================================================
// STAGGER — beri delay bertahap otomatis ke item grid (kartu
// mempelai, acara, ATM, galeri) supaya muncul satu-satu, bukan
// serempak, saat discroll — memperkaya animasi di seluruh halaman.
// ============================================================
function initStagger() {
  const groups = [
    '.acara-cards > .acara-card',
    '.hadiah-cards > .atm-card',
    '.mempelai-grid > *'
  ];
  groups.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (!el.classList.contains('reveal') &&
          !el.classList.contains('reveal-left') &&
          !el.classList.contains('reveal-right')) {
        el.classList.add('reveal');
      }
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.5)}s`;
    });
  });
}

// ============================================================
// PARALLAX — pergeseran halus elemen dekoratif cover saat scroll,
// memberi kesan kedalaman alih-alih halaman datar/statis.
// ============================================================
function initParallax() {
  const ornament = document.querySelector('.cover-bali-ornament');
  const pattern  = document.querySelector('.cover-pattern');
  const cover    = document.getElementById('cover');
  if (!cover) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = cover.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / (rect.height || 1), 0), 1);
      if (ornament) ornament.style.transform = `translateY(${progress * 40}px)`;
      if (pattern)  pattern.style.transform  = `translateY(${progress * -25}px)`;
      ticking = false;
    });
  }, { passive: true });
}

// ============================================================
// CARD TILT — micro-interaction 3D ringan saat hover di kartu
// mempelai / acara / ATM, supaya elemen terasa hidup, bukan datar.
// Dilewati di perangkat sentuh (tidak ada hover yang berarti).
// ============================================================
function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  const cards = document.querySelectorAll('.acara-card, .mempelai-photo-wrapper, .atm-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// ============================================================
// INJECT DYNAMIC DATA INTO HTML
// ============================================================
function injectData() {
  // Opening screen
  setEl('#opening-groom-name', CONFIG.groomName);
  setEl('#opening-bride-name', CONFIG.brideName);
  setEl('#opening-date', CONFIG.weddingDate);

  // Cover
  setEl('#cover-groom-name', CONFIG.groomName);
  setEl('#cover-bride-name', CONFIG.brideName);
  setEl('#cover-date', CONFIG.weddingDate);
  setEl('#cover-hashtag', CONFIG.hashtag);

  // Mempelai
  setEl('#groom-full-name', CONFIG.groomFull);
  setEl('#bride-full-name', CONFIG.brideFull);
  setEl('#groom-script-name', CONFIG.groomName);
  setEl('#bride-script-name', CONFIG.brideName);
  setEl('#groom-parents', CONFIG.groomParents);
  setEl('#bride-parents', CONFIG.brideParents);

  // Acara
  setEl('#akad-time', CONFIG.akadTime);
  setEl('#akad-place', CONFIG.akadPlace);
  setEl('#resepsi-time', CONFIG.resepsiTime);
  setEl('#resepsi-place', CONFIG.resepsiPlace);

  // Maps
  const mapFrame = document.getElementById('map-frame');
  if (mapFrame) mapFrame.src = CONFIG.mapsEmbed;

  const mapBtn = document.getElementById('map-open-btn');
  if (mapBtn) mapBtn.onclick = () => window.open(CONFIG.mapsUrl, '_blank');

  // ATM Cards
  setEl('#groom-bank', CONFIG.groomBank);
  setEl('#groom-rek', CONFIG.groomRek);
  setEl('#groom-rek-name', CONFIG.groomRekName);
  setEl('#bride-bank', CONFIG.brideBank);
  setEl('#bride-rek', CONFIG.brideRek);
  setEl('#bride-rek-name', CONFIG.brideRekName);

  // Penutup
  setEl('#penutup-names', `${CONFIG.groomName} & ${CONFIG.brideName}`);
  setEl('#penutup-signature', `${CONFIG.groomName} & ${CONFIG.brideName}`);
}

function setEl(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}

// ============================================================
// OPENING SCREEN PETALS
// ============================================================
function initPetals() {
  const screen = document.getElementById('opening-screen');
  if (!screen) return;

  const colors = ['#c9a06a', '#e3aed0', '#b97aa8', '#e3bf8c', '#f6dcee'];
  const symbols = ['🌸', '✦', '❋', '✿', '⊹'];

  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: -20px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '50% 0'};
      animation-duration: ${5 + Math.random() * 8}s;
      animation-delay: ${Math.random() * 6}s;
      opacity: ${0.3 + Math.random() * 0.5};
    `;
    screen.appendChild(p);
  }
}

// Cover floating leaves
function initCoverLeaves() {
  const cover = document.getElementById('cover');
  if (!cover) return;
  const syms = ['✦', '❋', '⊹', '✿'];
  for (let i = 0; i < 12; i++) {
    const l = document.createElement('div');
    l.className = 'cover-floating-leaf';
    l.textContent = syms[Math.floor(Math.random() * syms.length)];
    l.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: -20px;
      animation-duration: ${8 + Math.random() * 10}s;
      animation-delay: ${Math.random() * 8}s;
      font-size: ${0.8 + Math.random() * 1}rem;
    `;
    cover.appendChild(l);
  }
}

// ============================================================
// OPENING SCREEN
// ============================================================
function initOpeningScreen() {
  const screen = document.getElementById('opening-screen');
  const mainContent = document.getElementById('main-content');
  const openBtn = document.getElementById('btn-open-invitation');

  if (!screen || !openBtn) return;

  openBtn.addEventListener('click', () => {
    openBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Membuka...';
    openBtn.disabled = true;

    setTimeout(() => {
      screen.classList.add('exit');
      setTimeout(() => {
        screen.style.display = 'none';
        mainContent.classList.add('visible');
        document.body.style.overflow = 'auto';
        initCoverLeaves();
        // Auto-play music
        const audio = document.getElementById('bgMusic');
        if (audio) audio.play().catch(() => {});
        const musicBtn = document.getElementById('musicBtn');
        if (musicBtn) musicBtn.classList.add('playing');
        updateMusicIcon(true);
      }, 1200);
    }, 600);
  });
}

// ============================================================
// MUSIC PLAYER
// ============================================================
function initMusic() {
  const audio = document.getElementById('bgMusic');
  const btn   = document.getElementById('musicBtn');
  if (!audio || !btn) return;

  audio.loop   = true;
  audio.volume = 0.6;

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      btn.classList.add('playing');
      updateMusicIcon(true);
    } else {
      audio.pause();
      btn.classList.remove('playing');
      updateMusicIcon(false);
    }
  });
}

function updateMusicIcon(playing) {
  const icon = document.querySelector('#musicBtn i');
  if (icon) {
    icon.className = playing ? 'fas fa-music' : 'fas fa-volume-mute';
  }
}

// ============================================================
// FLOATING NAV
// ============================================================
function initNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn[data-target]');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  });

  // Update active nav on scroll
  const sections = ['cover','mempelai','love-story','acara','galeri','hadiah','ucapan','penutup'];
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 200;
    sections.forEach(id => {
      const sec = document.getElementById(id);
      if (!sec) return;
      if (sec.offsetTop <= scrollY && sec.offsetTop + sec.offsetHeight > scrollY) {
        navBtns.forEach(b => {
          b.classList.toggle('active', b.dataset.target === id);
        });
      }
    });
  });
}

// ============================================================
// SCROLL REVEAL ANIMATIONS
// ============================================================
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach(el => observer.observe(el));
}

// ============================================================
// COUNTDOWN TIMER
// ============================================================
function initCountdown() {
  const wdStr = CONFIG.weddingDate;
  // Extract from config — parse date parts if valid
  const stored = localStorage.getItem('weddingDateISO');
  if (!stored) return;

  const target = new Date(stored).getTime();
  if (isNaN(target)) return;

  function update() {
    const now  = Date.now();
    const diff = target - now;
    if (diff <= 0) {
      setEl('#cd-days',  '00');
      setEl('#cd-hours', '00');
      setEl('#cd-mins',  '00');
      setEl('#cd-secs',  '00');
      return;
    }
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);
    setEl('#cd-days',  String(days).padStart(2, '0'));
    setEl('#cd-hours', String(hours).padStart(2, '0'));
    setEl('#cd-mins',  String(mins).padStart(2, '0'));
    setEl('#cd-secs',  String(secs).padStart(2, '0'));
  }

  update();
  setInterval(update, 1000);
}

// ============================================================
// GALLERY
// ============================================================
function initGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  for (let i = 1; i <= 20; i++) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.index = i - 1;

    item.innerHTML = `
      <img src="Foto${i}.jpg" alt="Prewedding ${i}" loading="lazy"
           onerror="this.src='https://placehold.co/400x600/0d4a2f/c9a84c?text=Foto+${i}'">
      <div class="gallery-overlay">
        <span><i class="fas fa-expand"></i> Lihat</span>
      </div>
    `;

    item.addEventListener('click', () => openLightbox(i - 1));
    grid.appendChild(item);
  }
}

// ============================================================
// LIGHTBOX
// ============================================================
let currentPhoto = 0;

function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  document.getElementById('lb-close').addEventListener('click', closeLightbox);
  document.getElementById('lb-prev').addEventListener('click', () => navigateLightbox(-1));
  document.getElementById('lb-next').addEventListener('click', () => navigateLightbox(1));

  lb.addEventListener('click', e => {
    if (e.target === lb) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft')  navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

function openLightbox(index) {
  currentPhoto = index;
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lb-img');
  lb.classList.add('open');
  img.src = `Foto${index + 1}.jpg`;
  img.onerror = () => { img.src = `https://placehold.co/800x600/0d4a2f/c9a84c?text=Foto+${index + 1}`; };
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  currentPhoto = (currentPhoto + dir + 20) % 20;
  const img = document.getElementById('lb-img');
  img.style.opacity = '0';
  setTimeout(() => {
    img.src = `Foto${currentPhoto + 1}.jpg`;
    img.onerror = () => { img.src = `https://placehold.co/800x600/0d4a2f/c9a84c?text=Foto+${currentPhoto + 1}`; };
    img.style.opacity = '1';
    img.style.transition = 'opacity 0.3s ease';
  }, 200);
}

// ============================================================
// COPY REKENING
// ============================================================
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      navigator.clipboard.writeText(text).then(() => {
        showToast('<i class="fas fa-check-circle"></i> Nomor rekening berhasil disalin!');
      }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('<i class="fas fa-check-circle"></i> Nomor rekening berhasil disalin!');
      });
    });
  });
}

// ============================================================
// UCAPAN & DOA — JSONBin.io
// ============================================================
let jsonbinId  = '';
let jsonbinKey = '';

function initUcapan() {
  // Bin ID & Access Key sudah di-hardcode di CONFIG (lihat bagian atas file ini)
  // sehingga SEMUA tamu yang membuka undangan otomatis membaca & menyimpan
  // ke database JSONBin yang sama — bukan per-device.
  jsonbinId  = (CONFIG.jsonbinId  && CONFIG.jsonbinId  !== 'ISI_BIN_ID_DISINI')       ? CONFIG.jsonbinId.trim()  : '';
  jsonbinKey = (CONFIG.jsonbinKey && CONFIG.jsonbinKey !== 'ISI_X_ACCESS_KEY_DISINI') ? CONFIG.jsonbinKey.trim() : '';

  loadUcapan();

  const form = document.getElementById('ucapan-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      submitUcapan();
    });
  }
}

async function loadUcapan() {
  const container = document.getElementById('ucapan-list');
  if (!container) return;

  if (!jsonbinId || !jsonbinKey) {
    container.innerHTML = `
      <div class="ucapan-loading">
        <i class="fas fa-info-circle" style="color:var(--gold)"></i>
        Fitur ucapan belum diaktifkan mempelai. Silakan hubungi admin undangan.
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="ucapan-loading">
      <i class="fas fa-circle-notch fa-spin" style="color:var(--gold)"></i>
      Memuat ucapan & doa...
    </div>`;

  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${jsonbinId}/latest`, {
      headers: { 'X-Access-Key': jsonbinKey }
    });
    const data = await res.json();
    const messages = data.record?.messages || [];

    if (messages.length === 0) {
      container.innerHTML = `
        <div class="ucapan-loading">
          <i class="fas fa-heart" style="color:var(--gold)"></i>
          Belum ada ucapan. Jadilah yang pertama!
        </div>`;
      return;
    }

    container.innerHTML = '';
    // Show newest first
    [...messages].reverse().forEach((msg, i) => {
      const item = document.createElement('div');
      item.className = 'ucapan-item reveal';
      item.innerHTML = `
        <div class="ucapan-header">
          <div class="ucapan-avatar">${msg.name.charAt(0).toUpperCase()}</div>
          <div class="ucapan-meta">
            <div class="ucapan-name">${escapeHtml(msg.name)}</div>
            <div class="ucapan-attend">${getAttendLabel(msg.attend)}</div>
          </div>
          <div style="font-size:0.65rem;color:var(--text-light);font-family:'Montserrat',sans-serif;">${msg.date || ''}</div>
        </div>
        <div class="ucapan-msg">"${escapeHtml(msg.message)}"</div>
      `;
      container.appendChild(item);
    });

    // Re-run scroll reveal for newly added items
    initScrollReveal();

  } catch (err) {
    container.innerHTML = `
      <div class="ucapan-loading" style="color:#ff8080;">
        <i class="fas fa-exclamation-triangle"></i>
        Gagal memuat ucapan. Periksa Bin ID & Access Key.
      </div>`;
    console.error(err);
  }
}

async function submitUcapan() {
  if (!jsonbinId || !jsonbinKey) {
    showToast('<i class="fas fa-exclamation"></i> Fitur ucapan belum diaktifkan mempelai.');
    return;
  }

  const nameEl    = document.getElementById('ucapan-name');
  const msgEl     = document.getElementById('ucapan-message');
  const attendEl  = document.querySelector('input[name="attend"]:checked');
  const submitBtn = document.getElementById('ucapan-submit');

  const name    = nameEl?.value.trim();
  const message = msgEl?.value.trim();
  const attend  = attendEl?.value || 'hadir';

  if (!name || !message) {
    showToast('<i class="fas fa-exclamation"></i> Nama dan ucapan wajib diisi!');
    return;
  }

  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
  submitBtn.disabled  = true;

  try {
    // GET current data
    const getRes = await fetch(`https://api.jsonbin.io/v3/b/${jsonbinId}/latest`, {
      headers: { 'X-Access-Key': jsonbinKey }
    });
    const getData   = await getRes.json();
    const existing  = getData.record?.messages || [];

    const newEntry = {
      name,
      message,
      attend,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
    };

    existing.push(newEntry);

    // PUT updated data
    const putRes = await fetch(`https://api.jsonbin.io/v3/b/${jsonbinId}`, {
      method:  'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': jsonbinKey
      },
      body: JSON.stringify({ messages: existing })
    });

    if (putRes.ok) {
      nameEl.value   = '';
      msgEl.value    = '';
      showToast('<i class="fas fa-heart"></i> Ucapan berhasil dikirim! Terima kasih 🙏');
      loadUcapan();
    } else {
      throw new Error('Failed to update');
    }

  } catch (err) {
    showToast('<i class="fas fa-exclamation-triangle"></i> Gagal mengirim ucapan. Coba lagi.');
    console.error(err);
  } finally {
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Ucapan & Doa';
    submitBtn.disabled  = false;
  }
}

function getAttendLabel(attend) {
  const map = {
    hadir:     '✅ Hadir',
    'tidak':   '❌ Tidak Hadir',
    'mungkin': '🤔 Mungkin Hadir'
  };
  return map[attend] || attend;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ============================================================
// TOAST NOTIFICATION
// ============================================================
function showToast(html) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = html;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('exit');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}