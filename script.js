"use strict";
const container = document.querySelector(".container");
const songName = document.querySelector(".songs-detail .name");
const songArtist = document.querySelector(".songs-detail .artist");
const songImage = document.querySelector(".image-box img");
const mainAudio = document.querySelector("#main-audio");
const playPauseBtn = document.querySelector(".play-pause");
const nextBtn = document.querySelector("#next");
const prevBtn = document.querySelector("#prev");
const progress = document.querySelector(".circle2");
const circle = document.querySelector(".circle");
const songDuration = document.querySelector(".timer .end");
const songCurrentTime = document.querySelector(".timer .start");
const repeatBtn = document.querySelector("#repeat-plist");
const fastForward = document.querySelector("#fast-forward");
const fastRewind = document.querySelector("#fast-rewind");
const speed = document.querySelector(".speed");
const moreMusic = document.querySelector("#more-music");
const closeBtn = document.querySelector("#close");
const ulElem = document.querySelector("ul");

let activeSongIndex = 1;
let isPlaying = false;

//show music player details when the page load
function loadSong(indexNum) {
  activeSongIndex = indexNum;
  songName.innerHTML = songsList[indexNum - 1].name;
  songArtist.innerHTML = songsList[indexNum - 1].artist;
  songImage.src = `./images/${songsList[indexNum - 1].img}.jpg`;
  mainAudio.src = `./songs/${songsList[indexNum - 1].src}.mp3`;
}

//play music
function playSong() {
  container.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  isPlaying = true;
  renderDrawerList();
  mainAudio.play();
}

//pause music
function pauseSong() {
  container.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  isPlaying = false;
  renderDrawerList();
  mainAudio.pause();
}

//next music
function nextSong() {
  activeSongIndex++;
  activeSongIndex > songsList.length
    ? (activeSongIndex = 1)
    : (activeSongIndex = activeSongIndex);
  loadSong(activeSongIndex);
  playSong(activeSongIndex);
}

//previous music
function prevSong() {
  activeSongIndex--;
  activeSongIndex < 1
    ? (activeSongIndex = songsList.length)
    : (activeSongIndex = activeSongIndex);
  loadSong(activeSongIndex);
  playSong(activeSongIndex);
}

window.addEventListener("load", () => {
  renderDrawerList();
  loadSong(activeSongIndex);
});

playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = container.classList.contains("paused");
  isMusicPaused ? pauseSong() : playSong(activeSongIndex);
});

nextBtn.addEventListener("click", () => {
  nextSong();
});
prevBtn.addEventListener("click", () => {
  prevSong();
});

mainAudio.addEventListener("timeupdate", (e) => {
  let currentTime = e.target.currentTime;
  let duration = e.target.duration;

  progress.style.strokeDashoffset =
    691 - (591 * (currentTime / duration) * 100) / 100;

  mainAudio.addEventListener("loadeddata", () => {
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    songDuration.innerHTML = `${totalMin}:${totalSec}`;
  });
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  songCurrentTime.innerHTML = `${currentMin}:${currentSec}`;
});

fastForward.addEventListener("click", () => {
  mainAudio.currentTime += 6;
  fastForward.setAttribute("title", "fast-forward");
});

fastRewind.addEventListener("click", () => {
  mainAudio.currentTime -= 6;
  fastRewind.setAttribute("title", "fast-rewind");
});

speed.addEventListener("click", () => {
  if (mainAudio.playbackRate === 1) {
    mainAudio.playbackRate = 2;
    speed.classList.add("addColor");
  } else if (mainAudio.playbackRate > 1) {
    mainAudio.playbackRate = 1;
    speed.classList.remove("addColor");
  }
});

repeatBtn.addEventListener("click", () => {
  let getInerText = repeatBtn.innerText;
  if (getInerText == "repeat") {
    repeatBtn.innerText = "repeat_one";
    repeatBtn.setAttribute("title", "Song looped");
  } else if (getInerText == "repeat_one") {
    repeatBtn.innerText = "shuffle";
    repeatBtn.setAttribute("title", "Playback shuffled");
  } else if (getInerText == "shuffle") {
    repeatBtn.innerText = "repeat";
    repeatBtn.setAttribute("title", "Playlist looped");
  }
});

mainAudio.addEventListener("ended", () => {
  let getInerText = repeatBtn.innerText;
  if (getInerText === "repeat") {
    nextSong();
  } else if (getInerText === "repeat_one") {
    mainAudio.currentTime = 0;
    playSong(activeSongIndex);
  } else if (getInerText === "shuffle") {
    let shuffleMusic = Math.floor(Math.random() * songsList.length + 1);
    loadSong(shuffleMusic);
    playSong(shuffleMusic);
  }
});

const musicList = document.querySelector(".music-list");

moreMusic.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

closeBtn.addEventListener("click", () => {
  moreMusic.click();
});

function playFromDrawer(index) {
  if (index === activeSongIndex && isPlaying) {
    pauseSong(index);
    return;
  }
  index !== activeSongIndex && loadSong(index);
  playSong(index);
}

function renderDrawerList() {
  ulElem.innerHTML = "";
  const drawerListSong = songsList.map((item, index) => {
    return `<li onClick="playFromDrawer(${index + 1})" li-index="${index + 1}">
              <div class="list-details">
                <p class="musicName">${item.name}</p>
                <p clas="musicArtist">${item.artist}</p>
              </div>
               ${
                 activeSongIndex === index + 1 && isPlaying
                   ? '<i class="material-icons play">pause</i>'
                   : '<i class="material-icons play">play_arrow</i>'
               } 
            </li>`;
  });
  ulElem.insertAdjacentHTML("beforeend", drawerListSong.join(""));
}

function clicked(element) {
  let getLiIndex = element.getAttribute("li-index");
  activeSongIndex = getLiIndex;
  playSong(activeSongIndex);
}
