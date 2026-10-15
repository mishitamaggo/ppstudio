/**
 * Parcel Play · Creative Strategy & Brand-Building Studio
 * Interactive UI Engine with real case studies, thinking, and metrics
 */

const $ = s => document.querySelector(s);
const IND = 2.5, MAX = 6;
const money = n => n >= 100000 ? '₹' + (n / 100000).toFixed(1).replace(/\.0$/, '') + 'L' : '₹' + (n / 1000) + 'K';

// The verified Case Studies with authentic physical packaging photography
const B = [
  {
    id: 'beauty',
    n: 'Beauty & Skincare',
    ch: 'Meta Ads',
    b: 120000,
    r: 5.5,
    bg: 'var(--b1)',
    st: 'var(--s1)',
    img: '/images/skincare-botanique.jpg',
    imgAlt: 'Botanique Naturelle amber dropper bottle and tactile carton packaging',
    imgCaption: 'Botanique Naturelle · Amber Glass & 320gsm Debossed Carton',
    imgBadge: '5.5x Meta ROAS · Top Performer',
    pos: 'The skincare brand that lets real skin speak for itself.',
    cust: 'Shoppers dealing with persistent concerns like hormonal breakouts or uneven texture, who have grown exhausted by airbrushed influencer claims and decide with their eyes. We modeled high-intent lookalike audiences from the top 10% repeat buyers.',
    ins: 'People do not believe another empty "miracle glow" claim. They trust raw bathroom lighting, honest textures, and real 30-day journeys. Unfiltered problem-to-solution videos consistently generated our highest thumb-stop rates.',
    cat: 'Over-produced studio films and generic miracle claims.',
    brand: 'Candid, unretouched bathroom routine videos from real customers.',
    idea: 'Problem, then proof.',
    ideaLine: '15-second Reels name the exact frustration without shame, clean step-by-step carousels demystify the daily routine, and gentle retargeting welcomes hesitant visitors back.',
    tags: ['Unfiltered bathroom routines', 'Real skin journeys', 'Step-by-step rituals', 'Iterative monthly creative'],
    kp: [
      ['68%', 'of revenue originated directly from Reels'],
      ['3.2%', 'average click-through rate on video creative'],
      ['-44%', 'reduction in cost per acquisition via retargeting']
    ]
  },
  {
    id: 'food',
    n: 'D2C Food & Bev',
    ch: 'Google Ads',
    b: 65000,
    r: 4.8,
    bg: 'var(--b2)',
    st: 'var(--s2)',
    img: '/images/coffee-terra.jpg',
    imgAlt: 'Terra Coffee Roasters craft pouches and wax seal',
    imgCaption: 'Terra Coffee Roasters · Matte Craft Pouches & Wax Seal',
    imgBadge: '4.8x Search ROAS · 3.8% CVR',
    pos: 'The morning coffee you subscribe to and never have to think about again.',
    cust: 'Discerning coffee lovers who already know their preferred roast, grind, and origin, actively searching phrases like "fresh roasted specialty coffee online".',
    ins: 'Coffee purchase intent is intensely habitual and peaks between 7:00 AM and 10:00 AM right as morning brews are being poured. Dayparting ad delivery to those exact morning hours eliminated wasted budget.',
    cat: 'One-off impulse bags, with rival brands poaching search traffic on your name.',
    brand: 'A loyal subscriber base, with the brand name defended and dominant on Google.',
    idea: 'Morning, handled.',
    ideaLine: 'Google Search and Shopping meet the buyer at the peak moment of morning craving, while thoughtful email reminders bring back anyone who left a full cart behind.',
    tags: ['Sensory tasting notes', 'Frictionless subscription flow', 'High-intent search copy', 'Defensive brand bidding'],
    kp: [
      ['3.8%', 'storewide conversion rate'],
      ['₹14.2', 'average cost per qualified search click'],
      ['2.1x', 'conversion lift from cart abandonment remarketing']
    ]
  },
  {
    id: 'health',
    n: 'Health & Wellness',
    ch: 'Meta Ads',
    b: 90000,
    r: 4.2,
    bg: 'var(--b3)',
    st: 'var(--s3)',
    img: '/images/products/pr-boxes/pr-box-1.png',
    imgAlt: 'Custom rigid PR unboxing box with gold foil and velvet lining',
    imgCaption: 'Vitalis Bio-Discovery · Custom Rigid Unboxing Suite',
    imgBadge: '4.2x ROAS · +38% Order Value',
    pos: 'The daily supplement brand that educates first and sells second.',
    cust: 'Health-conscious individuals and fitness enthusiasts who scrutinize ingredient dosages, purity certifications, and clinical research before swallowing a single capsule.',
    ins: 'Skepticism in wellness is high. Buyers don\'t trust faceless corporate claims; they trust qualified practitioners who explain bioavailability. A zero-risk discovery kit eliminated the hesitation to try.',
    cat: 'Loud miracle promises in the brand\'s own corporate voice.',
    brand: 'Trusted nutritionists and creators explaining the science in plain words.',
    idea: 'Try it first.',
    ideaLine: 'A low-friction discovery kit gets the product into their daily morning routine, educational email sequences build deep trust, and curated bundles increase order value.',
    tags: ['Practitioner deconstructions', 'Honest science videos', 'Low-barrier discovery kits', 'Value bundle architecture'],
    kp: [
      ['2.3x', 'higher click-through on practitioner education ads'],
      ['+38%', 'average order value lift from custom bundles'],
      ['₹85', 'cost per 1,000 video views reaching high-intent buyers']
    ]
  },
  {
    id: 'edtech',
    n: 'EdTech',
    ch: 'Google + Meta',
    b: 180000,
    r: 3.9,
    bg: 'var(--b4)',
    st: 'var(--s4)',
    img: '/images/studio-craft.jpg',
    imgAlt: 'Studio craft desk with print proofs, typographic specimens, and mentorship kits',
    imgCaption: 'ScholarPath · Editorial Mentorship Kits & Verification',
    imgBadge: '3.9x Blended ROAS · 22% CVR',
    pos: 'Online academic mentorship that parents actually trust with their child\'s future.',
    cust: 'Dedicated parents navigating stressful high-stakes academic milestones (Boards, JEE, and NEET), seeking genuine academic guidance rather than gamified apps.',
    ins: 'Parents don\'t make impulsive decisions about their child\'s education. They need to see the teachers, understand the pedagogy, and hear from families whose children actually improved.',
    cat: 'High-pressure sales calls and flashy billboard promises.',
    brand: 'Direct access to master educators and genuine student milestones.',
    idea: 'Exam season.',
    ideaLine: 'Campaigns timed precisely to exam registration windows, meeting parents during the exact weeks when academic anxiety turns into decisive action.',
    tags: ['Teacher spotlights', 'Milestone breakdowns', 'Zero-pressure consultations', 'Parent-to-parent proof'],
    kp: [
      ['₹180', 'cost per qualified parent consultation lead'],
      ['22%', 'lead-to-enrollment conversion rate'],
      ['+56%', 'outperformance above education category ROAS']
    ]
  }
];

// Display brand story with real tactile packaging photo card
function showStory(id, scroll) {
  const x = B.find(v => v.id === id);
  if (!x) return;

  document.querySelectorAll('#tabs .tab').forEach(t => {
    t.setAttribute('aria-selected', t.dataset.id === id ? 'true' : 'false');
  });

  const s = $('#story');
  if (!s) return;

  s.style.setProperty('--bk', x.bg);
  s.style.setProperty('--st', x.st);

  s.innerHTML = `
    <div class="top">
      <div class="pos">
        <span class="hand">the promise</span>
        <p class="q">${x.pos}</p>
      </div>
      <div class="roas">
        <b>${x.r}x</b>
        <span>return on ad spend</span>
      </div>
    </div>

    <!-- Split Visual Packaging Showcase + Problem/Proof Grid -->
    <div class="story-main-grid">
      <div class="story-visual-card">
        <div class="story-img-wrap">
          <img src="${x.img}" alt="${x.imgAlt}" loading="lazy" />
          <span class="story-img-badge">${x.imgBadge}</span>
        </div>
        <div class="story-img-caption">
          <span>${x.imgCaption}</span>
        </div>
      </div>

      <div class="cards">
        <div class="c">
          <span class="lab">Who it's for</span>
          <p>${x.cust}</p>
        </div>
        <div class="c">
          <span class="lab">What we noticed</span>
          <p>${x.ins}</p>
        </div>
        <div class="c">
          <span class="lab">How it stands apart</span>
          <div class="vs">
            <div class="o">${x.cat}</div>
            <div class="n">${x.brand}</div>
          </div>
        </div>
        <div class="c idea">
          <span class="lab">The campaign idea</span>
          <h3>${x.idea}</h3>
          <p>${x.ideaLine}</p>
        </div>
      </div>
    </div>

    <div class="c">
      <span class="lab">Creative direction</span>
      <div class="tags">
        ${x.tags.map(t => `<span>${t}</span>`).join('')}
      </div>
    </div>

    <div class="nums">
      ${x.kp.map(k => `
        <div>
          <b>${k[0]}</b>
          <span>${k[1]}</span>
        </div>
      `).join('')}
    </div>

    <div class="bars">
      <div class="row">
        <span>${x.n.split(' ')[0]}</span>
        <div class="track">
          <div class="fill" style="width:${(x.r / MAX) * 100}%"></div>
          <div class="mark" style="left:${(IND / MAX) * 100}%"></div>
        </div>
        <span>${x.r}x</span>
      </div>
      <div class="row">
        <span>Industry</span>
        <div class="track">
          <div class="fill ind" style="width:${(IND / MAX) * 100}%"></div>
        </div>
        <span>${IND}x</span>
      </div>
    </div>
  `;

  if (scroll) {
    $('#stories').scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth'
    });
  }
}

// Initialize Interactive Components
document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle
  try {
    const saved = localStorage.getItem('parcelplay_theme');
    if (saved) document.documentElement.dataset.theme = saved;
  } catch (e) {}

  const themeBtn = $('#theme');
  if (themeBtn) {
    themeBtn.onclick = () => {
      const cur = document.documentElement.dataset.theme || (window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
      const nx = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = nx;
      try {
        localStorage.setItem('parcelplay_theme', nx);
      } catch (e) {}
    };
  }

  // 2. Copy buttons with feedback
  document.querySelectorAll('.copy').forEach(b => {
    b.onclick = async () => {
      let ok = false;
      try {
        await navigator.clipboard.writeText(b.dataset.c);
        ok = true;
      } catch (e) {
        const c = b.parentElement.querySelector('code');
        const r = document.createRange();
        r.selectNodeContents(c);
        const s = window.getSelection();
        s.removeAllRanges();
        s.addRange(r);
      }
      b.textContent = ok ? 'Copied' : 'Selected';
      setTimeout(() => b.textContent = 'Copy', 1600);
    };
  });

  // 3. Hero Showcase Thumbnail Switcher
  const showcaseImg = $('#heroShowcaseImg');
  const showcaseTitle = $('#heroShowcaseTitle');
  const showcaseBadge = $('#heroShowcaseBadge');
  const switchBtns = document.querySelectorAll('.switch-btn');

  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const newSrc = btn.dataset.img;
      const newTitle = btn.dataset.title;
      const newBadge = btn.dataset.badge;

      if (showcaseImg && newSrc) {
        showcaseImg.style.opacity = '0.35';
        showcaseImg.style.transform = 'scale(0.98)';
        setTimeout(() => {
          showcaseImg.src = newSrc;
          showcaseImg.style.opacity = '1';
          showcaseImg.style.transform = 'scale(1)';
        }, 160);
      }
      if (showcaseTitle && newTitle) showcaseTitle.textContent = newTitle;
      if (showcaseBadge && newBadge) showcaseBadge.textContent = newBadge;
    });
  });

  // 4. Render Brand Tabs
  const tabsContainer = $('#tabs');
  if (tabsContainer) {
    tabsContainer.innerHTML = '';
    B.forEach(x => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'tab';
      b.setAttribute('role', 'tab');
      b.dataset.id = x.id;
      b.style.setProperty('--sc', x.st);
      b.innerHTML = `<i></i>${x.n}`;
      b.onclick = () => showStory(x.id);
      tabsContainer.append(b);
    });
    // Show default
    showStory('beauty');
  }

  // 5. Populate Numbers Table
  const tblBody = $('#tbl tbody');
  if (tblBody) {
    tblBody.innerHTML = [...B].sort((a, b) => b.r - a.r).map(x => `
      <tr class="go" tabindex="0" data-id="${x.id}" style="--st:${x.st}">
        <td>
          <i class="dot"></i>${x.n}<br>
          <span class="mut" style="font-size:14px; margin-left:20px;">${x.ch}</span>
        </td>
        <td class="n">${money(x.b)}</td>
        <td class="n" style="font-weight:700; color:${x.st};">${x.r}x</td>
      </tr>
    `).join('');

    document.querySelectorAll('#tbl tr.go').forEach(r => {
      r.onclick = () => showStory(r.dataset.id, true);
      r.onkeydown = e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showStory(r.dataset.id, true);
        }
      };
    });
  }

  // 6. Mobile Drawer Toggle
  const menuToggle = $('#menuToggle');
  const drawer = $('#mobileDrawer');
  const drawerClose = $('#drawerClose');
  if (menuToggle && drawer && drawerClose) {
    menuToggle.onclick = () => drawer.classList.add('open');
    drawerClose.onclick = () => drawer.classList.remove('open');
    drawer.querySelectorAll('.dlink').forEach(link => {
      link.onclick = () => drawer.classList.remove('open');
    });
  }

  // 7. Project Inquiry Form
  const form = $('#projectForm');
  const successBox = $('#formSuccess');
  const resetBtn = $('#resetBtn');
  const succName = $('#succName');
  const succBrand = $('#succBrand');

  if (form && successBox) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = $('#clientName');
      const brand = $('#brandName');
      const email = $('#clientEmail');
      const url = $('#brandUrl');
      const brief = $('#projectBrief');

      let valid = true;

      const validate = (input, errId, condition) => {
        const group = input.closest('.f-group');
        if (!condition) {
          group.classList.add('has-error');
          valid = false;
        } else {
          group.classList.remove('has-error');
        }
      };

      validate(name, 'nameError', name.value.trim().length > 1);
      validate(brand, 'brandError', brand.value.trim().length > 1);
      validate(email, 'emailError', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
      validate(url, 'urlError', url.value.trim().length > 2);
      validate(brief, 'briefError', brief.value.trim().length > 5);

      if (valid) {
        if (succName) succName.textContent = name.value.trim();
        if (succBrand) succBrand.textContent = brand.value.trim();

        form.hidden = true;
        successBox.hidden = false;
      }
    });

    if (resetBtn) {
      resetBtn.onclick = () => {
        form.reset();
        form.hidden = false;
        successBox.hidden = true;
      };
    }
  }

  // 8. FAQ Accordion Interaction
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-btn');
    const body = item.querySelector('.faq-body');
    if (!btn || !body) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      // Close other items
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-btn');
          const otherBody = other.querySelector('.faq-body');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherBody) otherBody.hidden = true;
        }
      });

      if (isOpen) {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        body.hidden = true;
      } else {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        body.hidden = false;
      }
    });
  });

  // 9. Brand Playbooks Dispatch Notification Form
  const pbForm = $('#playbooksNotifyForm');
  const pbSuccess = $('#playbooksSuccess');
  if (pbForm && pbSuccess) {
    pbForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = pbForm.querySelector('input[type="email"]');
      if (emailInput && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
        pbForm.style.display = 'none';
        pbSuccess.hidden = false;
        pbSuccess.innerHTML = `<span style="color:var(--s3); font-weight:700;">✓ You're on the dispatch list.</span> We will notify <strong>${emailInput.value.trim()}</strong> the moment Dispatch 01 drops in November 2026.`;
      }
    });
  }

  // 10. Multi-Page Active Nav Link Detection
  const path = window.location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/';
  document.querySelectorAll('nav a, .drawer-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    const cleanHref = href.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/';
    if (cleanHref === path || (path !== '/' && cleanHref !== '/' && path.startsWith(cleanHref))) {
      a.classList.add('active');
    }
  });
});
