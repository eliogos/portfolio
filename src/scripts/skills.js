export async function loadSkills() {
  const inventory = document.getElementById('inventory');
  inventory.innerHTML = ''; // Clear previous items

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

    const res = await fetch('src/assets/data/skills.json');
    const data = await res.json();
    const skills = data.skills || [];

    skills.forEach(skill => {
      // Join tags for the data-tags attribute
      const tags = (skill.tags || []).join(',');
      // Create the item element
      const item = document.createElement('div');
      item.className = 'item pop-in'; // Add pop-in class for animation
      item.dataset.tags = tags;

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
      inventory.appendChild(item);

      // Remove pop-in after animation completes (400ms)
      setTimeout(() => item.classList.remove('pop-in'), 400);

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
          const volume = 0.09;
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
  } catch (e) {
    inventory.innerHTML = '<span style="color:#888;">Failed to load skills.</span>';
    console.error('Error loading skills:', e);
  }
}