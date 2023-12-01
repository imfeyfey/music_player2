let album_art = document.querySelector(".album_art");
let title = document.querySelector(".title");
let artist = document.querySelector(".artist");

let playPause = document.querySelector(".playPause");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");

let seek_slider = document.querySelector(".seek_slider");
let current_time = document.querySelector(".current_time");
let total_duration = document.querySelector(".total_duration");


let track_index = 0;
let isPlaying = false;
let updateTimer;


let current_track = document.createElement('audio');
 
let track_list = [
  {
    name: "All to well",
    artist: "Taylor Swift",
    image: "https://images.genius.com/aac8ea3f13ae887a7f1fd9cdd451374e.1000x1000x1.png",
    path: "./music/All_to_well.mp3",
    lyricsID: "7076626",
  },
  {
    name: "Lost Stars",
    artist: "Adam Levine",
    image: "https://i1.sndcdn.com/artworks-000107518422-s73zzi-t500x500.jpg",
    path: "./music/Lost_Stars.mp3",
    lyricsID: "468673",
  },
  {
    name: "Demons",
    artist: "Boyce Avenue",
    image: "https://i1.sndcdn.com/artworks-000067847454-ifakyz-t500x500.jpg",
    path: "./music/Demons.mp3",
    lyricsID: "109206",
  },
  {
    name: "Only One",
    artist: "Yellowcard",
    image: "https://lastfm.freetls.fastly.net/i/u/300x300/032f0381ef8645e18b857eb3982c32ce.jpg",
    path: "./music/Only_One.mp3",
    lyricsID: "435106",
  },
  {
    name: "Shy",
    artist: "Jai Waetford",
    image: "https://images.genius.com/9661a8929f37422ca773af0b0a091c80.1000x1000x1.jpg",
    path: "./music/Shy.mp3",
    lyricsID: "1848937",
  },
];

loadTrack(track_index);

function loadTrack(track_index) {
  
  clearInterval(updateTimer);
  resetValues();
  current_track.src = track_list[track_index].path;
  current_track.load();

  album_art.style.backgroundImage = "url(" + track_list[track_index].image + ")";
  title.textContent = track_list[track_index].name;
  artist.textContent = track_list[track_index].artist;
 
  updateTimer = setInterval(seekUpdate, 1000);
  current_track.addEventListener("ended", nextTrack);
}

function resetValues() {
  current_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
 }  

function playPauseTrack() {
  if (!isPlaying) playTrack();
  else pauseTrack();
}

function playTrack() {
  current_track.play();
  isPlaying = true;
  playPause.innerHTML = '<i class="fa-solid fa-circle-pause"></i>';
  displayCurrentTrackLyrics();
}
    
function pauseTrack() {
  current_track.pause();
  isPlaying = false;
  playPause.innerHTML = '<i class="fa-solid fa-circle-play"></i>';
}

function nextTrack() {
  if (track_index < track_list.length -1)
  track_index += 1;
  else track_index = 0;
    
  loadTrack(track_index);
  playTrack();
}
    
function prevTrack() {
  if (track_index > 0)
  track_index -= 1;
  else track_index = track_list.length -1;
    
  loadTrack(track_index);
  playTrack();
}
  
function seekTo() {
  let seekto = current_track.duration * (seek_slider.value / 100);
  current_track.currentTime = seekto;
}

function seekUpdate() {
  let seekPosition = 0;
    
  if (!isNaN(current_track.duration)) {
    seekPosition = current_track.currentTime * (100 / current_track.duration);
    seek_slider.value = seekPosition;
    current_time.textContent = formatTime(current_track.currentTime);
    total_duration.textContent = formatTime(current_track.duration - current_track.currentTime);
  }
};
    
function formatTime(time) {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  if (minutes < 10) {
     minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return minutes + ":" + seconds;
}

async function displayCurrentTrackLyrics(lyrics) {
  try {
    
    const lyricsDisplay = document.querySelector(".lyrics");
    lyricsDisplay.textContent = lyrics;
    
  } catch (error) {
    console.error("Error fetching or displaying lyrics:", error);
  }
}

async function getLyricsForCurrentTrack() {
  const lyricsID = track_list[track_index].lyricsID;
  const url = `https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/?id=${lyricsID}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '66e2ce4cb8mshf1e560fb06f106ep1d2b83jsn20a30794505a',
      'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result); // Log the result to check the obtained data
    
    const lyrics = result.response.lyrics.body.html; 
    displayCurrentTrackLyrics(lyrics); 
    
  } catch (error) {
    console.error(error);
    return "Lyrics not available"; 
  }
}