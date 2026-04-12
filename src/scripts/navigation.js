document.addEventListener('DOMContentLoaded', () => {
  const welcomeboard = document.querySelector('.welcomeboard');
  const navLinks = document.querySelectorAll('.nav-item[data-page]');
  const mainContent = document.querySelector('.main-content');
  const mainTitle = document.getElementById('main-title');
  const aboutMeTriggers = document.querySelectorAll('.about-me-trigger');

  function setActiveNav(page) {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.page === page);
    });
  }

  function updateMainTitle(label, showBack, backHandler, backIcon = false) {
    const oldBack = document.getElementById('main-back-btn');
    if (oldBack) oldBack.remove();

    mainTitle.textContent = label;
    mainTitle.style.textAlign = 'left';
    mainTitle.style.display = 'inline-block';

    if (showBack) {
      const btn = document.createElement('button');
      btn.id = 'main-back-btn';
      btn.className = 'filter';
      btn.style.marginRight = '12px';
      btn.innerHTML = backIcon ? `<i data-feather="arrow-left"></i>` : 'Back';
      btn.onclick = backHandler;
      mainTitle.parentNode.insertBefore(btn, mainTitle);
      if (window.feather) feather.replace();
    }
  }

  function restoreMainTitle() {
    updateMainTitle('ELIOGOS', false);
    mainTitle.style.textAlign = 'center';
    mainTitle.style.display = '';
  }

  function showPage(page) {
    document.querySelectorAll('.page-container').forEach(c => c.remove());
    welcomeboard.style.display = 'none';

    updateMainTitle(
      page.charAt(0).toUpperCase() + page.slice(1),
      true,
      () => {
        welcomeboard.style.display = '';
        setActiveNav('home');
        restoreMainTitle();
        document.querySelectorAll('.page-container').forEach(c => c.remove());
      },
      true
    );

    const container = document.createElement('div');
    container.className = `page-container active ${page}-container`;
    container.innerHTML = `<div class="embedded-content"><p style="color:#aaa;">Embedded ${page} content will go here.</p></div>`;
    mainContent.appendChild(container);
  }

  // About Me toggle — single, clean implementation
  function toggleAboutMe(forceShow) {
    // Always restore the welcomeboard when toggling About Me
    welcomeboard.style.display = '';
    document.querySelectorAll('.page-container').forEach(c => c.remove());

    const isCurrentlyShown = welcomeboard.classList.contains('show-about');
    const show = typeof forceShow === 'boolean' ? forceShow : !isCurrentlyShown;

    welcomeboard.classList.toggle('show-about', show);

    // Sync button text and active state across all triggers
    aboutMeTriggers.forEach(trigger => {
      if (trigger.tagName === 'BUTTON') {
        trigger.textContent = show ? 'Go Back' : 'Learn More';
      }
      trigger.classList.toggle('active', show);
    });

    setActiveNav(show ? 'about' : 'home');

    if (show) {
      updateMainTitle('About', true, () => {
        toggleAboutMe(false);
      }, false);
    } else {
      restoreMainTitle();
    }
  }

  // Nav click handling
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const page = link.dataset.page;

      if (page === 'home') {
        welcomeboard.style.display = '';
        toggleAboutMe(false);
        setActiveNav('home');
        document.querySelectorAll('.page-container').forEach(c => c.remove());
        restoreMainTitle();
      } else if (page === 'about') {
        toggleAboutMe(true);
      } else if (page === 'works' || page === 'links') {
        showPage(page);
        setActiveNav(page);
      }
    });
  });

  // About Me button/trigger — single handler, no modal
  aboutMeTriggers.forEach(trigger => {
    trigger.addEventListener('click', e => {
      e.preventDefault();
      toggleAboutMe();
    });
  });
});
