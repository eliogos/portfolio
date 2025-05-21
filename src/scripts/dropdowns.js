let filterChips;

// --- FILTER ACCORDION LOGIC ---
async function setupFilterAccordion() {
  const filterBtn = document.getElementById('filter-btn');
  filterChips = document.getElementById('filter-chips');
  const chipGroup = filterChips.querySelector('.chip-group'); // Target the chip group

  // Toggle the filter accordion open/close
  filterBtn.addEventListener('click', function (e) {
    e.preventDefault();
    filterChips.classList.toggle('open');
    filterBtn.classList.toggle('open'); // Caret rotation
  });

  // Fetch tags from skills.json
  let skills = [];
  try {
    const res = await fetch('src/assets/data/skills.json');
    const data = await res.json();
    skills = data.skills || [];
  } catch (e) {
    // If there's an error, fallback to no tags
  }
  const tags = Array.from(new Set(skills.flatMap(skill => skill.tags || []))).sort();

  // Add chips dynamically to the chip group
  chipGroup.innerHTML = tags.length
    ? tags
        .map(
          tag =>
            `<span class="chip" data-tag="${tag}">${tag}</span>`
        )
        .join('')
    : '<span style="color:#888;">No tags</span>';


  chipGroup.addEventListener('mouseover', e => {
  if (e.target.classList.contains('chip')) {
    // 10% chance for 720-degree spin
    if (Math.random() < 0.1) {
      e.target.style.setProperty('--chipRotate', '720deg');
    } else {
      // Otherwise random rotation between -5 and 5 degrees
      const randomRotation = Math.floor(Math.random() * 11) - 5;
      e.target.style.setProperty('--chipRotate', `${randomRotation}deg`);
    }
  }
});

  // Handle chip selection
  chipGroup.addEventListener('click', e => {
    if (e.target.classList.contains('chip')) {
      const isShiftPressed = e.shiftKey;
      const isMobileLongPress = e.type === 'mousedown' && e.detail > 1;

      if (!isShiftPressed && !isMobileLongPress) {
        // If the clicked chip is already selected, deselect it and return
        if (e.target.classList.contains('selected')) {
          e.target.classList.remove('selected');
          applyTagFilter();
          return;
        }

        // Otherwise, deselect all other chips
        chipGroup.querySelectorAll('.chip.selected').forEach(chip => {
          chip.classList.remove('selected');
        });
      }

      // Toggle the clicked chip
      e.target.classList.toggle('selected');
      applyTagFilter();
    }
  });

  // Long press detection for mobile (to simulate multi-select)
  let longPressTimer;
  chipGroup.addEventListener('mousedown', e => {
    if (e.target.classList.contains('chip')) {
      longPressTimer = setTimeout(() => {
        e.target.dispatchEvent(new MouseEvent('click', { bubbles: true, shiftKey: true }));
      }, 500); // Long press duration (500ms)
    }
  });
  chipGroup.addEventListener('mouseup', () => clearTimeout(longPressTimer));
  chipGroup.addEventListener('mouseleave', () => clearTimeout(longPressTimer));
}

// Filtering logic: Only show items that match ALL selected tags
function applyTagFilter() {
  const selectedTags = Array.from(filterChips.querySelectorAll('.chip.selected')).map(chip => chip.dataset.tag);
  const inventory = document.getElementById('inventory');
  const items = Array.from(document.querySelectorAll('#inventory .item'));

  // Animate all items out first
  items.forEach(item => {
    item.classList.remove('pop-in');
    item.classList.add('pop-out');
  });

  // After pop-out animation, update the grid and show/hide items
  setTimeout(() => {
    if (selectedTags.length > 0) {
      inventory.classList.add('filtered'); // Adjust grid for filtered view
    } else {
      inventory.classList.remove('filtered'); // Reset grid to default
    }

    // Show/hide and animate in matching items
    items.forEach(item => {
      const itemTags = (item.dataset.tags || '').split(',').map(t => t.trim()).filter(Boolean);
      const matches = selectedTags.every(tag => itemTags.includes(tag)) || selectedTags.length === 0;

      if (!matches) {
        item.style.display = 'none';
        item.classList.remove('pop-out');
      } else {
        item.style.display = '';
        item.classList.remove('pop-out');
        // Force reflow to restart animation
        void item.offsetWidth;
        item.classList.add('pop-in');
        setTimeout(() => item.classList.remove('pop-in'), 250); // Duration of pop-in animation
      }
    });
  }, 250); // Duration of pop-out animation
}

// --- SORT/VIEW DROPDOWN LOGIC ---
function setupDropdowns() {
  // Handle dropdown open/close
  document.querySelectorAll('.dropdown > button').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      // Close other dropdowns
      document.querySelectorAll('.dropdown').forEach(d => {
        if (d !== this.parentElement) d.classList.remove('open');
      });
      this.parentElement.classList.toggle('open');
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
  });

  // Populate sort dropdown
  const sortDropdown = document.getElementById('sort-dropdown');
  sortDropdown.innerHTML = `
    <label style="display:block;padding:4px 18px;">
      <input type="radio" name="sort" value="default" checked style="margin-right:8px;">Default
    </label>
    <label style="display:block;padding:4px 18px;">
      <input type="radio" name="sort" value="az" style="margin-right:8px;">A-Z
    </label>
    <label style="display:block;padding:4px 18px;">
      <input type="radio" name="sort" value="tags" style="margin-right:8px;">Tags
    </label>
  `;

  // Handle sort changes
  sortDropdown.addEventListener('change', e => {
    if (e.target.name === 'sort') {
      applySort(e.target.value);
    }
  });
}

function applySort(sortType) {
  const inventory = document.getElementById('inventory');
  const items = Array.from(inventory.querySelectorAll('.item'));

  let sortedItems;

  switch (sortType) {
    case 'az': // Sort alphabetically (A-Z)
      sortedItems = items.sort((a, b) => a.textContent.localeCompare(b.textContent));
      break;

    case 'tags': // Sort by the number of tags (ascending)
      sortedItems = items.sort((a, b) => {
        const aTags = (a.dataset.tags || '').split(',').length;
        const bTags = (b.dataset.tags || '').split(',').length;
        return aTags - bTags;
      });
      break;

    default: // Default order (reset to original)
      sortedItems = items.sort((a, b) => a.dataset.index - b.dataset.index);
      break;
  }

  // Clear and re-append sorted items to the inventory container
  sortedItems.forEach(item => inventory.appendChild(item));
}


// Initialize filter accordion and dropdowns
setupFilterAccordion();
setupDropdowns();