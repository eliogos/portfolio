async function setupDropdowns() {
  // Open/Close dropdowns
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
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
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

  // Filter dropdown (checkboxes)
  const filterDropdown = document.getElementById('filter-dropdown');
  filterDropdown.innerHTML = tags.length
    ? tags.map(tag =>
        `<label style="display:block;padding:4px 18px;">
          <input type="checkbox" value="${tag}" style="margin-right:8px;">${tag}
        </label>`
      ).join('')
    : '<span style="padding:8px 18px;display:block;color:#888;">No tags</span>';

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

setupDropdowns();