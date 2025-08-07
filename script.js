
let currentsong = new Audio();
let songs;
let currFolder;
var media = window.matchMedia("(min-width: 851px)");

//This code convert seconds into minute second format
function STMS(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "Invaild input"
  }
  const minutes = Math.floor(seconds / 60);
  const remainingseconds = Math.floor(seconds % 60);

  const FormattedMinutes = String(minutes).padStart(2, "0")
  const FormattedSeconds = String(remainingseconds).padStart(2, "0")

  return `${FormattedMinutes}:${FormattedSeconds}`
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`https://justaguy243.github.io/Spotify-Project-new/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = []

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  let songUL = document.querySelector(".songplaylist").getElementsByTagName("ul")[0]
  songUL.innerHTML = ""
  for (const song of songs) {
    let a = song.split("%20")[0]
    let b = await fetch(`https://justaguy243.github.io/Spotify-Project-new/Author.json`)
    let response2 = await b.json()
    songUL.innerHTML = songUL.innerHTML + `<li class="songcard relative">
            <img src="${Getimage(song)}">
            <div class="centre"
              style="width: 28px; height: 28px; background-color: #1ed760; border-radius: 50%; border: 2px soild #00FF00; padding: 4px; display: flex; align-items: center; justify-content: center;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" data-encore-id="icon" role="img"
                aria-hidden="true" class="e-91000-icon e-91000-baseline" viewBox="0 0 24 24">
                <path
                  d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606">
                </path>
              </svg>
            </div>
            <div class="title">${song.replaceAll("%20", " ").replaceAll(".mp3", "")}</div>
            <span class="author see cursor">${response2[a]}</span>
          </li>`
  }
  Array.from(document.querySelector(".songtable").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      playMusic(e.querySelector(".title").innerHTML + ".mp3")
    })
  })
  return songs
}

const style1 = (e) => {
  e.style.top = 70 + "px";
  e.style.left = 10 + "px";
  e.style.width = 35 + "vw";
  e.style.height = 35 + "vw";
}

const Removestyle1 = (e) => {
  e.style.top = "initial";
  e.style.left = "initial";
  e.style.width = 55 + "%";
  e.style.height = 10 + "%";
}

const style2 = (e) => {
  e.style.height = 240 + "px";
  e.style.top = 5 + "%";
  e.style.bottom = 20 + "px";
  e.style.gap = 10 + "px";
  e.style.flexDirection = "column";
  e.style.alignItems = "center";
  e.style.justifyContent = "space-evenly";
}

const Removestyle2 = (e) => {
  e.style.height = 60 + "px";
  e.style.bottom = 50 + "px";
  e.style.gap = "initial";
  e.style.flexDirection = "row";
}

const Getimage = (image) => {
  let haveimage = "spotify_images/" + image.replaceAll("%20", " ").replaceAll(".mp3", ".jpg");
  return haveimage;
}

const playMusic = (track, pause = false) => {
  //  let audio = new Audio("/songs/" + track)
  currentsong.src = `/${currFolder}/` + track
  if (!pause) {
    currentsong.play();
    play.src = "SVG/Pause.svg";
  }
  document.querySelector(".songduration").innerHTML = `<div class="">
  ${STMS(currentsong.currentTime)}/00:00
  </div>`

  document.querySelector(".songinfo").innerHTML = decodeURI(track.replaceAll(".mp3", " "));
  document.querySelector(".songimage").firstElementChild.src = Getimage(track);
}

//This is to change playlist
async function DisplayAlbums() {
  let b = await fetch(`https://justaguy243.github.io/Spotify-Project-new/songs/`);
  let response2 = await b.text();
  let div2 = document.createElement("div");
  div2.innerHTML = response2;
  let anchors = div2.getElementsByTagName("a")
  let array = Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-2)[0]
      let b = await fetch(`https://justaguy243.github.io/Spotify-Project-new/songs/${folder}/info.json`)
      let response2 = await b.json()
      listofsong.innerHTML = listofsong.innerHTML + `<li data-folder="${response2.folder}" class="playlist">
            <div class="info">
              <div><img src="${response2.image}" class="giveimage"></div>
              <div>${response2.title} : ${response2.description}</div>
            </div>
            <div>
              <span>Play</span>
              <img src="SVG/Play1.svg" class="invert">
            </div>
          </li>`
    }

  }

  Array.from(document.getElementsByClassName("playlist")).forEach(e => {
    e.addEventListener("click", async item => {
      await getSongs(`songs/${item.currentTarget.dataset.folder}`)
      playMusic(songs[0])
    })
  })
}



async function main() {
  await getSongs("https://justaguy243.github.io/Spotify-Project-new/songs/Favourite")
  playMusic(songs[0]);

  await DisplayAlbums()

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "SVG/Pause.svg";
    }
    else {
      currentsong.pause();
      play.src = "SVG/Play1.svg";
    }
  })

  // To see the curret time and duration of the given song
  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songduration").innerHTML = `<div class="">
  ${STMS(currentsong.currentTime)}/${STMS(currentsong.duration)}
  </div>`
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
  })

  // To change the timepoint of current song
  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = ((currentsong.duration) * percent) / 100
  })

  let x = document.querySelector(".playbar");
  let y = document.querySelector(".abovebar");
  let z = document.querySelector(".imageinfo");
  let a = document.querySelector(".songimage").firstElementChild;


  document.querySelector(".home").addEventListener("click", () => {
    document.querySelector(".leftbar").style.left = 0 + "%";
    if (media.matches) {
      Removestyle1(x);
      Removestyle2(y);
      z.style.flexDirection = "row";
      z.style.gap = "initial";
      a.style.width = 50 + "px";
      a.style.height = 50 + "px";
    }
  })

  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".leftbar").style.left = -100 + "%"
    if (media.matches) {
      style1(x);
      style2(y);
      z.style.flexDirection = "column";
      z.style.gap = 15 + "px";
      a.style.width = 19 + "vw";
      a.style.height = 19 + "vw";
    }
  })

  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    currentsong.volume = parseInt(e.target.value) / 100
  })
//This is used to play the previous Song in playlist
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index >= 1) {
      playMusic(songs[index - 1])
    }
  })
  //This is used to play the next Song in playlist
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1])
    }
  })
//Incrase or decrease the volume using a slider
  document.querySelector(".volume").firstElementChild.addEventListener("click", e => {
    if (e.target.src.includes("Volume.svg")) {
      e.target.src = e.target.src.replace("Volume.svg", "Muted.svg");
      currentsong.volume = 0;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else {
      e.target.src = e.target.src.replace("Muted.svg", "Volume.svg");
      currentsong.volume = .10;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 50;
    }
  })
}




main()
