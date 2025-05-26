document.addEventListener('DOMContentLoaded', () => {
  const welcomeboard = document.querySelector('.welcomeboard');
  const navLinks = document.querySelectorAll('.nav-item[data-page]');
  const mainContent = document.querySelector('.main-content');
  const mainTitle = document.getElementById('main-title');
  const aboutMeModal = document.getElementById('about-me-modal');
  const aboutMeClose = document.getElementById('about-me-close');
  const aboutMeTriggers = document.querySelectorAll('.about-me-trigger');

  
  function setActiveNav(page) {
    navLinks.forEach(link => {
      if (link.dataset.page === page) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Update main title
  function updateMainTitle(label, showBack, backHandler, backIcon = false) {
    // Remove any existing back button
    const oldBack = document.getElementById('main-back-btn');
    if (oldBack) oldBack.remove();

    // Set title text and align left
    mainTitle.textContent = label;
    mainTitle.style.textAlign = 'left';
    mainTitle.style.display = 'inline-block';

    // Insert back button
    if (showBack) {
      const btn = document.createElement('button');
      btn.id = 'main-back-btn';
      btn.className = 'filter';
      btn.style.marginRight = '12px';
      if (backIcon) {
        btn.innerHTML = `<i data-feather="arrow-left"></i>`;
      } else {
        btn.textContent = 'Back';
      }
      btn.onclick = backHandler;

      mainTitle.parentNode.insertBefore(btn, mainTitle);

      if (window.feather) {
        feather.replace();
      }
    }
  }

  // Restore the original title and remove back button
  function restoreMainTitle() {
    updateMainTitle('ELIOGOS', false);
    mainTitle.style.textAlign = 'center';
    mainTitle.style.display = '';
  }

  // Show page content and update title
  function showPage(page) {
    document.querySelectorAll('.page-container').forEach(c => c.remove());
    welcomeboard.style.display = 'none';

    const useIcon = page === 'works' || page === 'links';
    updateMainTitle(
      page.charAt(0).toUpperCase() + page.slice(1),
      true,
      () => {
        welcomeboard.style.display = '';
        setActiveNav('home');
        restoreMainTitle();
        document.querySelectorAll('.page-container').forEach(c => c.remove());
      },
      useIcon
    );

    const container = document.createElement('div');
    container.className = `page-container active ${page}-container`;
    container.innerHTML = `<div class="embedded-content"><p style="color:#aaa;">Embedded ${page} content will go here.</p></div>`;
    mainContent.appendChild(container);
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
    if (show) {
      updateMainTitle('About', true, () => {
        welcomeboard.classList.remove('show-about');
        setActiveNav('home');
        restoreMainTitle();
      });
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
        welcomeboard.classList.remove('show-about');
        setActiveNav('home');
        aboutMeTriggers.forEach(trigger => {
          if (trigger.tagName === 'BUTTON') trigger.textContent = 'Learn More';
          trigger.classList.remove('active');
        });
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

  // Open modal
  aboutMeTriggers.forEach(trigger => {
    trigger.addEventListener('click', e => {
      e.preventDefault();
      aboutMeModal.style.display = 'flex';
      if (window.feather) feather.replace();
    });
  });

  // Close modal on button click
  aboutMeClose.addEventListener('click', () => {
    aboutMeModal.style.display = 'none';
  });

  // Close modal on Backspace key
  document.addEventListener('keydown', e => {
    if (
      aboutMeModal.style.display === 'flex' &&
      e.key === 'Backspace'
    ) {
      e.preventDefault();
      aboutMeModal.style.display = 'none';
    }
  });

  // Attach the same handler to all triggers
  aboutMeTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      toggleAboutMe();
    });
  });
});