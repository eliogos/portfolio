document.addEventListener('DOMContentLoaded', () => {
  const welcomeboard = document.querySelector('.welcomeboard');
  const aboutMeTriggers = document.querySelectorAll('#about-me-trigger');
  const navLinks = document.querySelectorAll('.nav-item[data-page]');
  const mainContent = document.querySelector('.main-content');

  // Utility to set nav active state
  function setActiveNav(page) {
    navLinks.forEach(link => {
      if (link.dataset.page === page) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Utility to show/hide page containers
  function showPageContainer(page) {
    document.querySelectorAll('.page-container').forEach(c => c.remove());
    welcomeboard.style.display = 'none';

    const container = document.createElement('div');
    container.className = `page-container active ${page}-container`;

    const header = document.createElement('div');
    header.className = 'page-header';
    header.innerHTML = `
      <button class="back-button" type="button">
        <i data-feather="arrow-left"></i>
      </button>
      <span style="font-family:'Tomorrow',sans-serif;font-size:2rem;">${page.charAt(0).toUpperCase() + page.slice(1)}</span>
    `;

    const content = document.createElement('div');
    content.className = 'embedded-content';
    content.innerHTML = `<p style="color:#aaa;">Embedded ${page} content will go here.</p>`;

    container.appendChild(header);
    container.appendChild(content);
    mainContent.appendChild(container);

    if (window.feather) feather.replace();

    header.querySelector('.back-button').addEventListener('click', () => {
      container.remove();
      welcomeboard.style.display = '';
      setActiveNav('home');
      welcomeboard.classList.remove('show-about');
      aboutMeTriggers.forEach(trigger => {
        if (trigger.tagName === 'BUTTON') trigger.textContent = 'Learn More';
        trigger.classList.remove('active');
      });
    });
  }

  // About Me toggle logic (shared by nav and button)
  function toggleAboutMe(forceShow) {
    welcomeboard.style.display = '';
    document.querySelectorAll('.page-container').forEach(c => c.remove());

    const show = typeof forceShow === 'boolean' ? forceShow : !welcomeboard.classList.contains('show-about');
    welcomeboard.classList.toggle('show-about', show);

    // Update both triggers' text and active state
    aboutMeTriggers.forEach(trigger => {
      if (trigger.tagName === 'BUTTON') {
        trigger.textContent = show ? 'Go Back' : 'Learn More';
      }
      trigger.classList.toggle('active', show);
    });

    setActiveNav(show ? 'about' : 'home');
  }

  // Nav click handling
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const page = link.dataset.page;
      if (page === 'home') {
        welcomeboard.style.display = '';
        welcomeboard.classList.remove('show-about');
        setActiveNav('home');
        aboutMeTriggers.forEach(trigger => {
          if (trigger.tagName === 'BUTTON') trigger.textContent = 'Learn More';
          trigger.classList.remove('active');
        });
        document.querySelectorAll('.page-container').forEach(c => c.remove());
      } else if (page === 'about') {
        toggleAboutMe(true);
      } else if (page === 'works' || page === 'links') {
        showPageContainer(page);
        setActiveNav(page);
      }
    });
  });

  // Attach the same handler to all triggers
  aboutMeTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      toggleAboutMe();
    });
  });
});