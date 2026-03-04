// --------------------
// 1️⃣ JITSI
// --------------------
// --------------------
// JaaS Setup
// --------------------

const urlParams = new URLSearchParams(window.location.search);
let roomName = urlParams.get("room");

if (!roomName) {
  roomName = "cozy-" + Math.random().toString(36).substring(2,8);
  window.location.search = "?room=" + roomName;
}

const domain = "8x8.vc";

const options = {
  roomName: "vpaas-magic-cookie-015146b38a084d01b3812df4bd5863ec/" + roomName,
  parentNode: document.querySelector('#video-container'),
  width: "100%",
  height: "100%",
};

const api = new JitsiMeetExternalAPI(domain, options);
// --------------------
// 2️⃣ MUSIC DRAWER TOGGLE
// --------------------

const drawer = document.getElementById("music-drawer");
const toggleBtn = document.getElementById("music-toggle");

toggleBtn.onclick = () => {
  drawer.classList.toggle("open");
};

// --------------------
// 3️⃣ LOCAL QUEUE SYSTEM (TEMPORARY)
// --------------------

let queue = [];
let player;

function extractVideoID(url) {
  const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
  return match ? match[1] : null;
}

document.getElementById("add-song").onclick = () => {
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
    li.onclick = () => playVideo(id);
    list.appendChild(li);
  });
}

// --------------------
// 4️⃣ YOUTUBE PLAYER
// --------------------

window.onYouTubeIframeAPIReady = function() {
  player = new YT.Player('player', {
    height: '200',
    width: '100%',
    videoId: '',
  });
};

function playVideo(id) {
  player.loadVideoById(id);
}

// --------------------
// 5️⃣ LOCAL COUNTERS
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
