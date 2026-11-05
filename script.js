document.addEventListener('DOMContentLoaded', () => {
  
  // --- PERMANENTNÍ PŘEDNAČÍTÁNÍ OBRÁZKŮ (PRELOAD) ---
  // Zabrání jakémukoli sekání, problikávání nebo zpoždění při kliknutí
  const imagesToPreload = [
    'pokoj/webovka_pokoj.png',
    'okno/okno.png',
    'obraz/obraz_maly_princ.png',
    'obraz/obraz_kmotr.png',
    'obraz/obraz_cheschire_cat.png',
    'obraz/ram_obrazu.png',
    'gramec/gramec_kryt.png',
    'gramec/vyskakovaci_okno_songy/vyskakovaci_okno_pisnicky.png',
    'gramec/vyskakovaci_okno_songy/deska.png',
    'pocitac/homepage/homepage.png',
    'pocitac/homepage/word/word_okno.png',
    'pocitac/homepage/excel/excel_okno.png',
    'pocitac/homepage/vs/vs_okno.png',
    'pocitac/homepage/wot/wot_okno.png'
  ];

  imagesToPreload.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // Seznam obrazů v galerii
  const artImages = [
    { src: 'obraz/obraz_maly_princ.png', customClass: '' },
    { src: 'obraz/obraz_kmotr.png', customClass: '' },
    { src: 'obraz/obraz_cheschire_cat.png', customClass: 'cat-art' }
  ];

  let currentArtIndex = 0;

  const artImg = document.getElementById('art-img');
  const prevBtn = document.getElementById('prev-art');
  const nextBtn = document.getElementById('next-art');

  function updateArt(index) {
    const current = artImages[index];
    artImg.className = 'art-content ' + current.customClass;
    artImg.src = current.src;
  }

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentArtIndex = (currentArtIndex - 1 + artImages.length) % artImages.length;
    updateArt(currentArtIndex);
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentArtIndex = (currentArtIndex + 1) % artImages.length;
    updateArt(currentArtIndex);
  });

  updateArt(currentArtIndex);

  // --- MODAL OKNO PC ---
  const pcSpot = document.getElementById('pc-spot');
  const pcModal = document.getElementById('pc-modal');
  const closePcModal = document.getElementById('close-pc-modal');

  pcSpot.addEventListener('click', () => {
    pcModal.classList.add('active');
  });

  closePcModal.addEventListener('click', () => {
    pcModal.classList.remove('active');
    closeAppWindowFunc();
  });

  pcModal.addEventListener('click', (e) => {
    if (e.target === pcModal) {
      pcModal.classList.remove('active');
      closeAppWindowFunc();
    }
  });

  // --- MODAL OKNO GRAMOFON ---
  const gramophoneSpot = document.getElementById('gramophone-spot');
  const gramophoneModal = document.getElementById('gramophone-modal');
  const closeGramophoneModal = document.getElementById('close-gramophone-modal');

  gramophoneSpot.addEventListener('click', () => {
    gramophoneModal.classList.add('active');
  });

  closeGramophoneModal.addEventListener('click', () => {
    gramophoneModal.classList.remove('active');
  });

  gramophoneModal.addEventListener('click', (e) => {
    if (e.target === gramophoneModal) {
      gramophoneModal.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (appWindow.classList.contains('active')) {
        closeAppWindowFunc();
      } else if (pcModal.classList.contains('active')) {
        pcModal.classList.remove('active');
      } else if (gramophoneModal.classList.contains('active')) {
        gramophoneModal.classList.remove('active');
      }
    }
  });

  // --- DATABÁZE APLIKACÍ (PC) ---
  const appsConfig = {
    'affinity': { title: 'Affinity', image: 'obraz/obraz_maly_princ.png' },
    'blender': { title: 'Blender', video: 'pocitac/homepage/blender/Blender_okno.mp4' },
    'word': { title: 'Microsoft Word', image: 'pocitac/homepage/word/word_okno.png' },
    'excel': { title: 'Microsoft Excel', image: 'pocitac/homepage/excel/excel_okno.png' },
    'vs': { title: 'Visual Studio Code', image: 'pocitac/homepage/vs/vs_okno.png' },
    'mafia': { title: 'Mafia', audio: 'pocitac/homepage/mafia/mafia_soundeffect.mp3' },
    'wot': { title: 'World of Tanks', image: 'pocitac/homepage/wot/wot_okno.png', audio: 'pocitac/homepage/wot/wot_soundtrack.mp3' },
    'metro': { title: 'Metro', audio: 'pocitac/homepage/Metro/metro_soundtrack.mp3' },
    'eurotrack': { title: 'Euro Truck Simulator', audio: 'pocitac/homepage/eurotrack/eurotrack_soundeffect.mp3' },
    'detroit': { title: 'Detroit: Become Human', video: 'pocitac/homepage/detroti_become_human/detroit_video.mp4' }
  };

  let currentAudio = null;
  const desktopIcons = document.querySelectorAll('.desktop-icon');
  const appWindow = document.getElementById('app-window');
  const appTitle = document.getElementById('app-title');
  const appWindowBody = document.getElementById('app-window-body');
  const closeAppWindowBtn = document.getElementById('close-app-window');

  function closeAppWindowFunc() {
    appWindow.classList.remove('active');
    appWindowBody.innerHTML = '';
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
  }

  desktopIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      const appKey = icon.getAttribute('data-app');
      const appData = appsConfig[appKey];
      if (!appData) return;

      closeAppWindowFunc();
      appTitle.textContent = appData.title;
      let hasContent = false;

      if (appData.image) {
        const img = document.createElement('img');
        img.src = appData.image;
        appWindowBody.appendChild(img);
        hasContent = true;
      }

      if (appData.video) {
        const video = document.createElement('video');
        video.src = appData.video;
        video.autoplay = true;
        video.controls = true;
        video.loop = true;
        appWindowBody.appendChild(video);
        hasContent = true;
      }

      if (appData.audio) {
        currentAudio = new Audio(appData.audio);
        currentAudio.play().catch(err => console.log("Audio autoplay blokován:", err));
      }

      if (hasContent) {
        appWindow.classList.add('active');
      }
    });
  });

  closeAppWindowBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeAppWindowFunc();
  });


  // --- LOGIKA GRAMOFONU ---
  const playlist = [
    { title: "Daniel Landa - Bila Hora", src: "gramec/vyskakovaci_okno_songy/playlist/Daniel Landa - Bila Hora.mp3" },
    { title: "Daniel Landa Šance", src: "gramec/vyskakovaci_okno_songy/playlist/Daniel Landa Šance.mp3" },
    { title: "Ennio Morricone - The Trio", src: "gramec/vyskakovaci_okno_songy/playlist/Ennio Morricone The Trio Audio.mp3" },
    { title: "Right Next Door To Hell", src: "gramec/vyskakovaci_okno_songy/playlist/Right Next Door To Hell.mp3" },
    { title: "2 Minutes To Midnight", src: "gramec/vyskakovaci_okno_songy/playlist/2 Minutes To Midnight.mp3" },
    { title: "Alexander the Great", src: "gramec/vyskakovaci_okno_songy/playlist/Alexander the Great (356-323 B.C.) (2015 Remaster).mp3" },
    { title: "Can I Play with Madness", src: "gramec/vyskakovaci_okno_songy/playlist/Can I Play with Madness (2015 Remaster).mp3" },
    { title: "Dream of Mirrors", src: "gramec/vyskakovaci_okno_songy/playlist/Dream of Mirrors (2015 Remaster).mp3" },
    { title: "Phantom of the Opera", src: "gramec/vyskakovaci_okno_songy/playlist/Phantom of the Opera (2015 Remaster).mp3" },
    { title: "Kate Bush - Wuthering Heights", src: "gramec/vyskakovaci_okno_songy/playlist/Kate Bush Wuthering Heights.mp3" },
    { title: "The Godfather - The Halls Of Fear", src: "gramec/vyskakovaci_okno_songy/playlist/The Godfather - The Halls Of Fear.mp3" },
    { title: "Beauty and the Beast", src: "gramec/vyskakovaci_okno_songy/playlist/Beauty and the Beast (2017 Remaster).mp3" },
    { title: "Kill Bill - The Whistle Song", src: "gramec/vyskakovaci_okno_songy/playlist/Kill Bill Vol. 1 - The whistle song.mp3" },
    { title: "Station to Station", src: "gramec/vyskakovaci_okno_songy/playlist/Station to Station (2016 Remaster).mp3" },
    { title: "YES - Owner of a Lonely Heart", src: "gramec/vyskakovaci_okno_songy/playlist/YES - Owner of a Lonely Heart (Official Music Video).mp3" }
  ];

  let currentTrackIndex = 0;
  let gramAudio = new Audio();
  let isPlaying = false;

  const vinylRecord = document.getElementById('vinyl-record');
  const playBtn = document.getElementById('gram-play');
  const prevTrackBtn = document.getElementById('gram-prev');
  const nextTrackBtn = document.getElementById('gram-next');
  const seekSlider = document.getElementById('gram-seek');
  const volumeSlider = document.getElementById('gram-volume');
  const songTitleDisplay = document.getElementById('gram-current-song-title');

  let currentRotation = 0;
  let currentSpeed = 0; 
  let normalSpeed = 0.18;
  let lastFrameTime = null;
  let animationFrameId = null;

  gramAudio.addEventListener('error', (e) => {
    console.error("Chyba při načítání audio souboru:", gramAudio.src, e);
    songTitleDisplay.textContent = "Chyba souboru!";
  });

  function loadTrack(index) {
    currentTrackIndex = index;
    gramAudio.src = playlist[index].src;
    songTitleDisplay.textContent = playlist[index].title;
    gramAudio.load();
  }

  function rotateVinylLoop(timestamp) {
    if (!lastFrameTime) lastFrameTime = timestamp;
    const delta = timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    if (currentSpeed > 0) {
      currentRotation = (currentRotation + currentSpeed * delta) % 360;
      vinylRecord.style.transform = `rotate(${currentRotation}deg)`;
      animationFrameId = requestAnimationFrame(rotateVinylLoop);
    }
  }

  function startSpinning() {
    currentSpeed = normalSpeed;
    lastFrameTime = performance.now();
    cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(rotateVinylLoop);
  }

  function stopSpinningWithFade() {
    let startSpeed = currentSpeed;
    let startTime = performance.now();
    let duration = 1500;

    function fadeStep(timestamp) {
      let elapsed = timestamp - startTime;
      let progress = Math.min(elapsed / duration, 1);
      let easeProgress = 1 - Math.pow(1 - progress, 3);
      
      currentSpeed = startSpeed * (1 - easeProgress);

      if (progress < 1 && currentSpeed > 0.001) {
        animationFrameId = requestAnimationFrame(fadeStep);
      } else {
        currentSpeed = 0;
        cancelAnimationFrame(animationFrameId);
      }
    }
    requestAnimationFrame(fadeStep);
  }

  function playTrack() {
    isPlaying = true;
    gramAudio.volume = parseFloat(volumeSlider.value);
    gramAudio.play().catch(e => console.log("Audio play error:", e));
    startSpinning();
  }

  function pauseTrackWithFadeOut() {
    if (!isPlaying) return;
    isPlaying = false;

    let startVol = gramAudio.volume;
    let fadeDuration = 1500;
    let fadeSteps = 15;
    let stepTime = fadeDuration / fadeSteps;
    let volStep = startVol / fadeSteps;

    let fadeInterval = setInterval(() => {
      if (gramAudio.volume > volStep) {
        gramAudio.volume -= volStep;
      } else {
        gramAudio.volume = 0;
        gramAudio.pause();
        clearInterval(fadeInterval);
      }
    }, stepTime);

    stopSpinningWithFade();
  }

  playBtn.addEventListener('click', () => {
    if (!gramAudio.src) {
      loadTrack(currentTrackIndex);
    }
    if (isPlaying) {
      pauseTrackWithFadeOut();
    } else {
      playTrack();
    }
  });

  nextTrackBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) playTrack();
  });

  prevTrackBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) playTrack();
  });

  gramAudio.addEventListener('timeupdate', () => {
    if (gramAudio.duration) {
      seekSlider.value = (gramAudio.currentTime / gramAudio.duration) * 100;
    }
  });

  seekSlider.addEventListener('input', () => {
    if (gramAudio.duration) {
      gramAudio.currentTime = (seekSlider.value / 100) * gramAudio.duration;
    }
  });

  volumeSlider.addEventListener('input', () => {
    gramAudio.volume = parseFloat(volumeSlider.value);
  });

  loadTrack(0);
});