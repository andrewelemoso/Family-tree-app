// Family Tree App - Main JavaScript
let familyData = null;
let selectedPerson = null;

// Load data on page load
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('./data/family-tree.json');
    familyData = await response.json();
    
    console.log('Family data loaded:', familyData);
    console.log('Total people:', familyData.people.length);
    
    // Build hierarchical tree structure
    const tree = buildTreeStructure(familyData);
    
    console.log('Tree structure built:', tree);
    
    // Initialize tree visualization
    renderTree(tree);
    
    // Initialize search functionality
    initSearch();
    
  } catch (error) {
    console.error('Error loading family tree data:', error);
    document.getElementById('tree-container').innerHTML = '<p style="padding: 2rem; color: red;">Error loading family tree data: ' + error.message + '</p>';
  }
});

// Build hierarchical tree structure from flat data
function buildTreeStructure(data) {
  const peopleById = {};
  
  // Index all people by ID
  data.people.forEach(person => {
    peopleById[person.id] = {
      ...person,
      children: person.children || []
    };
  });
  
  console.log('Indexed people:', Object.keys(peopleById).length);
  
  // Build tree hierarchy recursively
  function buildNode(personId, visited = new Set()) {
    if (visited.has(personId)) return null; // Prevent infinite loops
    
    const person = peopleById[personId];
    if (!person) {
      console.warn('Person not found:', personId);
      return null;
    }
    
    visited.add(personId);
    
    const node = {
      id: person.id,
      name: person.name,
      data: person,
      children: (person.children || [])
        .map(childId => buildNode(childId, new Set(visited)))
        .filter(n => n !== null)
    };
    
    return node;
  }
  
  // Start with Oluwo Adesina (generation 0, the root)
  const mainRootId = 'oluwo_adesina';
  const mainRoot = peopleById[mainRootId];
  
  if (!mainRoot) {
    console.error('Root person not found:', mainRootId);
    console.error('Available people:', Object.keys(peopleById).slice(0, 10));
    return null;
  }
  
  console.log('Starting tree from:', mainRoot.name);
  const tree = buildNode(mainRootId);
  console.log('Tree built with root:', tree?.name);
  
  return tree;
}

// Render the tree using SVG
function renderTree(data) {
  if (!data) {
    console.error('No tree data to render');
    document.getElementById('tree-container').innerHTML = '<p style="padding: 2rem; color: red;">Error: Could not build family tree structure</p>';
    return;
  }
  
  const container = document.getElementById('tree-container');
  const width = container.clientWidth;
  const height = Math.max(container.clientHeight, 1000);
  
  // Clear existing SVG
  container.innerHTML = '';
  
  // Create SVG
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'tree-svg';
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  
  // Add definitions for marker
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  marker.setAttribute('id', 'arrowhead');
  marker.setAttribute('markerWidth', '10');
  marker.setAttribute('markerHeight', '10');
  marker.setAttribute('refX', '9');
  marker.setAttribute('refY', '3');
  marker.setAttribute('orient', 'auto');
  
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('points', '0 0, 10 3, 0 6');
  polygon.setAttribute('fill', '#bdc3c7');
  marker.appendChild(polygon);
  defs.appendChild(marker);
  svg.appendChild(defs);
  
  // Calculate tree layout
  const nodeWidth = 140;
  const nodeHeight = 70;
  const verticalGap = 120;
  const horizontalGap = 180;
  
  const positions = {};
  let maxX = 0;
  let maxY = 0;
  
  function calculatePositions(node, x, y, siblingIndex, siblingCount) {
    if (!node) return;
    
    positions[node.id] = { x, y };
    maxX = Math.max(maxX, x + nodeWidth);
    maxY = Math.max(maxY, y + nodeHeight);
    
    if (node.children && node.children.length > 0) {
      const totalChildWidth = node.children.length * horizontalGap;
      const startX = x + nodeWidth / 2 - totalChildWidth / 2;
      
      node.children.forEach((child, index) => {
        const childX = startX + index * horizontalGap;
        const childY = y + verticalGap;
        calculatePositions(child, childX, childY, index, node.children.length);
      });
    }
  }
  
  calculatePositions(data, width / 2 - nodeWidth / 2, 50, 0, 1);
  
  // Adjust SVG size
  svg.setAttribute('width', Math.max(maxX + 100, width));
  svg.setAttribute('height', maxY + 100);
  
  // Draw connections (links)
  function drawLinks(node) {
    if (!node || !node.children) return;
    
    node.children.forEach(child => {
      const parentPos = positions[node.id];
      const childPos = positions[child.id];
      
      if (parentPos && childPos) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', parentPos.x + nodeWidth / 2);
        line.setAttribute('y1', parentPos.y + nodeHeight);
        line.setAttribute('x2', childPos.x + nodeWidth / 2);
        line.setAttribute('y2', childPos.y);
        line.setAttribute('class', 'link');
        svg.appendChild(line);
      }
      
      drawLinks(child);
    });
  }
  
  drawLinks(data);
  
  // Draw nodes
  function drawNodes(node) {
    if (!node) return;
    
    const pos = positions[node.id];
    if (!pos) return;
    
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'node');
    group.setAttribute('id', `node-${node.id}`);
    
    // Draw box
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', pos.x);
    rect.setAttribute('y', pos.y);
    rect.setAttribute('width', nodeWidth);
    rect.setAttribute('height', nodeHeight);
    rect.setAttribute('rx', '5');
    rect.setAttribute('class', 'node-box' + 
      (node.data.status === 'deceased' ? ' deceased' : '') +
      (node.data.dataCompleteness < 50 ? ' incomplete' : '')
    );
    
    group.appendChild(rect);
    
    // Draw name text
    const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    nameText.setAttribute('x', pos.x + nodeWidth / 2);
    nameText.setAttribute('y', pos.y + 20);
    nameText.setAttribute('class', 'name');
    nameText.setAttribute('text-anchor', 'middle');
    
    // Wrap long names
    const words = node.name.split(' ');
    let line1 = '';
    let line2 = '';
    
    if (words.length > 2) {
      line1 = words.slice(0, 2).join(' ');
      line2 = words.slice(2).join(' ');
    } else if (words.length === 2) {
      line1 = words[0];
      line2 = words[1];
    } else {
      line1 = node.name;
    }
    
    const tspan1 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    tspan1.setAttribute('x', pos.x + nodeWidth / 2);
    tspan1.setAttribute('dy', '0');
    tspan1.textContent = line1;
    nameText.appendChild(tspan1);
    
    if (line2) {
      const tspan2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan2.setAttribute('x', pos.x + nodeWidth / 2);
      tspan2.setAttribute('dy', '1.2em');
      tspan2.textContent = line2;
      nameText.appendChild(tspan2);
    }
    
    group.appendChild(nameText);
    
    // Add event listeners
    group.addEventListener('click', (e) => {
      e.stopPropagation();
      selectPerson(node.data);
    });
    
    group.addEventListener('mouseenter', () => {
      group.style.zIndex = 100;
    });
    
    svg.appendChild(group);
    
    // Draw child nodes
    if (node.children) {
      node.children.forEach(child => drawNodes(child));
    }
  }
  
  drawNodes(data);
  
  // Add legend
  const legend = document.createElement('div');
  legend.className = 'legend';
  legend.innerHTML = `
    <div class="legend-item">
      <div class="legend-box active"></div>
      <span>Living</span>
    </div>
    <div class="legend-item">
      <div class="legend-box deceased"></div>
      <span>Deceased</span>
    </div>
    <div class="legend-item">
      <div class="legend-box incomplete"></div>
      <span>Incomplete Data</span>
    </div>
  `;
  container.appendChild(legend);
}

// Select a person and show details
function selectPerson(person) {
  selectedPerson = person;
  
  const sidebar = document.querySelector('.sidebar-content');
  let html = `<div class="person-details">`;
  
  html += `<h2>${person.name}</h2>`;
  
  if (person.aliases && person.aliases.length > 0) {
    html += `<div class="person-aliases">${person.aliases.map(a => `"${a}"`).join(', ')}</div>`;
  }
  
  if (person.title) {
    html += `<div class="person-field">
      <label>Title/Role</label>
      <div class="value">${person.title}</div>
    </div>`;
  }
  
  if (person.status) {
    html += `<div class="person-field">
      <div class="status-badge ${person.status}">${person.status.charAt(0).toUpperCase() + person.status.slice(1)}</div>
    </div>`;
  }
  
  if (person.generation !== undefined) {
    html += `<div class="person-field">
      <label>Generation</label>
      <div class="value">${person.generation}</div>
    </div>`;
  }
  
  if (person.origin) {
    html += `<div class="person-field">
      <label>Origin</label>
      <div class="value">${person.origin}</div>
    </div>`;
  }
  
  if (person.religion) {
    html += `<div class="person-field">
      <label>Religion</label>
      <div class="value">${person.religion}</div>
    </div>`;
  }
  
  if (person.period) {
    html += `<div class="person-field">
      <label>Period</label>
      <div class="value">${person.period}</div>
    </div>`;
  }
  
  if (person.notes) {
    html += `<div class="person-field">
      <label>Notes</label>
      <div class="value">${person.notes}</div>
    </div>`;
  }
  
  // Show parents
  if (person.spouse) {
    const spouse = familyData.people.find(p => p.id === person.spouse);
    if (spouse) {
      html += `<div class="relationships-container">
        <h3>Spouse</h3>
        <ul class="relationships-list">
          <li onclick="selectPersonById('${spouse.id}')">${spouse.name}</li>
        </ul>
      </div>`;
    }
  }
  
  // Show children
  if (person.children && person.children.length > 0) {
    const children = person.children.map(id => familyData.people.find(p => p.id === id)).filter(p => p);
    if (children.length > 0) {
      html += `<div class="relationships-container">
        <h3>Children (${children.length})</h3>
        <ul class="relationships-list">
          ${children.map(child => `
            <li onclick="selectPersonById('${child.id}')">
              ${child.name}
              <div class="relationship-type">${child.title || 'Child'}</div>
            </li>
          `).join('')}
        </ul>
      </div>`;
    }
  }
  
  // Data completeness
  html += `<div class="completeness-bar">
    <div class="completeness-label">
      <span>Data Completeness</span>
      <span>${person.dataCompleteness}%</span>
    </div>
    <div class="completeness-track">
      <div class="completeness-fill" style="width: ${person.dataCompleteness}%"></div>
    </div>
  </div>`;
  
  if (person.dataCompleteness < 50) {
    html += `<div style="margin-top: 0.8rem; font-size: 0.85rem; opacity: 0.8; padding-top: 0.8rem; border-top: 1px solid rgba(255,255,255,0.2);">
      ⚠️ This record has incomplete data. If you have additional information, please help us improve this family tree!
    </div>`;
  }
  
  html += `</div>`;
  
  sidebar.innerHTML = html;
  
  // Highlight selected node
  document.querySelectorAll('.node-box').forEach(box => {
    box.style.stroke = 'var(--primary)';
    box.style.strokeWidth = '2px';
  });
  
  const selectedNode = document.getElementById(`node-${person.id}`);
  if (selectedNode) {
    const box = selectedNode.querySelector('.node-box');
    box.style.stroke = '#3498db';
    box.style.strokeWidth = '3px';
  }
}

function selectPersonById(personId) {
  const person = familyData.people.find(p => p.id === personId);
  if (person) {
    selectPerson(person);
  }
}

// Initialize search functionality
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const resultsCount = document.getElementById('results-count');
  
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    if (!query) {
      resultsCount.textContent = '';
      document.querySelectorAll('.node').forEach(node => {
        node.style.opacity = '1';
      });
      return;
    }
    
    // Search through people
    const results = familyData.people.filter(person => {
      const nameMatch = person.name.toLowerCase().includes(query);
      const aliasMatch = person.aliases && person.aliases.some(a => a.toLowerCase().includes(query));
      const notesMatch = person.notes && person.notes.toLowerCase().includes(query);
      
      return nameMatch || aliasMatch || notesMatch;
    });
    
    // Update results count
    resultsCount.textContent = `${results.length} result${results.length !== 1 ? 's' : ''}`;
    
    // Highlight matching nodes
    const matchIds = new Set(results.map(p => p.id));
    document.querySelectorAll('.node').forEach(node => {
      const personId = node.id.replace('node-', '');
      if (matchIds.has(personId)) {
        node.style.opacity = '1';
        node.querySelector('.node-box').style.fill = '#fef5e7';
      } else {
        node.style.opacity = '0.3';
      }
    });
    
    // Select first result if available
    if (results.length > 0) {
      selectPerson(results[0]);
    }
  });
}
