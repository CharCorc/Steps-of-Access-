window.addEventListener("DOMContentLoaded", () => {
  const textSize = document.getElementById("textSize");

  const welcomeModal = document.getElementById("welcomeModal");
  const storyModal = document.getElementById("storyModal");
  const timelineModal = document.getElementById("timelineModal");

  const startExperienceBtn = document.getElementById("startExperienceBtn");

  const storyTitle = document.getElementById("storyTitle");
  const storyBody = document.getElementById("storyBody");
  const storyProgress = document.getElementById("storyProgress");
  const storyBackBtn = document.getElementById("storyBackBtn");
  const storyNextBtn = document.getElementById("storyNextBtn");
  const skipToTimelineBtn = document.getElementById("skipToTimelineBtn");

  const timelineTitle = document.getElementById("timelineTitle");
  const timelineBody = document.getElementById("timelineBody");
  const timelineProgress = document.getElementById("timelineProgress");
  const timelineBackBtn = document.getElementById("timelineBackBtn");
  const timelineNextBtn = document.getElementById("timelineNextBtn");

  const sceneEl = document.getElementById("scene");

  const storyScreens = [
    {
      title: "Welcome",
      body: "Placeholder text. This screen will introduce the experience and frame Brookings Hall as a meaningful architectural site."
    },
    {
      title: "Architecture and Access",
      body: "Placeholder text. This screen begins shifting the stairs from campus architecture. ~Portal Effect ooooh~"
    },
    {
      title: "Capitol Overlay",
      body: "Placeholder text. This screen explains the overlay of the Capitol steps onto Brookings and introduces the Capitol Crawl."
    }
  ];

  const timelineEvents = [
    {
      label: "1990",
      title: "Timeline Event",
      body: "Placeholder text."
    },
    {
      label: "1990",
      title: "Timeline Event",
      body: "Placeholder text."
    },
     {
      label: "YEAR",
      title: "Timeline Event",
      body: "Placeholder text."
    },
    {
      label: "2008",
      title: "Timeline Event ",
      body: "Placeholder text."
    },
    {
      label: "Today",
      title: "Timeline Event",
      body: "Placeholder text."
    }
  ];

  let storyIndex = 0;
  let timelineIndex = 0;
  let arStarted = false;

  textSize.addEventListener("input", () => {
    document.documentElement.style.setProperty("--text", `${textSize.value}px`);
  });

  function showWelcome() {
    welcomeModal.classList.remove("hidden");
    storyModal.classList.add("hidden");
    timelineModal.classList.add("hidden");
  }

  function showStory(index = 0) {
    storyIndex = Math.max(0, Math.min(index, storyScreens.length - 1));
    welcomeModal.classList.add("hidden");
    storyModal.classList.remove("hidden");
    timelineModal.classList.add("hidden");
    renderStory();
  }

  function showTimeline(index = 0) {
    timelineIndex = Math.max(0, Math.min(index, timelineEvents.length - 1));
    welcomeModal.classList.add("hidden");
    storyModal.classList.add("hidden");
    timelineModal.classList.remove("hidden");
    renderTimeline();
  }

  function renderStory() {
    const screen = storyScreens[storyIndex];
    storyTitle.textContent = screen.title;
    storyBody.textContent = screen.body;
    storyProgress.textContent = `Screen ${storyIndex + 1} of ${storyScreens.length}`;

    storyBackBtn.disabled = storyIndex === 0;
    storyNextBtn.textContent = storyIndex === storyScreens.length - 1 ? "Go to Timeline →" : "Next →";
  }

  function renderTimeline() {
    const ev = timelineEvents[timelineIndex];
    timelineTitle.textContent = `${ev.label} — ${ev.title}`;
    timelineBody.textContent = ev.body;
    timelineProgress.textContent = `Event ${timelineIndex + 1} of ${timelineEvents.length}`;

    timelineBackBtn.disabled = timelineIndex === 0;
    timelineNextBtn.textContent = timelineIndex === timelineEvents.length - 1 ? "Finish" : "Next →";
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

  startExperienceBtn.addEventListener("click", async () => {
    await startARIfPossible();
    showStory(0);
  });

  storyBackBtn.addEventListener("click", () => {
    if (storyIndex > 0) {
      storyIndex -= 1;
      renderStory();
    } else {
      showWelcome();
    }
  });

  storyNextBtn.addEventListener("click", () => {
    if (storyIndex < storyScreens.length - 1) {
      storyIndex += 1;
      renderStory();
    } else {
      showTimeline(0);
    }
  });

  skipToTimelineBtn.addEventListener("click", () => {
    showTimeline(0);
  });

  timelineBackBtn.addEventListener("click", () => {
    if (timelineIndex > 0) {
      timelineIndex -= 1;
      renderTimeline();
    } else {
      showStory(storyScreens.length - 1);
    }
  });

  timelineNextBtn.addEventListener("click", () => {
    if (timelineIndex < timelineEvents.length - 1) {
      timelineIndex += 1;
      renderTimeline();
    } else {
      showWelcome();
    }
  });

  showWelcome();
});