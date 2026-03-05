import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// --------------------
// ROOM SETUP
// --------------------

const urlParams = new URLSearchParams(window.location.search);
let roomName = urlParams.get("room");

if (!roomName) {
  roomName = "cozy-" + Math.random().toString(36).substring(2, 8);
  window.location.search = "?room=" + roomName;
}

// --------------------
// HOST ASSIGNMENT (FIREBASE)
// --------------------

const roomRef = doc(window.db, "rooms", roomName);
let isHost = false;

async function assignHost() {
  const snap = await getDoc(roomRef);

  if (!snap.exists()) {
    await setDoc(roomRef, {
      hostCreatedAt: Date.now(),
      hugs: 0,
      kisses: 0
    });
    isHost = true;
    console.log("You are the host");
  } else {
    isHost = false;
    console.log("You are a participant");
  }
}

// --------------------
// JITSI SETUP WITH PASSWORD
// --------------------

function startJitsi() {
  const jitsiRoomName = roomName + "-" + Math.floor(Math.random() * 1000);

  const options = {
    roomName: jitsiRoomName,
    parentNode: document.querySelector('#video-container'),
    width: "100%",
    height: "100%",
    configOverwrite: {
      enableWelcomePage: false
    },
    interfaceConfigOverwrite: {
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false
    }
  };

  // Use the public Jitsi server to avoid login
  const api = new JitsiMeetExternalAPI("meet.jit.si", options);

  // Set automatic password
  const roomPassword = "navrabaiko";

  api.addEventListener('videoConferenceJoined', () => {
    if (isHost) {
      api.executeCommand('password', roomPassword);
      console.log("Room password set:", roomPassword);
    }
  });

  api.addEventListener('passwordRequired', () => {
    api.executeCommand('password', roomPassword);
  });
}

// --------------------
// INITIALIZE APP
// --------------------

async function init() {
  await assignHost();
  startJitsi();
}

init();

// --------------------
// MUSIC DRAWER TOGGLE
// --------------------

const drawer = document.getElementById("music-drawer");
const toggleBtn = document.getElementById("music-toggle");

toggleBtn.onclick = () => {
  drawer.classList.toggle("open");
};

// --------------------
// LOCAL QUEUE SYSTEM
// --------------------

let queue = [];
let player;

function extractVideoID(url) {
  const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
  return match ? match[1] : null;
}

document.getElementById("add-song").onclick = () => {
  if (!isHost) {
    alert("Only host can control music");
    return;
  }

  const input = document.getElementById("youtube-link");
  const videoId = extractVideoID(input.value);
  if (!videoId) return alert("Invalid link");

  queue.push(videoId);
  renderQueue();
  input.value = "";
};

function renderQueue() {
  const list = document.getElementById("queue-list");
  list.innerHTML = "";

  queue.forEach((id, index) => {
    const li = document.createElement("li");
    li.textContent = "Video " + (index + 1);

    if (isHost) {
      li.onclick = () => playVideo(id);
    }

    list.appendChild(li);
  });
}

// --------------------
// YOUTUBE PLAYER
// --------------------

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player("player", {
    height: "200",
    width: "100%",
    videoId: ""
  });
};

function playVideo(id) {
  if (!isHost) return;
  player.loadVideoById(id);
}

// --------------------
// COUNTERS (LOCAL FOR NOW)
// --------------------

let hugs = 0;
let kisses = 0;

document.getElementById("hug-btn").onclick = () => {
  hugs++;
  document.getElementById("hug-count").textContent = hugs;
};

document.getElementById("kiss-btn").onclick = () => {
  kisses++;
  document.getElementById("kiss-count").textContent = kisses;
};
