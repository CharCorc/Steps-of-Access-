/* =============================================================
   Steps of Access — app.js
   Images:  images/capitol.png, images/one.png … images/seven.png
   Audio:   audio/clip1.*, audio/clip2.*, audio/clip3.*
   Targets: targets/Brookings.mind
   ============================================================= */

'use strict';

// ─── STATE ───────────────────────────────────────────────────
const state = {
  currentPage: 'page-welcome',
  arSlide: 0,
  subtitlesOn: false,
  ttsActive: false,
  ttsUtterance: null,
  textSize: 'normal',
  audioPlaying: false
};

// ─── AR SLIDES ───────────────────────────────────────────────
// 7 images + capitol = 8 assets; 7 narrative slides cycling
// audio clips: clip1 after slide 0→1, clip2 after slide 2→3, clip3 after slide 4→5
const AR_SLIDES = [
  {
    eyebrow: 'Brookings Steps · Present Day',
    text:    'You are standing in front of Brookings Hall at Washington University. Watch as the Capitol steps are overlaid onto this space, connecting a national moment of protest to a campus you walk past every day.',
    image:   'images/capitol.png',
    subtitle: 'The steps of the U.S. Capitol are being overlaid onto Brookings Hall.'
  },
  {
    eyebrow: 'Capitol Crawl · March 12, 1990',
    text:    'Over a thousand disability rights activists gathered on the west lawn of the U.S. Capitol. At the base of these 83 steps, dozens left their wheelchairs and crawled upward on their hands and knees.',
    image:   'images/one.png',
    subtitle: 'Activists gather at the base of the Capitol steps, March 12, 1990.',
    audioAfter: 'audio/clip1'   // play clip1 before showing this slide
  },
  {
    eyebrow: 'Jennifer Keelan Leads the Way',
    text:    'Jennifer Keelan, eight years old and living with cerebral palsy, pulled herself up the marble steps. "I\'ll take all night if I have to," she said. Her image became the defining photograph of the protest.',
    image:   'images/two.png',
    subtitle: 'Jennifer Keelan, age eight, crawls up the Capitol steps.'
  },
  {
    eyebrow: 'Architecture as Exclusion',
    text:    'Every step was a physical argument. The protesters were exposing how public buildings — the spaces of democracy — had been designed without them in mind. Architecture determines who belongs.',
    image:   'images/three.png',
    subtitle: 'Protesters climb the stairs. The Capitol dome rises above them.',
    audioAfter: 'audio/clip2'
  },
  {
    eyebrow: 'The Movement Behind the Crawl',
    text:    'The Capitol Crawl did not happen in isolation. It was the product of decades of organizing — protests, sit-ins, and legal fights — by disabled activists across the United States who refused to be excluded from civic life.',
    image:   'images/four.png',
    subtitle: 'Archival image: disability rights activists at an earlier protest.'
  },
  {
    eyebrow: 'A Civil Rights Story',
    text:    'The protest received significant media coverage, but it is rarely taught alongside other civil rights milestones. Scholars argue that the disability rights movement has been systematically underrepresented in how we remember twentieth-century activism.',
    image:   'images/five.png',
    subtitle: 'News cameras capture the protest on the Capitol steps.',
    audioAfter: 'audio/clip3'
  },
  {
    eyebrow: 'ADA Signed · July 26, 1990',
    text:    'Four months after the Capitol Crawl, President George H.W. Bush signed the Americans with Disabilities Act into law — the most comprehensive disability rights legislation in U.S. history. The steps had worked.',
    image:   'images/six.png',
    subtitle: 'The ADA signing ceremony. Disability rights advocates stand nearby.'
  },
  {
    eyebrow: 'Returning to Brookings',
    text:    'The Capitol overlay fades. You are back in front of Brookings Hall. The steps here are part of the same conversation — what does it mean for a public space to be truly accessible? That question is still being answered.',
    image:   'images/seven.png',
    subtitle: 'The overlay fades. Brookings Hall steps return to view.'
  }
];

// ─── TIMELINE DATA ────────────────────────────────────────────
const TIMELINE = [
  {
    year: '1990',
    tag:  'Legislation',
    title: 'Americans with Disabilities Act Signed',
    body:  'On July 26, 1990, President George H.W. Bush signed the ADA into law on the South Lawn of the White House, surrounded by disability rights advocates. The law banned discrimination in employment, public accommodations, transportation, and government services — the largest civil rights legislation since the Civil Rights Act of 1964.',
    gold:  true
  },
  {
    year: '1998',
    tag:  'Digital Access',
    title: 'Section 508 Amendments',
    body:  'Congress amended Section 508 of the Rehabilitation Act to require federal agencies to make their electronic and information technology accessible to people with disabilities. This extended civil rights principles into the digital sphere and set a precedent for web accessibility standards that shape online design today.',
    gold:  false
  },
  {
    year: '2008',
    tag:  'ADA Update',
    title: 'ADA Amendments Act (ADAAA)',
    body:  'A series of Supreme Court rulings had narrowed the ADA\'s definition of disability, limiting who could seek its protections. Congress responded with the ADAAA, broadening the definition significantly and clarifying that the law should be construed in favor of wide coverage — restoring the ADA\'s original scope.',
    gold:  false
  },
  {
    year: '2010',
    tag:  'Physical Access',
    title: 'ADA Standards for Accessible Design Updated',
    body:  'The Department of Justice issued comprehensive updates to ADA accessibility standards — the first major revision in nearly twenty years. New requirements addressed recreational facilities, pools, and detailed specifications for built environments, reflecting two decades of lived experience under the original law.',
    gold:  false
  },
  {
    year: 'Ongoing',
    tag:  'Present Day',
    title: 'The Work Continues',
    body:  'From web accessibility litigation to fights over Medicaid funding, from campus accessibility advocacy to transportation equity, the disability rights movement remains active. The ADA was infrastructure, not an endpoint. How that infrastructure is maintained, expanded, and enforced is an ongoing civic question — one that the steps you are standing in front of are part of.',
    gold:  true
  }
];

// ─── AUDIO ───────────────────────────────────────────────────
// Attempts common extensions in order. File the user provides (clip1, clip2, clip3)
// may be .mp3, .ogg, .wav — we try each.
const AUDIO_EXTENSIONS = ['.mp3', '.ogg', '.wav', '.m4a'];

function createAudio(basePath) {
  const audio = new Audio();
  audio.preload = 'auto';

  let extIndex = 0;
  function tryNext() {
    if (extIndex >= AUDIO_EXTENSIONS.length) return;
    audio.src = basePath + AUDIO_EXTENSIONS[extIndex++];
  }
  audio.addEventListener('error', tryNext);
  tryNext();
  return audio;
}

const audioClips = {
  'audio/clip1': createAudio('audio/clip1'),
  'audio/clip2': createAudio('audio/clip2'),
  'audio/clip3': createAudio('audio/clip3')
};

function playAudioClip(basePath, onEnded) {
  const clip = audioClips[basePath];
  if (!clip) { if (onEnded) onEnded(); return; }

  clip.currentTime = 0;
  const indicator = document.getElementById('audio-indicator');

  clip.onended = () => {
    state.audioPlaying = false;
    if (indicator) indicator.classList.remove('playing');
    if (onEnded) onEnded();
  };
  clip.onerror = () => {
    state.audioPlaying = false;
    if (indicator) indicator.classList.remove('playing');
    if (onEnded) onEnded();
  };

  clip.play().then(() => {
    state.audioPlaying = true;
    if (indicator) indicator.classList.add('playing');
  }).catch(() => {
    // autoplay blocked or file missing — proceed silently
    if (onEnded) onEnded();
  });
}

function stopAllAudio() {
  Object.values(audioClips).forEach(c => { c.pause(); c.currentTime = 0; });
  state.audioPlaying = false;
  const indicator = document.getElementById('audio-indicator');
  if (indicator) indicator.classList.remove('playing');
}

// ─── PAGE NAVIGATION ─────────────────────────────────────────
function goToPage(id) {
  stopTTS();
  stopAllAudio();
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(id);
  if (!target) return;
  target.classList.add('active');
  state.currentPage = id;

  if (id === 'page-timeline') revealTimeline();
}

function startPortal() {
  const portal = document.getElementById('portal');
  portal.classList.add('active');
  setTimeout(() => {
    portal.classList.remove('active');
    goToPage('page-ar');
    state.arSlide = 0;
    renderARSlide(false);
  }, 2400);
}

function restartExperience() {
  state.arSlide = 0;
  goToPage('page-welcome');
  const modal = document.getElementById('welcome-modal');
  if (modal) modal.style.display = 'flex';
}

// ─── AR ──────────────────────────────────────────────────────
function buildARDots() {
  const container = document.getElementById('ar-progress');
  if (!container) return;
  container.innerHTML = '';
  AR_SLIDES.forEach((_, i) => {
    const pip = document.createElement('div');
    pip.className = 'ar-pip';
    container.appendChild(pip);
  });
}

function renderARSlide(withAudio) {
  const slide = AR_SLIDES[state.arSlide];
  if (!slide) return;

  // text
  const eyebrow = document.getElementById('ar-eyebrow');
  const textEl   = document.getElementById('ar-narrative-text');
  if (eyebrow) eyebrow.textContent = slide.eyebrow;
  if (textEl)  {
    // re-trigger animation
    textEl.style.animation = 'none';
    void textEl.offsetWidth;
    textEl.style.animation = '';
    textEl.textContent = slide.text;
  }

  // image overlay
  const img = document.getElementById('ar-overlay-img');
  const placeholder = document.getElementById('ar-overlay-placeholder');
  if (img) {
    img.classList.remove('visible');
    const newSrc = slide.image;
    img.onload = () => img.classList.add('visible');
    img.onerror = () => {
      img.classList.remove('visible');
      if (placeholder) placeholder.classList.remove('hidden');
    };
    img.src = newSrc;
    if (img.complete && img.naturalWidth) {
      img.classList.add('visible');
      if (placeholder) placeholder.classList.add('hidden');
    } else {
      if (placeholder) placeholder.classList.remove('hidden');
    }
  }
  const placeholderLabel = document.getElementById('ar-placeholder-file');
  if (placeholderLabel) placeholderLabel.textContent = slide.image;

  // subtitles
  const caption = document.getElementById('ar-subtitle');
  if (caption) {
    caption.textContent = slide.subtitle || '';
    caption.classList.toggle('visible', state.subtitlesOn);
  }

  // progress pips
  const pips = document.querySelectorAll('.ar-pip');
  pips.forEach((pip, i) => {
    pip.classList.remove('done', 'active');
    if (i < state.arSlide)  pip.classList.add('done');
    if (i === state.arSlide) pip.classList.add('active');
  });

  // back/next buttons
  const backBtn = document.getElementById('ar-back');
  const nextBtn = document.getElementById('ar-next');
  if (backBtn) {
    backBtn.disabled = state.arSlide === 0;
  }
  if (nextBtn) {
    const isLast = state.arSlide === AR_SLIDES.length - 1;
    nextBtn.textContent = isLast ? 'Continue →' : 'Next →';
    nextBtn.onclick = isLast ? () => goToPage('page-timeline') : () => arNav(1);
    nextBtn.classList.toggle('forward', true);
  }

  // camera hint fade once AR starts
  const hint = document.getElementById('camera-hint');
  if (hint && state.arSlide > 0) hint.classList.add('hidden');
}

function arNav(dir) {
  const targetSlide = state.arSlide + dir;
  if (targetSlide < 0 || targetSlide >= AR_SLIDES.length) return;

  // Check if the slide we're moving TO had audio queued
  const destinationSlide = AR_SLIDES[targetSlide];
  const prevSlide = AR_SLIDES[state.arSlide];
  const audioKey = (dir > 0 && prevSlide.audioAfter) ? prevSlide.audioAfter : null;

  state.arSlide = targetSlide;

  if (dir > 0 && audioKey) {
    // play audio clip, then render slide
    playAudioClip(audioKey, () => renderARSlide(false));
  } else {
    renderARSlide(false);
  }
}

function toggleSubtitles() {
  state.subtitlesOn = !state.subtitlesOn;
  const btn     = document.getElementById('subtitles-btn');
  const caption = document.getElementById('ar-subtitle');
  if (btn)     btn.classList.toggle('on', state.subtitlesOn);
  if (caption) {
    caption.classList.toggle('visible', state.subtitlesOn);
    if (state.subtitlesOn) {
      caption.textContent = AR_SLIDES[state.arSlide]?.subtitle || '';
    }
  }
}

// ─── TIMELINE ─────────────────────────────────────────────────
function buildTimeline() {
  const track = document.getElementById('timeline-track');
  if (!track) return;
  track.innerHTML = '';
  TIMELINE.forEach((item) => {
    const entry = document.createElement('div');
    entry.className = 'tl-entry';
    entry.innerHTML = `
      <div class="tl-dot${item.gold ? ' gold' : ''}"></div>
      <span class="tl-year">${item.year}</span>
      <span class="tl-tag">${item.tag}</span>
      <h3 class="tl-title">${item.title}</h3>
      <p class="tl-body scalable">${item.body}</p>
    `;
    track.appendChild(entry);
  });
}

function revealTimeline() {
  const entries = document.querySelectorAll('.tl-entry');
  entries.forEach((el, i) => {
    el.classList.remove('in');
    setTimeout(() => el.classList.add('in'), 100 + 130 * i);
  });
}

// ─── RESOURCE TABS ────────────────────────────────────────────
function switchTab(panelId, clickedBtn) {
  document.querySelectorAll('.res-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.res-tab').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  const panel = document.getElementById('tab-' + panelId);
  if (panel) panel.classList.add('active');
  clickedBtn.classList.add('active');
  clickedBtn.setAttribute('aria-selected', 'true');
}

// ─── TEXT SIZE ────────────────────────────────────────────────
function setTextSize(size) {
  document.body.classList.remove('text-lg', 'text-xl');
  if (size !== 'normal') document.body.classList.add('text-' + size);
  state.textSize = size;
  document.querySelectorAll('.ts-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.size === size);
  });
}

// ─── TTS ─────────────────────────────────────────────────────
function getPageText() {
  const map = {
    'page-welcome':    () => document.getElementById('welcome-text')?.innerText ?? '',
    'page-background': () => document.getElementById('background-text')?.innerText ?? '',
    'page-ar':         () => {
      const slide = AR_SLIDES[state.arSlide];
      return slide ? slide.eyebrow + '. ' + slide.text : '';
    },
    'page-timeline':   () => Array.from(document.querySelectorAll('.tl-title, .tl-body'))
                              .map(el => el.innerText).join('. '),
    'page-ending':     () => document.querySelector('#page-ending .ending-sub')?.innerText ?? '',
    'page-resources':  () => Array.from(document.querySelectorAll('.res-panel.active .res-title, .res-panel.active .res-desc'))
                              .map(el => el.innerText).join('. ')
  };
  return (map[state.currentPage] ?? (() => ''))();
}

function toggleTTS() {
  state.ttsActive ? stopTTS() : startTTS(getPageText());
}

function startTTS(text) {
  if (!('speechSynthesis' in window)) {
    alert('Text-to-speech is not supported in this browser.');
    return;
  }
  stopTTS();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.9;
  utt.onend  = () => setTTSState(false);
  utt.onerror = () => setTTSState(false);
  state.ttsUtterance = utt;
  speechSynthesis.speak(utt);
  setTTSState(true);
}

function stopTTS() {
  speechSynthesis.cancel();
  state.ttsUtterance = null;
  setTTSState(false);
}

function setTTSState(on) {
  state.ttsActive = on;
  const corner = document.getElementById('tts-corner');
  const barBtn  = document.getElementById('tts-bar-btn');
  if (corner) {
    corner.classList.toggle('speaking', on);
    corner.textContent = on ? '⏹ Stop' : '🔊 Read';
  }
  if (barBtn) {
    barBtn.classList.toggle('active', on);
    barBtn.textContent = on ? 'Stop' : 'Read Aloud';
  }
}

// ─── KEYBOARD ────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (state.currentPage === 'page-ar') {
    if (e.key === 'ArrowRight') arNav(1);
    if (e.key === 'ArrowLeft')  arNav(-1);
  }
});

// ─── INIT ────────────────────────────────────────────────────
function init() {
  buildARDots();
  buildTimeline();
  renderARSlide(false);

  // Wire text-size buttons via data attributes
  document.querySelectorAll('.ts-btn').forEach(btn => {
    btn.addEventListener('click', () => setTextSize(btn.dataset.size));
  });
}

document.addEventListener('DOMContentLoaded', init);
