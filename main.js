// =======================================================
//  PLAYLIST — gli mp3 stanno nella cartella "song"
//  title = cosa si vede a schermo, file = nome esatto del file
// =======================================================
const playlist = [
  { title: "All I Want For Christmas Is You", file: "Mariah Carey - All I Want For Christmas Is You.mp3" },
  { title: "Last Christmas",                         file: "Wham! - Last Christmas.mp3" },
  { title: "Jingle Bell Rock",                 file: "Bobby Helms - Jingle Bell Rock.mp3" },
  { title: "It's Beginning To Look A Lot Like Christmas", file: "Michael Bublé - Its Beginning To Look A Lot Like Christmas.mp3" },
  { title: "It's The Most Wonderful Time Of The Year",    file: "Andy Williams - Its The Most Wonderful Time Of The Year.mp3" },
  { title: "Feliz Navidad",                 file: "José Feliciano - Feliz Navidad.mp3" },
  { title: "Rockin' Around the Christmas Tree",              file: "Rockin Around the Christmas Tree.mp3" },
  { title: "Let It Snow",                      file: "Dean Martin - Let It Snow.mp3" },
  { title: "Holly Jolly Christmas",          file: "Michael Bublé - Holly Jolly Christmas.mp3" },
  { title: "Underneath the Tree",           file: "Kelly Clarkson - Underneath the Tree.mp3" },
  { title: "Sleigh Ride",                     file: "The Ronettes - Sleigh Ride.mp3" },
  { title: "Santa Claus Is Coming To Town",  file: "Michael Bublé - Santa Claus Is Coming To Town.mp3" },
  { title: "Snowman",                                  file: "Sia - Snowman.mp3" },
  { title: "Winter Wonderland",              file: "Michael Bublé - Winter Wonderland.mp3" },
  { title: "Jingle Bells",                                   file: "Jingle Bells Original Song.mp3" },
  { title: "Deck the Halls",                                 file: "Deck the Halls.mp3" },
  { title: "Hark The Herald Angels Sing",                    file: "Hark The Herald Angels Sing.mp3" },
  { title: "We Wish You a Merry Christmas",                  file: "We Wish You a Merry Christmas.mp3" },
  { title: "Carol of the Bells (Home Alone)", file: "Carol of the Bells - John Williams.mp3" },
  { title: "Carol of the Bells",          file: "Lindsey Stirling - Carol of the Bells.mp3" },
  { title: "Somewhere In My Memory",         file: "John williams - Somewhere In My Memory.mp3" },
  { title: "What's This? (The Nightmare Before Christmas)",  file: "Whats This.mp3" },
];

const SONG_FOLDER = "song/";

// ---------- Elementi ----------
const audio       = document.getElementById("audio");
const disc        = document.getElementById("disc");
const tonearm     = document.getElementById("tonearm");
const trackTitle  = document.getElementById("track-title");
const trackCount  = document.getElementById("track-count");
const progressBar = document.getElementById("progress-bar");
const progressFill= document.getElementById("progress-fill");
const currentTime = document.getElementById("current-time");
const duration    = document.getElementById("duration");
const merry       = document.getElementById("merry");

const btnPlay  = document.getElementById("btn-play");
const btnPause = document.getElementById("btn-pause");
const btnStop  = document.getElementById("btn-stop");
const btnNext  = document.getElementById("btn-next");
const btnPrev  = document.getElementById("btn-prev");
const btnMerry = document.getElementById("btn-merry");

// ---------- Ordine casuale ----------
// "order" contiene le posizioni delle canzoni mescolate (es. [7, 2, 15, ...])
// "pos" indica a che punto siamo del giro
let order = [];
let pos = 0;

// mescola le canzoni (algoritmo di Fisher-Yates): ogni canzone compare una sola volta
function shuffle() {
  const last = order[order.length - 1]; // ultima canzone del giro precedente
  order = playlist.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  // evita che il nuovo giro inizi con la stessa canzone appena finita
  if (order.length > 1 && order[0] === last) {
    [order[0], order[1]] = [order[1], order[0]];
  }
}

// ---------- Funzioni ----------
function loadTrack(newPos) {
  pos = newPos;
  const song = playlist[order[pos]];
  // encodeURIComponent gestisce spazi, accenti, & e parentesi nei nomi dei file
  audio.src = SONG_FOLDER + encodeURIComponent(song.file);
  trackTitle.textContent = song.title;
  trackCount.textContent = `${pos + 1} / ${playlist.length}`;
  progressFill.style.width = "0%";
  currentTime.textContent = "0:00";
}

function setPlayingUI(isPlaying) {
  disc.classList.toggle("playing", isPlaying);
  tonearm.classList.toggle("on", isPlaying);
  btnPlay.classList.toggle("active", isPlaying);
}

function play() {
  audio.play();
  setPlayingUI(true);
}

function pause() {
  audio.pause();
  setPlayingUI(false);
}

function stop() {
  audio.pause();
  audio.currentTime = 0;
  setPlayingUI(false);
  // riporta il disco in posizione iniziale
  disc.style.animation = "none";
  disc.offsetHeight; // forza il "reset" dell'animazione
  disc.style.animation = "";
}

function next() {
  if (pos + 1 < playlist.length) {
    loadTrack(pos + 1);
  } else {
    // finito il giro: rimescola e riparti
    shuffle();
    loadTrack(0);
  }
  play();
}

function prev() {
  // se la canzone è avanti più di 3 secondi, ricomincia la stessa
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  // torna alla canzone precedente del giro (sulla prima, la fa ripartire)
  if (pos > 0) {
    loadTrack(pos - 1);
  } else {
    audio.currentTime = 0;
  }
  play();
}

function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ---------- Eventi bottoni ----------
btnPlay.addEventListener("click", play);
btnPause.addEventListener("click", pause);
btnStop.addEventListener("click", stop);
btnNext.addEventListener("click", next);
btnPrev.addEventListener("click", prev);

btnMerry.addEventListener("click", () => {
  merry.classList.toggle("show");
  if (merry.classList.contains("show")) snowBurst(60);
});

// ---------- Eventi audio ----------
audio.addEventListener("timeupdate", () => {
  const pct = (audio.currentTime / audio.duration) * 100 || 0;
  progressFill.style.width = pct + "%";
  currentTime.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});

// a fine canzone passa alla successiva
audio.addEventListener("ended", next);

// click sulla barra per saltare a un punto
progressBar.addEventListener("click", (e) => {
  const rect = progressBar.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  if (audio.duration) audio.currentTime = pct * audio.duration;
});

// ---------- Neve ----------
const snow = document.getElementById("snow");
const flakes = ["❄", "❅", "❆", "•"];

function createFlake() {
  const f = document.createElement("span");
  f.className = "flake";
  f.textContent = flakes[Math.floor(Math.random() * flakes.length)];
  f.style.left = Math.random() * 100 + "vw";
  f.style.fontSize = 8 + Math.random() * 16 + "px";
  f.style.opacity = 0.4 + Math.random() * 0.6;
  f.style.animationDuration = 5 + Math.random() * 7 + "s";
  snow.appendChild(f);
  f.addEventListener("animationend", () => f.remove());
}

function snowBurst(n) {
  for (let i = 0; i < n; i++) setTimeout(createFlake, i * 40);
}

setInterval(createFlake, 300);

// ---------- Avvio ----------
shuffle();
loadTrack(0);
