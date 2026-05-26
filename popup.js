const timerDisplay = document.querySelector(".timer-display");
const timerControls = document.getElementById("timer-controls");
const countdownControls = document.getElementById("countdown-controls");
const showTimerBtn = document.getElementById("show-timer");
const showCountdownBtn = document.getElementById("show-countdown");
const countdownNotice = document.getElementById("countdown-notice");

let currentView = "countdown";

function formatTime(time) {
  const isNegative = time < 0;
  const absTime = Math.abs(time);
  const hours = Math.floor(absTime / 3600);
  const minutes = Math.floor((absTime % 3600) / 60);
  const seconds = absTime % 60;
  const formatted = [hours, minutes, seconds]
    .map((v) => (v < 10 ? "0" + v : v))
    .join(":");
  return isNegative ? "-" + formatted : formatted;
}

function updateDisplay() {
  chrome.storage.local.get(
    [
      "stopwatchTime",
      "countdownTime",
      "isStopwatchRunning",
      "isCountdownRunning",
      "countdownCompleted",
    ],
    (res) => {
      if (currentView === "timer") {
        timerDisplay.textContent = formatTime(res.stopwatchTime);
        timerDisplay.classList.remove("blinking");
        countdownNotice.classList.add("hidden");
      } else {
        timerDisplay.textContent = formatTime(res.countdownTime);
        timerDisplay.classList.toggle("blinking", res.countdownCompleted);
        countdownNotice.classList.toggle("hidden", !res.countdownCompleted);
      }
    },
  );
}

function showTimer() {
  currentView = "timer";
  timerControls.classList.remove("hidden");
  countdownControls.classList.add("hidden");
  showTimerBtn.classList.add("active");
  showCountdownBtn.classList.remove("active");
  updateDisplay();
}

function showCountdown() {
  currentView = "countdown";
  timerControls.classList.add("hidden");
  countdownControls.classList.remove("hidden");
  showTimerBtn.classList.remove("active");
  showCountdownBtn.classList.add("active");
  updateDisplay();
}

showTimerBtn.addEventListener("click", showTimer);
showCountdownBtn.addEventListener("click", showCountdown);

document.getElementById("start-stopwatch").addEventListener("click", () => {
  chrome.runtime.sendMessage({ command: "start-stopwatch" });
});

document.getElementById("stop-stopwatch").addEventListener("click", () => {
  chrome.runtime.sendMessage({ command: "stop-stopwatch" });
});

document.getElementById("reset-stopwatch").addEventListener("click", () => {
  chrome.runtime.sendMessage({ command: "reset-stopwatch" });
});

document.querySelectorAll(".countdown-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const time = parseInt(button.dataset.time);
    chrome.runtime.sendMessage({ command: "start-countdown", time: time });
  });
});

document.getElementById("resume-countdown").addEventListener("click", () => {
  chrome.runtime.sendMessage({ command: "resume-countdown" });
});

document.getElementById("stop-countdown").addEventListener("click", () => {
  chrome.runtime.sendMessage({ command: "stop-countdown" });
});

document.getElementById("reset-countdown").addEventListener("click", () => {
  chrome.runtime.sendMessage({ command: "reset-countdown" });
});

setInterval(updateDisplay, 100);
updateDisplay();
showCountdown();
