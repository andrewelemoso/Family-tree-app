// ========================================
// FAMILY TREE VISUALIZER - FIXED
// Visual tree display with proper rendering
// ========================================

async function loadFamilyTree() {
  try {
    const response = await fetch('./data/family-tree.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    console.log('Family data loaded:', data.members.length, 'members');
    renderTree(data);
  } catch (error) {
    console.error('Error loading family tree:', error);
    document.getElementById('tree-container').innerHTML = 
      '<p style="color: #2ecc71; font-size: 1.1rem;">Error loading family tree. Check console.</p>';
  }
}

function renderTree(familyData) {
  try {
    const container = document.getElementById('tree-container');
    
    // Build the tree structure
    const treeStructure = buildTreeStructure(familyData);
    
    if (!treeStructure) {
      console.error('Failed to build tree structure - root is null');
      container.innerHTML = '<p>Error: Could not build family tree</p>';
      return;
    }
    
    console.log('Tree structure built, root:', treeStructure.name);
    
    // Calculate dimensions
    const nodeWidth = 150;
    const nodeHeight = 60;
    const xSpacing = 180;
    const ySpacing = 120;
    
    // Calculate all positions
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    const positions = new Map();
    
    function calculatePositions(node, x, y, siblingIndex, totalSiblings, generation) {
      if (!node) return;
      
      const siblingOffset = totalSiblings > 1 ? (totalSiblings - 1) * xSpacing / 2 : 0;
      const nodeX = x + siblingIndex * xSpacing - siblingOffset;
      const nodeY = y;
      
      positions.set(node.id, { x: nodeX, y: nodeY, generation });
      
      minX = Math.min(minX, nodeX);
      maxX = Math.max(maxX, nodeX);
      minY = Math.min(minY, nodeY);
      maxY = Math.max(maxY, nodeY);
      
      if (node.children && node.children.length > 0) {
        node.children.forEach((child, index) => {
          calculatePositions(child, nodeX, nodeY + ySpacing, index, node.children.length, generation + 1);
        });
      }
    }
    
    calculatePositions(treeStructure, 0, 0, 0, 1, 0);
    
    console.log('Positions calculated. Total nodes:', positions.size);
    
    // Add padding
    const padding = 60;
    const width = maxX - minX + nodeWidth + padding * 2;
    const height = maxY - minY + nodeHeight + padding * 2;
    
    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.style.display = 'block';
    
    // Calculate viewBox offset
    const viewBoxX = minX - nodeWidth / 2 - padding;
    const viewBoxY = minY - nodeHeight / 2 - padding;
    svg.setAttribute('viewBox', `${viewBoxX} ${viewBoxY} ${width} ${height}`);
    svg.style.overflow = 'visible';
    svg.style.maxWidth = '100%';
    svg.style.height = 'auto';
    
    // Draw connections (lines)
    drawConnections(treeStructure, positions, svg);
    
    // Draw nodes
    drawNodes(treeStructure, positions, svg);
    
    // Clear and append
    container.innerHTML = '';
    container.appendChild(svg);
    
    console.log('Tree rendered successfully');
  } catch (error) {
    console.error('Error in renderTree:', error);
    document.getElementById('tree-container').innerHTML = 
      '<p style="color: #e74c3c;">Error rendering tree: ' + error.message + '</p>';
  }
}

function buildTreeStructure(familyData) {
  const people = familyData.people || familyData.members || [];
  console.log('buildTreeStructure: Found', people.length, 'people');
  
  if (!people || people.length === 0) {
    console.error('No people/members in family data');
    return null;
  }
  
  // Create member map
  const memberMap = new Map();
  people.forEach(member => {
    memberMap.set(member.id, {
      ...member,
      children: []  // Will populate after map is complete
    });
  });
  
  console.log('Created memberMap with', memberMap.size, 'members');
  
  // Build relationships using the children arrays already in the data
  let root = null;
  
  memberMap.forEach((member, memberId) => {
    // Get original member to access their children IDs
    const originalMember = people.find(p => p.id === memberId);
    
    if (originalMember && originalMember.children && originalMember.children.length > 0) {
      // Replace child IDs with actual child objects from the map
      member.children = originalMember.children
        .map(childId => memberMap.get(childId))
        .filter(child => child !== undefined);
      console.log('Member', memberId, 'has', member.children.length, 'children');
    }
    
    // Find root node (generation 0, no spouse)
    if (!root && member.generation === 0 && !member.spouse) {
      root = member;
      console.log('Found root:', root.name);
    }
  });
  
  // Fallback: if no root found, pick first generation 0
  if (!root) {
    const firstGen0 = Array.from(memberMap.values()).find(m => m.generation === 0);
    if (firstGen0) {
      root = firstGen0;
      console.log('Using fallback root:', root.name);
    }
  }
  
  console.log('Final root:', root ? root.name : 'NONE');
  return root;
}

function drawConnections(node, positions, svg) {
  if (!node || !node.children || node.children.length === 0) return;
  
  const nodePos = positions.get(node.id);
  if (!nodePos) return;
  
  const childPositions = node.children
    .map(child => ({ child, pos: positions.get(child.id) }))
    .filter(item => item.pos !== undefined);
  
  if (childPositions.length === 0) return;
  
  const minChildX = Math.min(...childPositions.map(item => item.pos.x));
  const maxChildX = Math.max(...childPositions.map(item => item.pos.x));
  const childY = childPositions[0].pos.y;
  
  // Vertical line from parent
  const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line1.setAttribute('x1', nodePos.x);
  line1.setAttribute('y1', nodePos.y + 30);
  line1.setAttribute('x2', nodePos.x);
  line1.setAttribute('y2', childY - 30);
  line1.setAttribute('class', 'tree-link');
  svg.appendChild(line1);
  
  // Horizontal line connecting children
  if (childPositions.length > 1) {
    const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line2.setAttribute('x1', minChildX);
    line2.setAttribute('y1', childY - 30);
    line2.setAttribute('x2', maxChildX);
    line2.setAttribute('y2', childY - 30);
    line2.setAttribute('class', 'tree-link');
    svg.appendChild(line2);
    
    // Lines from horizontal to each child
    childPositions.forEach(item => {
      const line3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line3.setAttribute('x1', item.pos.x);
      line3.setAttribute('y1', childY - 30);
      line3.setAttribute('x2', item.pos.x);
      line3.setAttribute('y2', childY - 30);
      line3.setAttribute('class', 'tree-link');
      svg.appendChild(line3);
    });
  } else if (childPositions.length === 1) {
    // Single child - just connect directly
    const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line2.setAttribute('x1', childPositions[0].pos.x);
    line2.setAttribute('y1', childY - 30);
    line2.setAttribute('x2', childPositions[0].pos.x);
    line2.setAttribute('y2', childY - 30);
    line2.setAttribute('class', 'tree-link');
    svg.appendChild(line2);
  }
  
  // Recursively draw for children
  node.children.forEach(child => {
    drawConnections(child, positions, svg);
  });
}

function drawNodes(node, positions, svg) {
  if (!node) return;
  
  const pos = positions.get(node.id);
  if (!pos) return;
  
  const nodeWidth = 150;
  const nodeHeight = 60;
  const x = pos.x - nodeWidth / 2;
  const y = pos.y - nodeHeight / 2;
  
  // Create node group
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('class', `tree-node generation-${Math.min(pos.generation, 5)}`);
  g.setAttribute('data-id', node.id);
  
  // Background rectangle
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', x);
  rect.setAttribute('y', y);
  rect.setAttribute('width', nodeWidth);
  rect.setAttribute('height', nodeHeight);
  g.appendChild(rect);
  
  // Display name
  const displayName = (node.nickname || node.name || 'Unknown').substring(0, 18);
  
  // Text
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', pos.x);
  text.setAttribute('y', pos.y);
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('dy', '.35em');
  text.textContent = displayName;
  g.appendChild(text);
  
  svg.appendChild(g);
  
  // Draw children
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      drawNodes(child, positions, svg);
    });
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadFamilyTree);
} else {
  loadFamilyTree();
}

