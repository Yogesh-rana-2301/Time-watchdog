const timerDisplay = document.querySelector(".timer-display");

function formatTime(time) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  return [hours, minutes, seconds].map((v) => (v < 10 ? "0" + v : v)).join(":");
}

function updateDisplay() {
  chrome.storage.local.get(
    [
      "stopwatchTime",
      "countdownTime",
      "isStopwatchRunning",
      "isCountdownRunning",
    ],
    (res) => {
      if (res.isStopwatchRunning) {
        timerDisplay.textContent = formatTime(res.stopwatchTime);
      } else {
        timerDisplay.textContent = formatTime(res.countdownTime);
      }
    },
  );
}

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

document.getElementById("stop-countdown").addEventListener("click", () => {
  chrome.runtime.sendMessage({ command: "stop-countdown" });
});

document.getElementById("reset-countdown").addEventListener("click", () => {
  chrome.runtime.sendMessage({ command: "reset-countdown" });
});

setInterval(updateDisplay, 100);
updateDisplay();
