document.addEventListener('DOMContentLoaded', () => {
  
  // --- DYNAMICKÉ VLOŽENÍ POKOJE ---
  const roomContainer = document.getElementById('room-container');
  if (roomContainer) {
    const roomBgImg = document.createElement('img');
    roomBgImg.src = 'pokoj/webovka_pokoj.png';
    roomBgImg.alt = 'Pokoj';
    roomBgImg.className = 'room-bg';
    roomContainer.insertBefore(roomBgImg, roomContainer.firstChild);
  }

  // --- PRELOAD OBRÁZKŮ ---
  const imagesToPreload = [
    'pokoj/webovka_pokoj.png',
    'okno/okno.png',
    'obraz/obraz_maly_princ.png',
    'obraz/obraz_kmotr.png',
    'obraz/ram_obrazu.png',
    'gramec/gramec_kryt.png',
    'gramec/vyskakovaci_okno_songy/vyskakovaci_okno_pisnicky.png',
    'gramec/vyskakovaci_okno_songy/deska.png',
    'pocitac/homepage/homepage.png'
  ];

  imagesToPreload.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // Seznam obrazů v galerii (původní funkční cyklování)
  const artImages = [
    { src: 'obraz/obraz_maly_princ.png', customClass: '' },
    { src: 'obraz/obraz_kmotr.png', customClass: '' }
  ];

  let currentArtIndex = 0;
  const artImg = document.getElementById('art-img');
  const frameSpot = document.getElementById('frame-spot');

  function updateArt(index) {
    const current = artImages[index];
    artImg.className = 'art-content ' + current.customClass;
    artImg.src = current.src;
  }

  if (frameSpot) {
    frameSpot.addEventListener('click', (e) => {
      e.stopPropagation();
      currentArtIndex = (currentArtIndex + 1) % artImages.length;
      updateArt(currentArtIndex);
    });
  }

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

  // --- GRAMOFON PLAYLIST & PŘEHRÁVÁNÍ ---
  const playlist = [
    { title: "Right Next Door To Hell", src: "gramec/vyskakovaci_okno_songy/playlist/Right Next Door To Hell.mp3" },
    { title: "2 Minutes To Midnight", src: "gramec/vyskakovaci_okno_songy/playlist/2 Minutes To Midnight.mp3" },
    { title: "Alexander the Great", src: "gramec/vyskakovaci_okno_songy/playlist/Alexander the Great (356-323 B.C.) (2015 Remaster).mp3" },
    { title: "Can I Play with Madness", src: "gramec/vyskakovaci_okno_songy/playlist/Can I Play with Madness (2015 Remaster).mp3" },
    { title: "Dream of Mirrors", src: "gramec/vyskakovaci_okno_songy/playlist/Dream of Mirrors (2015 Remaster).mp3" },
    { title: "Phantom of the Opera", src: "gramec/vyskakovaci_okno_songy/playlist/Phantom of the Opera (2015 Remaster).mp3" },
    { title: "The Godfather - The Halls Of Fear", src: "gramec/vyskakovaci_okno_songy/playlist/The Godfather - The Halls Of Fear.mp3" },
    { title: "Ennio Morricone - The Trio", src: "gramec/vyskakovaci_okno_songy/playlist/Ennio Morricone The Trio Audio.mp3" },
    { title: "Kill Bill - The Whistle Song", src: "gramec/vyskakovaci_okno_songy/playlist/Kill Bill Vol. 1 - The whistle song.mp3" },
    { title: "Beauty and the Beast", src: "gramec/vyskakovaci_okno_songy/playlist/Beauty and the Beast (2017 Remaster).mp3" },
    { title: "Station to Station", src: "gramec/vyskakovaci_okno_songy/playlist/Station to Station (2016 Remaster).mp3" },
    { title: "Kate Bush - Wuthering Heights", src: "gramec/vyskakovaci_okno_songy/playlist/Kate Bush Wuthering Heights.mp3" },
    { title: "YES - Owner of a Lonely Heart", src: "gramec/vyskakovaci_okno_songy/playlist/YES - Owner of a Lonely Heart (Official Music Video).mp3" },
    { title: "Daniel Landa - Bila Hora", src: "gramec/vyskakovaci_okno_songy/playlist/Daniel Landa - Bila Hora.mp3" },
    { title: "Daniel Landa Šance", src: "gramec/vyskakovaci_okno_songy/playlist/Daniel Landa Šance.mp3" }
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

  gramAudio.addEventListener('ended', () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
      playTrack();
    }
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

  // --- INTERAKTIVNÍ MINIHRA MOORHUHN ---
  const windowSpot = document.getElementById('window-spot');
  const gameModal = document.getElementById('game-modal');
  const closeGameModal = document.getElementById('close-game-modal');
  const gameArea = document.getElementById('game-area');
  const scoreDisplay = document.getElementById('score-val');
  const timerDisplay = document.getElementById('timer-val');
  const ammoContainer = document.getElementById('ammo-container');
  const reloadMsg = document.getElementById('reload-msg');

  const xpGameOverModal = document.getElementById('xp-gameover-modal');
  const xpFinalScore = document.getElementById('xp-final-score');
  const xpFinalShots = document.getElementById('xp-final-shots');
  const xpFinalAccuracy = document.getElementById('xp-final-accuracy');
  const xpModalClose = document.getElementById('xp-modal-close');
  const xpModalOk = document.getElementById('xp-modal-ok');

  const crosshair = document.createElement('div');
  crosshair.className = 'custom-crosshair';
  gameArea.appendChild(crosshair);

  function initTrees() {
      document.querySelectorAll('.tree-obstacle-1, .tree-obstacle-2').forEach(t => t.remove());
      
      const tree1 = document.createElement('div');
      tree1.className = 'tree-obstacle-1';
      tree1.style.left = '250px'; 
      gameArea.appendChild(tree1);

      const tree2 = document.createElement('div');
      tree2.className = 'tree-obstacle-2';
      tree2.style.left = '850px'; 
      gameArea.appendChild(tree2);
  }

  gameArea.addEventListener('mousemove', (e) => {
      const rect = gameArea.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      crosshair.style.left = `${x}px`;
      crosshair.style.top = `${y}px`;
  });

  const bgAudio = new Audio('okno/minihra/zvuky/hudba_slepice_pozadi.mp3');
  bgAudio.loop = true;
  bgAudio.volume = 0.4;

  const shotAudio = new Audio('okno/minihra/zvuky/vystrel.mp3');
  const hitAudio = new Audio('okno/minihra/zvuky/zabiti_slepice.mp3');

  let score = 0;
  const maxAmmo = 8;
  let ammo = maxAmmo;
  let ammoStates = new Array(maxAmmo).fill(1);

  // Statistiky střelby
  let totalShotsFired = 0;
  let totalHits = 0;

  let gameInterval = null;
  let planeInterval = null;
  let timerInterval = null;
  let timeLeft = 60;
  let isGameActive = false;

  windowSpot.addEventListener('click', () => {
      if (typeof pauseTrackWithFadeOut === 'function' && typeof isPlaying !== 'undefined' && isPlaying) {
          pauseTrackWithFadeOut();
      }
      
      gameModal.classList.add('active');
      crosshair.style.display = 'block';
      initTrees();
      startGame();
  });

  closeGameModal.addEventListener('click', () => {
      stopGame();
  });

  xpModalClose.addEventListener('click', () => {
      xpGameOverModal.style.display = 'none';
  });

  xpModalOk.addEventListener('click', () => {
      xpGameOverModal.style.display = 'none';
  });

  function updateAmmoDisplay() {
      ammoContainer.innerHTML = '';
      for (let i = 0; i < maxAmmo; i++) {
          const div = document.createElement('div');
          div.className = 'ammo-item';
          let frameNum = ammoStates[i];
          div.style.backgroundImage = `url('okno/minihra/naboje/sprite-${frameNum}-1.png')`;
          ammoContainer.appendChild(div);
      }
      reloadMsg.style.display = (ammo === 0) ? 'block' : 'none';
  }

  function startGame() {
      isGameActive = true;
      score = 0;
      ammo = maxAmmo;
      ammoStates.fill(1);
      totalShotsFired = 0;
      totalHits = 0;
      timeLeft = 60;
      scoreDisplay.textContent = score;
      timerDisplay.textContent = timeLeft;
      crosshair.style.display = 'block';
      updateAmmoDisplay();

      bgAudio.currentTime = 0;
      bgAudio.play().catch(e => console.log("Background music blocked:", e));

      document.querySelectorAll('.game-sprite, .plane-container').forEach(s => s.remove());

      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
          if (!isGameActive) return;
          timeLeft--;
          timerDisplay.textContent = timeLeft;
          if (timeLeft <= 0) {
              endGame();
          }
      }, 1000);

      clearInterval(gameInterval);
      gameInterval = setInterval(spawnChicken, 600);

      clearInterval(planeInterval);
      planeInterval = setInterval(spawnPlane, 15000);
  }

  function endGame() {
      isGameActive = false;
      bgAudio.pause();
      clearInterval(gameInterval);
      clearInterval(planeInterval);
      clearInterval(timerInterval);
      crosshair.style.display = 'none';
      document.querySelectorAll('.game-sprite, .plane-container, .tree-obstacle-1, .tree-obstacle-2').forEach(s => s.remove());

      gameModal.classList.remove('active');
      xpFinalScore.textContent = score;
      xpFinalShots.textContent = totalShotsFired;

      let accuracy = totalShotsFired > 0 ? Math.round((totalHits / totalShotsFired) * 100) : 0;
      xpFinalAccuracy.textContent = accuracy + '%';

      xpGameOverModal.style.display = 'flex';
  }

  function stopGame() {
      isGameActive = false;
      gameModal.classList.remove('active');
      crosshair.style.display = 'none';
      bgAudio.pause();
      clearInterval(gameInterval);
      clearInterval(planeInterval);
      clearInterval(timerInterval);
      document.querySelectorAll('.game-sprite, .plane-container, .tree-obstacle-1, .tree-obstacle-2').forEach(s => s.remove());
  }

  gameArea.addEventListener('click', (e) => {
      if (!isGameActive) return;

      if (ammo > 0) {
          totalShotsFired++; // Započítání výstřelu
          let shotIndex = ammo - 1;
          ammo--;

          let currentFrame = 1;
          const animInterval = setInterval(() => {
              if (currentFrame <= 21) {
                  ammoStates[shotIndex] = currentFrame;
                  updateAmmoDisplay();
                  currentFrame++;
              } else {
                  clearInterval(animInterval);
              }
          }, 20);

          updateAmmoDisplay();

          const shotSound = shotAudio.cloneNode();
          shotSound.volume = 0.6;
          shotSound.play().catch(err => console.log(err));
      }
  });

  document.addEventListener('keydown', (e) => {
      if (isGameActive && (e.key === 'r' || e.key === 'R')) {
          ammo = maxAmmo;
          ammoStates.fill(1);
          updateAmmoDisplay();
      }
  });

  function spawnChicken() {
      if (!isGameActive) return;

      const chicken = document.createElement('div');
      chicken.className = 'game-sprite';

      const typeRand = Math.random();
      let sizeClass = 'chicken-medium';
      let points = 20;
      
      let difficultyMultiplier = 1 + (60 - timeLeft) * 0.02;
      let speed = (Math.random() * 1.2 + 2.5) * difficultyMultiplier;

      if (typeRand < 0.20) {
          sizeClass = 'chicken-large';
          points = 10;
          speed = (Math.random() * 0.6 + 1.5) * difficultyMultiplier;
      } else if (typeRand < 0.60) {
          sizeClass = 'chicken-medium';
          points = 20;
          speed = (Math.random() * 1.0 + 2.2) * difficultyMultiplier;
      } else {
          sizeClass = 'chicken-small';
          points = 30;
          speed = (Math.random() * 1.5 + 3.2) * difficultyMultiplier;
      }

      chicken.classList.add(sizeClass);

      const fromLeft = Math.random() > 0.5;
      const startY = Math.random() * 320 + 50;

      let currentX = fromLeft ? -200 : gameArea.clientWidth + 50;
      chicken.style.top = startY + 'px';
      chicken.style.left = currentX + 'px';

      if (fromLeft) {
          chicken.style.transform = 'scaleX(-1)'; 
      } else {
          chicken.style.transform = 'scaleX(1)';  
      }

      let frameIndex = 1;
      const totalFrames = 12;
      chicken.style.backgroundImage = `url('okno/minihra/slepice_velka/let/slepice_let (${frameIndex}).png')`;

      const animTimer = setInterval(() => {
          if (!isGameActive || isDead) return;
          frameIndex = (frameIndex % totalFrames) + 1;
          chicken.style.backgroundImage = `url('okno/minihra/slepice_velka/let/slepice_let (${frameIndex}).png')`;
      }, 65);

      let isDead = false;

      chicken.addEventListener('click', (e) => {
          e.stopPropagation();
          if (ammo > 0 && !isDead) {
              isDead = true;
              totalHits++; // Započítání trefené slepice
              ammo--;
              
              let shotIndex = ammo;
              let currentFrameAmmo = 1;
              const animInterval = setInterval(() => {
                  if (currentFrameAmmo <= 21) {
                      ammoStates[shotIndex] = currentFrameAmmo;
                      updateAmmoDisplay();
                      currentFrameAmmo++;
                  } else {
                      clearInterval(animInterval);
                  }
              }, 20);

              score += points;
              scoreDisplay.textContent = score;
              updateAmmoDisplay();

              const shotSound = shotAudio.cloneNode();
              shotSound.volume = 0.6;
              shotSound.play().catch(err => console.log(err));

              const hitAudioClone = hitAudio.cloneNode();
              hitAudioClone.volume = 0.8;
              hitAudioClone.play().catch(err => console.log(err));

              clearInterval(animTimer);

              let deathFrame = 1;
              const totalDeathFrames = 8;
              chicken.style.backgroundImage = `url('okno/minihra/slepice_velka/smrt/slepice_smrt (${deathFrame}).png')`;

              const deathAnimTimer = setInterval(() => {
                  if (deathFrame < totalDeathFrames) {
                      deathFrame++;
                      chicken.style.backgroundImage = `url('okno/minihra/slepice_velka/smrt/slepice_smrt (${deathFrame}).png')`;
                  }
              }, 50);

              let fallY = parseFloat(chicken.style.top);
              const fallTimer = setInterval(() => {
                  fallY += 10;
                  chicken.style.top = fallY + 'px';
                  if (fallY > gameArea.clientHeight) {
                      clearInterval(fallTimer);
                      clearInterval(deathAnimTimer);
                      chicken.remove();
                  }
              }, 16);
          }
      });

      gameArea.appendChild(chicken);

      const moveTimer = setInterval(() => {
          if (!isGameActive || isDead) {
              clearInterval(moveTimer);
              if (isDead) return;
              chicken.remove();
              return;
          }

          currentX += (fromLeft ? speed : -speed);
          chicken.style.left = currentX + 'px';

          if ((fromLeft && currentX > gameArea.clientWidth + 250) || (!fromLeft && currentX < -250)) {
              clearInterval(moveTimer);
              chicken.remove();
          }
      }, 16);
  }

  function spawnPlane() {
      if (!isGameActive) return;

      const planeContainer = document.createElement('div');
      planeContainer.className = 'plane-container';

      const planeImg = document.createElement('div');
      planeImg.className = 'plane-img';

      const bannerImg = document.createElement('img');
      bannerImg.src = 'okno/minihra/letadlo/plane_banner.png';
      bannerImg.className = 'plane-banner-img';

      planeContainer.appendChild(bannerImg);
      planeContainer.appendChild(planeImg);

      let currentX = -500;
      planeContainer.style.top = '40px';
      planeContainer.style.left = currentX + 'px';

      let planeFrame = 1;
      const totalPlaneFrames = 19;
      planeImg.style.backgroundImage = `url('okno/minihra/letadlo/letadlo (${planeFrame}).png')`;

      const planeAnimTimer = setInterval(() => {
          if (!isGameActive) {
              clearInterval(planeAnimTimer);
              return;
          }
          planeFrame = (planeFrame % totalPlaneFrames) + 1;
          planeImg.style.backgroundImage = `url('okno/minihra/letadlo/letadlo (${planeFrame}).png')`;
      }, 80);

      gameArea.appendChild(planeContainer);

      const planeTimer = setInterval(() => {
          if (!isGameActive) {
              clearInterval(planeTimer);
              clearInterval(planeAnimTimer);
              planeContainer.remove();
              return;
          }

          currentX += 1.5;
          planeContainer.style.left = currentX + 'px';

          if (currentX > gameArea.clientWidth + 600) {
              clearInterval(planeTimer);
              clearInterval(planeAnimTimer);
              planeContainer.remove();
          }
      }, 16);
  }
});