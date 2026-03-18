window.addEventListener("DOMContentLoaded", () => {
  const textSize = document.getElementById("textSize");

  const welcomeModal = document.getElementById("welcomeModal");
  const introModal = document.getElementById("introModal");
  const arControls = document.getElementById("arControls");
  const timelineModal = document.getElementById("timelineModal");
  const resourcesPage = document.getElementById("resourcesPage");

  const welcomeNextBtn = document.getElementById("welcomeNextBtn");
  const introBackBtn = document.getElementById("introBackBtn");
  const introStartBtn = document.getElementById("introStartBtn");
  const skipToTimelineBtn = document.getElementById("skipToTimelineBtn");

  const timelineTitle = document.getElementById("timelineTitle");
  const timelineBody = document.getElementById("timelineBody");
  const timelineProgress = document.getElementById("timelineProgress");
  const timelineBackBtn = document.getElementById("timelineBackBtn");
  const timelineNextBtn = document.getElementById("timelineNextBtn");

  const resourcesBackBtn = document.getElementById("resourcesBackBtn");
  const resourcesRestartBtn = document.getElementById("resourcesRestartBtn");

  const sceneEl = document.getElementById("scene");

  const timelineEvents = [
    {
      label: "1990",
      title: "Timeline Event 1",
      body: "Placeholder text."
    },
    {
      label: "DATE",
      title: "Timeline Event 2",
      body: "Placeholder text."
    },
    {
      label: "DATE",
      title: "Timeline Event 3",
      body: "Placeholder text."
    },
    {
      label: "Today",
      title: "Timeline Event 4",
      body: "Placeholder text."
    }
  ];

  let timelineIndex = 0;
  let arStarted = false;

  textSize.addEventListener("input", () => {
    document.documentElement.style.setProperty("--text", `${textSize.value}px`);
  });

  function hideAllOverlays() {
    welcomeModal.classList.add("hidden");
    introModal.classList.add("hidden");
    arControls.classList.add("hidden");
    timelineModal.classList.add("hidden");
    resourcesPage.classList.add("hidden");
  }

  function showWelcome() {
    hideAllOverlays();
    welcomeModal.classList.remove("hidden");
  }

  function showIntro() {
    hideAllOverlays();
    introModal.classList.remove("hidden");
  }

  function showARView() {
    hideAllOverlays();
    arControls.classList.remove("hidden");
  }

  function showTimeline(index = 0) {
    timelineIndex = Math.max(0, Math.min(index, timelineEvents.length - 1));
    hideAllOverlays();
    timelineModal.classList.remove("hidden");
    renderTimeline();
  }

  function showResources() {
    hideAllOverlays();
    resourcesPage.classList.remove("hidden");
  }

  function renderTimeline() {
    const ev = timelineEvents[timelineIndex];
    timelineTitle.textContent = `${ev.label} — ${ev.title}`;
    timelineBody.textContent = ev.body;
    timelineProgress.textContent = `Event ${timelineIndex + 1} of ${timelineEvents.length}`;

    timelineBackBtn.disabled = timelineIndex === 0;
    timelineNextBtn.textContent = timelineIndex === timelineEvents.length - 1 ? "Go to Resources →" : "Next →";
  }

  async function startARIfPossible() {
    if (arStarted) return;
    try {
      const mindar = sceneEl.systems["mindar-image-system"];
      if (mindar) {
        await mindar.start();
        arStarted = true;
      }
    } catch (err) {
      console.error("AR start failed:", err);
    }
  }

  welcomeNextBtn.addEventListener("click", () => {
    showIntro();
  });

  introBackBtn.addEventListener("click", () => {
    showWelcome();
  });

  introStartBtn.addEventListener("click", async () => {
    await startARIfPossible();
    showARView();
  });

  skipToTimelineBtn.addEventListener("click", () => {
    showTimeline(0);
  });

  timelineBackBtn.addEventListener("click", () => {
    if (timelineIndex > 0) {
      timelineIndex -= 1;
      renderTimeline();
    } else {
      showARView();
    }
  });

  timelineNextBtn.addEventListener("click", () => {
    if (timelineIndex < timelineEvents.length - 1) {
      timelineIndex += 1;
      renderTimeline();
    } else {
      showResources();
    }
  });

  resourcesBackBtn.addEventListener("click", () => {
    showTimeline(timelineEvents.length - 1);
  });

  resourcesRestartBtn.addEventListener("click", () => {
    showWelcome();
  });

  showWelcome();
});