// ==========================================================================
// MANIVEL N - DYNAMIC LOGIC & PARTICLE ENGINE
// Typing animation, 3D tilt, Particle canvas, Counters, Proposals
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTypewriter();
  initTiltEffect();
  initReadingProgress();
  initThemeToggle();
  initMobileNav();
  initPhotoUploader();
  initExperienceFilter();
  initSkillsSearch();
  initResearchProposals();
  initCounterAnimation();
  initContactForm();
});

// 1. Particle Canvas Engine
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  const particleCount = window.innerWidth < 768 ? 35 : 75;

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Connect particles with distance lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }

  render();
}

// 2. Dynamic Typewriter Effect
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

    const roles = [
    "Tamil Nadu National Rep @ All India NCC RDC Innovation 2025",
    "AICTE YUKTI Innovation Fellowship Finalist",
    "NCC 'C' Certificate 'A' Grade Cadet",
    "M.A. Public Administration Scholar (RGNIYD)",
    "AICTE Innovation Ambassador",
    "Biomedical Engineering Graduate (PDKVCET · 78%)",
    "Cyber Awareness Crusader (600+ Mentored)",
    "Historical Governance & Policy Researcher"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let speed = 70;

  function type() {
    const current = roles[roleIdx];

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      speed = 35;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      speed = 75;
    }

    if (!isDeleting && charIdx === current.length) {
      isDeleting = true;
      speed = 1800; // Pause at full word
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      speed = 400; // Pause before next word
    }

    setTimeout(type, speed);
  }

  type();
}

// 3. Interactive 3D Tilt Effect
function initTiltEffect() {
  const cards = document.querySelectorAll('.tilt-card');
  if (window.innerWidth < 768) return; // Disable on small touch screens

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      const rotateX = deltaY * -7;
      const rotateY = deltaX * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// 4. Reading Progress Bar
function initReadingProgress() {
  const progressBar = document.getElementById('progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

// 5. Dark / Light Mode Toggle
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;
  
  const savedTheme = localStorage.getItem('manivel_theme');
  if (savedTheme) {
    htmlEl.setAttribute('data-theme', savedTheme);
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', next);
      localStorage.setItem('manivel_theme', next);
    });
  }
}

// 6. Mobile Nav
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('mobile-open');
    const icon = toggleBtn.querySelector('i');
    if (navMenu.classList.contains('mobile-open')) {
      icon.classList.replace('fa-bars', 'fa-xmark');
    } else {
      icon.classList.replace('fa-xmark', 'fa-bars');
    }
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-open');
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
    });
  });
}

// 7. Profile Photo Custom Uploader & LocalStorage Cache
function initPhotoUploader() {
  const fileInput = document.getElementById('photo-upload-input');
  const profileImg = document.getElementById('profile-img');
  const dropZone = document.getElementById('avatar-drop-zone');

  const savedPhoto = localStorage.getItem('manivel_profile_photo');
  if (savedPhoto && profileImg) {
    profileImg.src = savedPhoto;
  }

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      if (profileImg) profileImg.src = dataUrl;
      try {
        localStorage.setItem('manivel_profile_photo', dataUrl);
      } catch (err) {
        console.warn('LocalStorage size exceeded', err);
      }
    };
    reader.readAsDataURL(file);
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    });
  }

  if (dropZone) {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('drag-over');
    });
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    });
  }
}

// 8. Experience Filter Tabs
function initExperienceFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const expCards = document.querySelectorAll('.exp-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      expCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 9. Dynamic Skills Search
function initSkillsSearch() {
  const searchInput = document.getElementById('skill-search-input');
  const skillCards = document.querySelectorAll('.skill-card');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    skillCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(query)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

// 10. Research Proposals Database & Modal Controller
const PROPOSALS_DB = {
  track1: {
    trackNum: "Track 01",
    tag: "Local Governance & Historical Water Systems",
    title: "Continuity and Transformation in Tamil Nadu's Local Governance: From Uttaramerur Epigraphy and Eri Systems to Modern Panchayati Raj",
    researchQuestion: "How did traditional institutional mechanisms of resource allocation—specifically collective water maintenance in medieval tank irrigation (Eri) systems—compare in operational autonomy, equity, and accountability with post-73rd Constitutional Amendment Panchayati Raj institutions in rural Tamil Nadu?",
    sourcesConsulted: [
      "Epigraphia Indica & South Indian Inscriptions (Archaeological Survey of India): Inscriptions of Parantaka Chola I at Uttaramerur (Vaikuntha Perumal Temple).",
      "Colonial Revenue and Irrigation Records: Madras Board of Revenue Proceedings, Arthur Cotton's reports on the Palar and Kaveri anicuts (1850–1880).",
      "Post-Independence Legislative Acts: Tamil Nadu Panchayats Act 1958 and 1994 statutory frameworks, State Planning Commission working group reports.",
      "Oral and archival records of Kudimaramath (community water management) in Kanchipuram and Chengalpattu districts."
    ],
    methodology: "Comparative Historical Institutionalism combining epigraphical textual criticism, colonial land-revenue archival analysis, and qualitative institutional mapping of resource-monitoring committees (Variyams) versus contemporary Gram Sabha committees.",
    anticipatedContribution: "Fulfills the critical need to bridge epigraphical administrative records with modern development administration, providing empirical historical depth to ongoing decentralization and climate-resilient water policy dialogues in Tamil Nadu.",
    references: [
      "Nilakanta Sastri, K. A. (1935). 'The Colas.' University of Madras.",
      "Stein, Burton. (1980). 'Peasant State and Society in Medieval South India.' Oxford University Press.",
      "Karashima, Noboru. (1984). 'South Indian History and Society: Studies from Inscriptions A.D. 850–1800.' Oxford University Press.",
      "Wade, Robert. (1988). 'Village Republics: Economic Conditions for Collective Action in South India.' Cambridge University Press."
    ]
  },
  track2: {
    trackNum: "Track 02",
    tag: "Constitutional Governance & Civil Services",
    title: "From Colonial Apparatus to Sovereign Developmental State: Re-Examining the Indian Constituent Assembly Debates on Administrative Structure (1946–1950)",
    researchQuestion: "In what ways did the institutional debates between centralist modernizers (led by Sardar Patel and B.R. Ambedkar) and proponents of decentralized Gandhian administrative models shape the constitutional hierarchy, federal autonomy, and neutrality of the Indian Civil Services?",
    sourcesConsulted: [
      "Constituent Assembly Debates (Official Report, Volumes I to XII, Lok Sabha Secretariat).",
      "Draft Constitution of India (February 1948) and comparative amendments submitted by provincial representatives.",
      "Das, Durga (Ed.). 'Sardar Patel's Correspondence: 1945–50', Volumes 4 & 5 (Navajivan Publishing House).",
      "Historical archives of the Imperial Legislative Council and Government of India Act 1935 administrative clauses."
    ],
    methodology: "Historical discourse analysis of Assembly debates and committee transcripts; comparative legal analysis of Part XIV (Articles 308–323) of the Indian Constitution; institutional path dependency tracing from British colonial bureaucracy to the Indian Administrative Service.",
    anticipatedContribution: "Illuminates how post-colonial bureaucratic structures balanced state cohesion with developmental mandates, providing valuable analytical frameworks for modern public administration scholars studying administrative reform.",
    references: [
      "Austin, Granville. (1966). 'The Indian Constitution: Cornerstone of a Nation.' Clarendon Press.",
      "Chandra, Bipan, et al. (2000). 'India After Independence: 1947–2000.' Penguin Books.",
      "Brass, Paul R. (1994). 'The Politics of India Since Independence.' Cambridge University Press.",
      "Potter, David C. (1986). 'India's Political Administrators: 1919–1983.' Clarendon Press."
    ]
  },
  track3: {
    trackNum: "Track 03",
    tag: "Social Justice & Affirmative Action Policy",
    title: "Institutionalizing Social Equity: The Policy Legacy of the Self-Respect Movement and Educational Democratization in Tamil Nadu (1921–1980)",
    researchQuestion: "How did grassroots ideological mobilization by Periyar E.V. Ramasamy and the Self-Respect Movement translate into codified legislative policies, specifically the 1921/1927 Communal Government Orders and mid-20th century educational expansion in Tamil Nadu?",
    sourcesConsulted: [
      "Madras Legislative Council Debates (1920–1937) regarding Communal G.O. No. 613 and subsequent quota enactments.",
      "Editorial archives and pamphlets of 'Kudi Arasu' and 'Revolt' publications (1925–1940) housed in the Periyar Thidal Archives, Chennai.",
      "Department of Public Instruction Annual Reports (Government of Madras, 1930–1970).",
      "Madras Institute of Development Studies (MIDS) historical surveys on affirmative action and literacy attainment."
    ],
    methodology: "Social movement-to-policy translation analysis: tracing ideational demands from public protest rhetoric into executive orders, followed by longitudinal statistical evaluation of literacy and collegiate access across non-elite social groups in Tamil Nadu.",
    anticipatedContribution: "Provides documented historical evidence demonstrating how public policy and social reform movements interact to produce durable welfare states and inclusive governance models.",
    references: [
      "Irschick, Eugene F. (1969). 'Politics and Social Conflict in South India: The Non-Brahmin Movement and Tamil Separatism, 1916–1929.' University of California Press.",
      "Barnett, Marguerite Ross. (1976). 'The Politics of Cultural Nationalism in South India.' Princeton University Press.",
      "Pandian, M. S. S. (2007). 'Brahmin and Non-Brahmin: Genealogies of the Tamil Political Present.' Permanent Black.",
      "Subramanian, Narendra. (1999). 'Ethnicity and Populist Mobilization: Political Parties, Citizens and Democracy in South India.' Oxford University Press."
    ]
  },
  track4: {
    trackNum: "Track 04",
    tag: "Digital Humanities & Spatial History",
    title: "Digital Epigraphy and Heritage GIS: Geospatial Documentation of Chola-Era Administrative Water Networks in the Palar River Basin",
    researchQuestion: "How can modern Geographic Information Systems (GIS) and open digital epigraphy databases be combined to reconstruct and preserve the spatial geometry of medieval water governance and administrative village networks in northern Tamil Nadu?",
    sourcesConsulted: [
      "Topographical survey maps and inscriptional registers from the Archaeological Survey of India (ASI) Southern Circle.",
      "Tamil Nadu Water Resources Department (WRD) hydrological GIS layers and digital tank inventory.",
      "Bilingual Inscriptional Corpora: Digital Tamil Heritage Foundation archives and Project Madurai epigraphical transcriptions.",
      "High-resolution Copernicus/Sentinel satellite imagery for paleochannel and historical bund detection."
    ],
    methodology: "Georeferencing of inscriptional coordinates to identify historic tanks, sluices (madagu), and channels (vaykkal); building an open-source QGIS spatial database; metadata curation following Dublin Core standards for digital cultural heritage.",
    anticipatedContribution: "Creates an open-access digital heritage blueprint enabling historians, urban planners, and local governing bodies to prevent the encroachment of historically vital water bodies.",
    references: [
      "Gregory, Ian N., & Ell, Paul S. (2007). 'Historical GIS: Technologies, Methodologies, and Scholarship.' Cambridge University Press.",
      "Ludden, David. (1985). 'Peasant History in South India.' Princeton University Press.",
      "Mosse, David. (2003). 'The Rule of Water: Statecraft, Ecology and Collective Action in South India.' Oxford University Press.",
      "Bodenhamer, David J., et al. (2010). 'The Spatial Humanities: GIS and the Future of Humanities Scholarship.' Indiana University Press."
    ]
  }
};

let currentProposalData = null;

function initResearchProposals() {
  const modal = document.getElementById('proposal-modal');
  const modalContent = document.getElementById('modal-content');
  const modalTrackId = document.getElementById('modal-track-id');
  const closeBtn = document.getElementById('modal-close-btn');
  const copyBtn = document.getElementById('modal-copy-btn');
  const printBtn = document.getElementById('modal-print-btn');

  function openProposal(trackId) {
    const data = PROPOSALS_DB[trackId] || PROPOSALS_DB.track1;
    currentProposalData = data;

    if (modalTrackId) modalTrackId.textContent = data.trackNum + ' • ' + data.tag;
    
    let html = `
      <div class="proposal-detail">
        <h3>${data.title}</h3>
        
        <div class="proposal-block">
          <h4><i class="fa-solid fa-circle-question"></i> Research Question &amp; Core Problem</h4>
          <p>${data.researchQuestion}</p>
        </div>

        <div class="proposal-block">
          <h4><i class="fa-solid fa-book-bookmark"></i> Primary &amp; Archival Sources</h4>
          <ul>
            ${data.sourcesConsulted.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>

        <div class="proposal-block">
          <h4><i class="fa-solid fa-microscope"></i> Proposed Methodology</h4>
          <p>${data.methodology}</p>
        </div>

        <div class="proposal-block">
          <h4><i class="fa-solid fa-award"></i> Anticipated Academic Contribution</h4>
          <p>${data.anticipatedContribution}</p>
        </div>

        <div class="proposal-block">
          <h4><i class="fa-solid fa-list-ol"></i> Selected Academic References</h4>
          <ul>
            ${data.references.map(r => `<li><em>${r}</em></li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    if (modalContent) modalContent.innerHTML = html;
    if (modal) modal.classList.add('active');
  }

  document.querySelectorAll('.view-proposal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const trackId = btn.getAttribute('data-track-id');
      openProposal(trackId);
    });
  });

  function closeModal() {
    if (modal) modal.classList.remove('active');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (!currentProposalData) return;
      const text = `
RESEARCH PROPOSAL SYNOPSIS
Track: ${currentProposalData.trackNum} (${currentProposalData.tag})
Title: ${currentProposalData.title}

RESEARCH QUESTION:
${currentProposalData.researchQuestion}

PRIMARY SOURCES:
${currentProposalData.sourcesConsulted.map(s => '- ' + s).join('\n')}

METHODOLOGY:
${currentProposalData.methodology}

SIGNIFICANCE:
${currentProposalData.anticipatedContribution}

REFERENCES:
${currentProposalData.references.map(r => '- ' + r).join('\n')}
Candidate: Manivel N | RGNIYD M.A. Public Administration | All India NCC RDC 2025 (Tamil Nadu) | AICTE YUKTI Finalist | NCC 'C' Cert 'A' Grade
Email: abinamani123@gmail.com | Phone: +91 7868991550
      `.trim();

      navigator.clipboard.writeText(text).then(() => {
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy Synopsis';
        }, 2000);
      });
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

// 11. Count-Up Animation
function initCounterAnimation() {
  const counters = document.querySelectorAll('.count-up');
  let started = false;

  function countUp() {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const step = Math.ceil(target / 40);

      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          counter.textContent = target + '+';
          clearInterval(timer);
        } else {
          counter.textContent = count + '+';
        }
      }, 35);
    });
  }

  window.addEventListener('scroll', () => {
    if (!started && window.scrollY > 50) {
      countUp();
      started = true;
    }
  });
}

// 12. Contact Form to abinamani123@gmail.com
function initContactForm() {
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('sender-name').value;
      const email = document.getElementById('sender-email').value;
      const msg = document.getElementById('sender-msg').value;

      if (formStatus) {
        formStatus.innerHTML = '<span style="color: #10b981; font-weight: 700;"><i class="fa-solid fa-circle-check"></i> Generating email to abinamani123@gmail.com...</span>';
      }

      const subject = encodeURIComponent('Portfolio Collaboration / Research Inquiry from ' + name);
      const body = encodeURIComponent(`Hello Manivel,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${msg}\n\n--- Dispatched via Manivel N Professional Portfolio`);
      
      window.location.href = `mailto:abinamani123@gmail.com?subject=${subject}&body=${body}`;

      setTimeout(() => {
        form.reset();
        if (formStatus) formStatus.innerHTML = '';
      }, 5000);
    });
  }
}
