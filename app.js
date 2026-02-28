const bodyText = document.getElementById("bodyText");
const textSize = document.getElementById("textSize");
const startBtn = document.getElementById("startBtn");
const skipBtn = document.getElementById("skipBtn");
const timelineEl = document.getElementById("timeline");

const overlayPlane = document.getElementById("overlayPlane");

// Simple state
let hasStarted = false;

textSize.addEventListener("input", () => {
  document.documentElement.style.setProperty("--text", `${textSize.value}px`);
});

const timelineItems = [
  { year: "1990", title: "Capitol Crawl", text: "Activists crawl up the U.S. Capitol steps, making architectural exclusion visible." },
  { year: "1990", title: "ADA Signed", text: "The Americans with Disabilities Act becomes law (a milestone, not an endpoint)." },
  { year: "2008", title: "ADAAA", text: "ADA Amendments Act expands protections and clarifies coverage." },
  { year: "Today", title: "Access is ongoing", text: "Campus resources and local advocacy connect policy to lived space." },
];

function renderTimeline() {
  timelineEl.classList.remove("hidden");
  timelineEl.innerHTML = `
    <h2 style="margin:0 0 8px; font-size:18px;">Timeline</h2>
    <div style="display:grid; gap:10px;">
      ${timelineItems.map(item => `
        <div style="border:1px solid rgba(255,255,255,0.15); border-radius:14px; padding:10px;">
          <div style="opacity:0.9; font-size:13px;">${item.year}</div>
          <div style="font-weight:700; margin:2px 0 6px;">${item.title}</div>
          <div style="font-size: var(--text); line-height:1.35;">${item.text}</div>
        </div>
      `).join("")}
    </div>
  `;
}

async function fadePlane(toOpacity, ms = 900) {
  const from = parseFloat(overlayPlane.getAttribute("material").opacity || "0");
  const start = performance.now();

  return new Promise((resolve) => {
    function tick(t) {
      const p = Math.min(1, (t - start) / ms);
      const val = from + (toOpacity - from) * p;
      overlayPlane.setAttribute("material", `transparent: true; opacity: ${val.toFixed(3)};`);
      if (p < 1) requestAnimationFrame(tick);
      else resolve();
    }
    requestAnimationFrame(tick);
  });
}

async function runSequence() {
  hasStarted = true;
  bodyText.textContent = "Find the marker. When it locks on, the Capitol steps will overlay Brookings.";

  // Wait a beat, then fade in the overlay
  await new Promise(r => setTimeout(r, 600));
  await fadePlane(1.0, 1200);

  bodyText.textContent = "This overlay anchors the Capitol Crawl to the stairs you’re standing in front of.";

  // Hold, then show timeline
  await new Promise(r => setTimeout(r, 1600));
  renderTimeline();

  // Later you can fade back to Brookings (conceptual “return”)
  // await fadePlane(0.0, 1400);
}

startBtn.addEventListener("click", () => {
  if (!hasStarted) runSequence();
});

skipBtn.addEventListener("click", () => {
  renderTimeline();
  bodyText.textContent = "Timeline opened. You can still view the overlay by pointing at the marker.";
});