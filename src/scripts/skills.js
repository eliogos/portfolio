export async function loadSkills() {
  try {
    const response = await fetch('src/assets/skills.json');
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

      // Bouncy animation on hover
      item.addEventListener('mouseenter', () => {
        tooltip.classList.remove('wipe-exit');
        tooltip.classList.remove('rise-up-in');

        void tooltip.offsetWidth;
        tooltip.classList.add('rise-up-in');
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
      });
      item.addEventListener('mouseleave', () => {
        tooltip.classList.add('wipe-exit');
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
      p.textContent = "Cannot load skills";
      container.appendChild(p);
    }
    console.error('Error loading skills:', error);
  }
}