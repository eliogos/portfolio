export async function loadSkills() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let audioBuffer = null;

    // Load the audio files
    // Had to move to dropbox for now, as Neocities restricts audio files if not a supporter
    const audioData = await fetch('https://dl.dropboxusercontent.com/scl/fi/wrycn6o2bqtcy1gmxumbu/ui-button-hover-2.mp3?rlkey=dd0ej6c919bh42xhv3ln5ionr&st=7zwkrkgt&dl=0').then(res => res.arrayBuffer());
    audioBuffer = await audioContext.decodeAudioData(audioData);

    const popOutAudio = await fetch('https://dl.dropboxusercontent.com/scl/fi/8dg7em1l9b1g1gm9wuk0m/error-5-199276.mp3?rlkey=0weq2m1pdkv7es4oxjl9o6adx&st=hgeke6tg&dl=0').then(res => res.arrayBuffer());
    const popOutBuffer = await audioContext.decodeAudioData(popOutAudio);

    // I-V-vi-IV progression
    const progression = [
      1.0,    // I (C)
      1.5,    // V (G)
      1.667,  // vi (A)
      1.333   // IV (F)
    ];
    let progressionIndex = 0;
    let lastHoveredItem = null;
    let popOutTimeout = null;

    const response = await fetch('src/assets/data/skills.json');
    const data = await response.json();
    const container = document.getElementById('inventory');
    if (!container) return;
    (data.skills || []).forEach((skill) => {
      const item = document.createElement('div');
      item.classList.add('item');

      // Tooltip span
      const tooltip = document.createElement('span');
      tooltip.className = 'tooltip';
      const tooltipText = document.createElement('span');
      tooltipText.className = 'tooltip-text';
      tooltipText.textContent = skill.name;
      tooltip.appendChild(tooltipText);

      const img = document.createElement('img');
      img.src = skill.url;
      img.alt = skill.name;
      img.classList.add('icon');
      item.appendChild(img);
      item.appendChild(tooltip); // Add tooltip
      container.appendChild(item);

      // Play audio and animate on hover
      item.addEventListener('mouseenter', () => {
        // Cancel any pending pop-out sound
        if (popOutTimeout) {
          clearTimeout(popOutTimeout);
          popOutTimeout = null;
        }
        // Only change progression if different item
        if (lastHoveredItem !== item) {
          progressionIndex = (progressionIndex + 1) % progression.length;
          lastHoveredItem = item;
        }
        // Play audio with current progression pitch
        if (audioBuffer) {
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.playbackRate.value = progression[progressionIndex];

          // Create a gain node for volume control
          const gainNode = audioContext.createGain();
          const volume = 0.2;
          gainNode.gain.value = volume;

          source.connect(gainNode);
          gainNode.connect(audioContext.destination);
          source.start(0);
        }

        tooltip.classList.remove('wipe-exit');
        tooltip.classList.remove('rise-up-in');
        void tooltip.offsetWidth;
        tooltip.classList.add('rise-up-in');
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
      });

      item.addEventListener('mouseleave', () => {
        tooltip.classList.add('wipe-exit');

        // Delay pop-out sound to compliment item gaps
        popOutTimeout = setTimeout(() => {
          // Check if the mouse is over any .item
          if (!document.querySelector('.item:hover')) {
            // Play pop-out sound
            if (popOutBuffer) {
              const source = audioContext.createBufferSource();
              source.buffer = popOutBuffer;

              // Create a gain node for volume control
              const gainNode = audioContext.createGain();
              const volume = 0.03;
              gainNode.gain.value = volume;

              source.connect(gainNode);
              gainNode.connect(audioContext.destination);
              source.start(0);
            }
          }
        }, 120); // Pop out sound delay

        setTimeout(() => {
          tooltip.classList.remove('wipe-exit');
          tooltip.classList.remove('rise-up-in');
          tooltip.style.visibility = 'hidden';
          tooltip.style.opacity = '0';
        }, 400);
      });
    });
  } catch (error) {
    const container = document.getElementById('inventory');
    if (container) {
      const p = document.createElement('p');
      p.textContent = "Cannot load skills"; // Add a message to the container if skills failed to load.
      container.appendChild(p);
    }
    console.error('Error loading skills:', error);
  }
}