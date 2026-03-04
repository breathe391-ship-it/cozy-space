import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// --------------------
// ROOM SETUP
// --------------------

const urlParams = new URLSearchParams(window.location.search);
let roomName = urlParams.get("room");

if (!roomName) {
  roomName = "cozy-" + Math.random().toString(36).substring(2,8);
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

await assignHost();

// --------------------
// JAAAS VIDEO SETUP
// --------------------

const domain = "8x8.vc";

const options = {
  roomName: "vpaas-magic-cookie-015146b38a084d01b3812df4bd5863ec/" + roomName,
  parentNode: document.querySelector('#video-container'),
  width: "100%",
  height: "100%",
  jwt: "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtMDE1MTQ2YjM4YTA4NGQwMWIzODEyZGY0YmQ1ODYzZWMvZTExMDVlLVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3NzI2MzgxMzQsImV4cCI6MTc3MjY0NTMzNCwibmJmIjoxNzcyNjM4MTI5LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtMDE1MTQ2YjM4YTA4NGQwMWIzODEyZGY0YmQ1ODYzZWMiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsImZpbGUtdXBsb2FkIjp0cnVlLCJvdXRib3VuZC1jYWxsIjp0cnVlLCJzaXAtb3V0Ym91bmQtY2FsbCI6ZmFsc2UsInRyYW5zY3JpcHRpb24iOnRydWUsImxpc3QtdmlzaXRvcnMiOmZhbHNlLCJyZWNvcmRpbmciOnRydWUsImZsaXAiOmZhbHNlfSwidXNlciI6eyJoaWRkZW4tZnJvbS1yZWNvcmRlciI6ZmFsc2UsIm1vZGVyYXRvciI6dHJ1ZSwibmFtZSI6ImJyZWF0aGUzOTEiLCJpZCI6Imdvb2dsZS1vYXV0aDJ8MTA4MzA3ODgyNjIyMzIwNjIyNTA0IiwiYXZhdGFyIjoiIiwiZW1haWwiOiJicmVhdGhlMzkxQGdtYWlsLmNvbSJ9fSwicm9vbSI6IioifQ.c0pZXxAD8jg7NfiAjK3HLY9UkMCobAKbvprnf1qkX3WteA07We-3D80aubXq_eXcCyUCn-lIB0JFNrG6ym2TKRxfkbekyExuycpcDS5Z04eAo4sfXhlKgMkP1Hy6j6MFWVqUU2HruYZQ6HzKmEms5OW9D_4iskHhIY_nJh47yFWVrilrZh4yPX6JvNStZTu4vmQ6CG0mRER8xPnEOVFJj4N-I6q8e3KoxO5qzmnE38A-ynjRiytGH_9CpzfOvXkSfoXatbAmhKumGnB-2YUDG2nfOLS9h1Z2cs46EtJzeam6X84v9pRNmjdlpUKcktLuvQy68xzsKkZ5mhLEsKCQCA"
};

const api = new JitsiMeetExternalAPI(domain, options);

// --------------------
// MUSIC DRAWER TOGGLE
// --------------------

const drawer = document.getElementById("music-drawer");
const toggleBtn = document.getElementById("music-toggle");

toggleBtn.onclick = () => {
  drawer.classList.toggle("open");
};

// --------------------
// LOCAL QUEUE SYSTEM (TEMPORARY - WILL SYNC LATER)
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

window.onYouTubeIframeAPIReady = function() {
  player = new YT.Player('player', {
    height: '200',
    width: '100%',
    videoId: '',
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
