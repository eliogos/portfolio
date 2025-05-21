let filterChips;

// --- FILTER ACCORDION LOGIC ---
async function setupFilterAccordion() {
  const filterBtn = document.getElementById('filter-btn');
  filterChips = document.getElementById('filter-chips');

  filterBtn.addEventListener('click', function(e) {
    e.preventDefault();
    filterChips.classList.toggle('open');
    filterBtn.classList.toggle('open'); // For caret rotation
  });

  // Get tags from skills.json
  let skills = [];
  try {
    const res = await fetch('src/assets/data/skills.json');
    const data = await res.json();
    skills = data.skills || [];
  } catch (e) {
    // fallback: no tags
  }
  const tags = Array.from(new Set(skills.flatMap(skill => skill.tags || []))).sort();

  // Add chips
  filterChips.innerHTML = tags.length
    ? tags.map(tag =>
        `<span class="chip" data-tag="${tag}">${tag}</span>`
      ).join('')
    : '<span style="color:#888;">No tags</span>';

  // Chip selection logic
  filterChips.addEventListener('click', e => {
    if (e.target.classList.contains('chip')) {
      e.target.classList.toggle('selected');
      applyTagFilter();
    }
  });
}

// Filtering logic: show only items that match ALL selected tags
function applyTagFilter() {
  const selectedTags = Array.from(filterChips.querySelectorAll('.chip.selected')).map(chip => chip.dataset.tag);
  const items = Array.from(document.querySelectorAll('#inventory .item'));

  // Animate all items out
  items.forEach(item => {
    item.classList.remove('pop-in');
    item.classList.add('pop-out');
  });

  // After pop-out, hide non-matching and animate in matching
  setTimeout(() => {
    items.forEach(item => {
      const itemTags = (item.dataset.tags || '').split(',').map(t => t.trim()).filter(Boolean);
      const matches = selectedTags.every(tag => itemTags.includes(tag)) || selectedTags.length === 0;

      // Hide non-matching
      if (!matches) {
        item.style.display = 'none';
        item.classList.remove('pop-out');
      } else {
        // Show and animate in matching
        item.style.display = '';
        item.classList.remove('pop-out');
        // Force restart animation
        void item.offsetWidth;
        item.classList.add('pop-in');
        setTimeout(() => item.classList.remove('pop-in'), 150);
      }
    });
  }, 150);
}

// --- SORT/VIEW DROPDOWN LOGIC ---
function setupDropdowns() {
  // Only handle .dropdown, not .accordion
  document.querySelectorAll('.dropdown > button').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      // Close other dropdowns
      document.querySelectorAll('.dropdown').forEach(d => {
        if (d !== this.parentElement) d.classList.remove('open');
      });
      this.parentElement.classList.toggle('open');
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
  });

  // Sort dropdown (radio buttons)
  const sortDropdown = document.getElementById('sort-dropdown');
  sortDropdown.innerHTML = `
    <label style="display:block;padding:4px 18px;">
      <input type="radio" name="sort" value="default" checked style="margin-right:8px;">Default
    </label>
    <label style="display:block;padding:4px 18px;">
      <input type="radio" name="sort" value="az" style="margin-right:8px;">A-Z
    </label>
  `;

  // View dropdown (radio buttons)
  const viewDropdown = document.getElementById('view-dropdown');
  viewDropdown.innerHTML = `
    <label style="display:block;padding:4px 18px;">
      <input type="radio" name="view" value="grid" checked style="margin-right:8px;">Grid
    </label>
    <label style="display:block;padding:4px 18px;">
      <input type="radio" name="view" value="list" style="margin-right:8px;">List
    </label>
    <label style="display:block;padding:4px 18px;">
      <input type="radio" name="view" value="table" style="margin-right:8px;">Table
    </label>
  `;
}


setupFilterAccordion();
setupDropdowns();