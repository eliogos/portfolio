function initializeSettings() {
  const modal = document.querySelector('.modal-overlay');
  const modalCard = document.querySelector('.settings-modal');

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  modalCard.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  // ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
    }
  });

  // Theme toggle
  document.getElementById('switch-theme').addEventListener('change', (e) => {
    document.body.classList.toggle('light-theme', e.target.checked);
    localStorage.setItem('theme', e.target.checked);
  });

  // Basic font toggle
  document.getElementById('use-basic-font').addEventListener('change', (e) => {
    document.body.classList.toggle('basic-font', e.target.checked);
    localStorage.setItem('basicFont', e.target.checked);
  });

  // Header texture toggle
  document.getElementById('disable-header-texture').addEventListener('change', (e) => {
    document.body.classList.toggle('disable-header-texture', e.target.checked);
    localStorage.setItem('headerTexture', e.target.checked);
  });

  // Animation toggle
  document.getElementById('disable-animations').addEventListener('change', (e) => {
    document.body.classList.toggle('disable-animations', e.target.checked);
    const animate = document.querySelector('#distort feTurbulence animate');
    animate.setAttribute('dur', e.target.checked ? '0s' : '30s');
    localStorage.setItem('animations', e.target.checked);
  });

  // Distortion toggle
  document.getElementById('disable-distortion').addEventListener('change', (e) => {
    document.body.classList.toggle('disable-distortion', e.target.checked);
    localStorage.setItem('distortion', e.target.checked);
  });

  // Volume slider
  const volumeSlider = document.getElementById('volume');
  const volumeValue = volumeSlider.nextElementSibling;
  
  volumeSlider.addEventListener('input', (e) => {
    const value = e.target.value;
    volumeValue.textContent = value == 0 ? 'OFF' : `${value * 100}%`;
    localStorage.setItem('volume', value);
  });

  // Texture opacity slider
  const opacitySlider = document.getElementById('texture-opacity');
  const opacityValue = opacitySlider.nextElementSibling;
  
  opacitySlider.addEventListener('input', (e) => {
    const value = e.target.value;
    document.documentElement.style.setProperty('--texture-opacity', value);
    opacityValue.textContent = value == 0 ? 'OFF' : `${value * 100}%`;
    document.body.classList.toggle('disable-texture', value == 0);
    localStorage.setItem('textureOpacity', value);
  });

  // Background blur slider
  const blurSlider = document.getElementById('blur-amount');
  const blurValue = blurSlider.nextElementSibling;
  
  blurSlider.addEventListener('input', (e) => {
    const value = e.target.value;
    document.documentElement.style.setProperty('--backdrop-blur', `${value}px`);
    blurValue.textContent = value == 0 ? 'OFF' : `${value * 10}%`;
    localStorage.setItem('blurAmount', value);
  });

  // Load all saved settings
  const savedSettings = {
    theme: localStorage.getItem('theme') === 'true',
    basicFont: localStorage.getItem('basicFont') === 'true',
    blurAmount: localStorage.getItem('blurAmount') || '10',
    headerTexture: localStorage.getItem('headerTexture') === 'true',
    animations: localStorage.getItem('animations') === 'true',
    distortion: localStorage.getItem('distortion') === 'true',
    volume: localStorage.getItem('volume') || '0.5',
    textureOpacity: localStorage.getItem('textureOpacity') || '0.1'
  };

  // Apply saved settings
  document.getElementById('switch-theme').checked = savedSettings.theme;
  document.getElementById('use-basic-font').checked = savedSettings.basicFont;
  document.getElementById('blur-amount').value = savedSettings.blurAmount;
  document.getElementById('disable-header-texture').checked = savedSettings.headerTexture;
  document.getElementById('disable-animations').checked = savedSettings.animations;
  document.getElementById('disable-distortion').checked = savedSettings.distortion;
  document.getElementById('volume').value = savedSettings.volume;
  document.getElementById('texture-opacity').value = savedSettings.textureOpacity;

  // Apply states
  document.body.classList.toggle('light-theme', savedSettings.theme);
  document.body.classList.toggle('basic-font', savedSettings.basicFont);
  document.documentElement.style.setProperty('--backdrop-blur', `${savedSettings.blurAmount}px`);
  document.body.classList.toggle('disable-header-texture', savedSettings.headerTexture);
  document.body.classList.toggle('disable-animations', savedSettings.animations);
  document.body.classList.toggle('disable-distortion', savedSettings.distortion);
  document.body.classList.toggle('disable-texture', savedSettings.textureOpacity == 0);
  document.documentElement.style.setProperty('--texture-opacity', savedSettings.textureOpacity);

  // Update displayed values
  blurValue.textContent = savedSettings.blurAmount == 0 ? 'OFF' : `${savedSettings.blurAmount * 10}%`;
  volumeValue.textContent = savedSettings.volume == 0 ? 'OFF' : `${savedSettings.volume * 100}%`;
  opacityValue.textContent = savedSettings.textureOpacity == 0 ? 'OFF' : `${savedSettings.textureOpacity * 100}%`;

  // Update animation state if needed
  if (savedSettings.animations) {
    const animate = document.querySelector('#distort feTurbulence animate');
    animate.setAttribute('dur', '0s');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initializeSettings();

  const aboutMeBtn = document.getElementById('about-me-btn');
  const welcomeboard = document.querySelector('.welcomeboard');
  
  aboutMeBtn.addEventListener('click', () => {
    welcomeboard.classList.toggle('show-about');
    aboutMeBtn.textContent = welcomeboard.classList.contains('show-about') ? 'Go Back' : 'Learn More';
  });
});

function toggleAnimations(disable) {
  const animate = document.querySelector('#distort feTurbulence animate');
  console.log('Animation disabled:', disable, animate);
  if (disable) {
    animate.setAttribute('dur', '0s');
    animate.setAttribute('values', '0.00 0.00');
    animate.setAttribute('repeatCount', '0');
  } else {
    animate.setAttribute('dur', '30s');
    animate.setAttribute('values', '0.01 0.01;0.02 0.02;0.01 0.01');
    animate.setAttribute('repeatCount', 'indefinite');
  }
}