chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    stopwatchTime: 0,
    countdownTime: 0,
    isStopwatchRunning: false,
    isCountdownRunning: false,
    countdownEndTime: 0,
  });
});

chrome.alarms.create("timer", { periodInMinutes: 1 / 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "timer") {
    chrome.storage.local.get(
      [
        "stopwatchTime",
        "isStopwatchRunning",
        "isCountdownRunning",
        "countdownEndTime",
      ],
      (res) => {
        if (res.isStopwatchRunning) {
          let newTime = res.stopwatchTime + 1;
          chrome.storage.local.set({ stopwatchTime: newTime });
        }
        if (res.isCountdownRunning) {
          const remaining = res.countdownEndTime - Date.now();
          if (remaining > 0) {
            chrome.storage.local.set({
              countdownTime: Math.ceil(remaining / 1000),
            });
          } else {
            chrome.storage.local.set({
              isCountdownRunning: false,
              countdownTime: 0,
            });
          }
        }
      },
    );
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "start-stopwatch") {
    chrome.storage.local.set({
      isStopwatchRunning: true,
      isCountdownRunning: false,
    });
  } else if (request.command === "stop-stopwatch") {
    chrome.storage.local.set({ isStopwatchRunning: false });
  } else if (request.command === "reset-stopwatch") {
    chrome.storage.local.set({ isStopwatchRunning: false, stopwatchTime: 0 });
  } else if (request.command === "start-countdown") {
    const endTime = Date.now() + request.time * 1000;
    chrome.storage.local.set({
      isCountdownRunning: true,
      isStopwatchRunning: false,
      countdownTime: request.time,
      countdownEndTime: endTime,
    });
  } else if (request.command === "stop-countdown") {
    chrome.storage.local.set({ isCountdownRunning: false });
  } else if (request.command === "reset-countdown") {
    chrome.storage.local.set({ isCountdownRunning: false, countdownTime: 0 });
  }
});
