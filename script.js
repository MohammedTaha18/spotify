let currentsong = new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(decodeURIComponent(element.href.split(`/${folder}/`)[1]));
        }
    }

    // Show all songs in the playlist
    let songul = document.querySelector(".songlist ul");
    songul.innerHTML = "";
    for (const song of songs) {
        songul.innerHTML += `<li> 
         <img width="34px" src="music.svg" alt="" class="invert">
         <div class="info">
             <div>${song}</div>
             <div>Taha</div>
         </div>
         <div class="playnow">
             <span>Play now</span>
             <img src="play1.svg" alt="" >
         </div>
        </li>`;
    }

    // Attach event listeners to each song
    Array.from(document.querySelectorAll(".songlist li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info div").innerHTML.trim());
        });
    });

    return songs;
}

const playMusic = (track, pause = false) => {
    currentsong.src = `/${currfolder}/${encodeURIComponent(track)}`;
    if (!pause) {
        currentsong.play();
        play.src = "pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
}

async function displayAlbums() {
    let a = await fetch(`/video84/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").splice(-2)[0];
            let a = await fetch(`/video84/songs/${folder}/info.json`);
            let response = await a.json();
            cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>
            <img width="45px" src="/video84/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`;
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.querySelectorAll(".card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`video84/songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        });
    });
}

async function main() {
    // Get the list of all songs
    await getSongs("video84/songs/ncs");
   