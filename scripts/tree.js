// ========================================
// FAMILY TREE VISUALIZER - SIMPLIFIED
// Visual tree display only, no interactions
// ========================================

async function loadFamilyTree() {
  try {
    const response = await fetch('./data/family-tree.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    renderTree(data);
  } catch (error) {
    console.error('Error loading family tree:', error);
    document.getElementById('tree-container').innerHTML = 
      '<p style="color: #e74c3c; font-size: 1.1rem;">Error loading family tree. Please check console.</p>';
  }
}

function renderTree(familyData) {
  const container = document.getElementById('tree-container');
  
  // Build the tree structure
  const treeStructure = buildTreeStructure(familyData);
  
  // Calculate dimensions
  const nodeWidth = 140;
  const nodeHeight = 50;
  const xSpacing = 160;
  const ySpacing = 100;
  
  // Calculate bounding box
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  
  const positions = new Map();
  
  function calculatePositions(node, x, y, siblingIndex, totalSiblings) {
    const siblingOffset = (totalSiblings - 1) * xSpacing / 2;
    const nodeX = x + siblingIndex * xSpacing - siblingOffset;
    const nodeY = y;
    
    positions.set(node.id, { x: nodeX, y: nodeY });
    
    minX = Math.min(minX, nodeX - nodeWidth / 2);
    maxX = Math.max(maxX, nodeX + nodeWidth / 2);
    minY = Math.min(minY, nodeY - nodeHeight / 2);
    maxY = Math.max(maxY, nodeY + nodeHeight / 2);
    
    if (node.children && node.children.length > 0) {
      node.children.forEach((child, index) => {
        calculatePositions(child, nodeX, nodeY + ySpacing, index, node.children.length);
      });
    }
  }
  
  // Start from root, centered at 0, 0
  if (treeStructure) {
    calculatePositions(treeStructure, 0, 0, 0, 1);
  }
  
  // Add padding
  const padding = 50;
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;
  
  // Create SVG
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('viewBox', `${minX - padding} ${minY - padding} ${width} ${height}`);
  svg.style.overflow = 'visible';
  
  // Draw connections first (so they appear behind nodes)
  if (treeStructure) {
    drawConnections(treeStructure, positions, svg);
  }
  
  // Draw nodes
  if (treeStructure) {
    drawNodes(treeStructure, positions, svg, 0);
  }
  
  container.innerHTML = '';
  container.appendChild(svg);
}

function buildTreeStructure(familyData) {
  if (!familyData.members || familyData.members.length === 0) {
    console.error('No members found in family data');
    return null;
  }
  
  // Create a map of all members by ID
  const memberMap = new Map();
  familyData.members.forEach(member => {
    memberMap.set(member.id, { ...member, children: [] });
  });
  
  // Build parent-child relationships
  let root = null;
  memberMap.forEach(member => {
    if (member.parents && member.parents.length > 0) {
      const parentId = member.parents[0]; // Use first parent as reference
      const parent = memberMap.get(parentId);
      if (parent) {
        parent.children.push(member);
      }
    } else {
      // This is a root node (no parents)
      if (!root || member.generation === 0) {
        root = member;
      }
    }
  });
  
  return root;
}

function drawConnections(node, positions, svg) {
  const nodePos = positions.get(node.id);
  if (!nodePos) return;
  
  if (node.children && node.children.length > 0) {
    // Calculate middle point where lines meet
    const childPositions = node.children
      .map(child => positions.get(child.id))
      .filter(pos => pos !== undefined);
    
    if (childPositions.length === 0) return;
    
    const minChildX = Math.min(...childPositions.map(p => p.x));
    const maxChildX = Math.max(...childPositions.map(p => p.x));
    const childY = childPositions[0].y;
    const midX = (minChildX + maxChildX) / 2;
    
    // Vertical line from parent down
    const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line1.setAttribute('x1', nodePos.x);
    line1.setAttribute('y1', nodePos.y + 25);
    line1.setAttribute('x2', nodePos.x);
    line1.setAttribute('y2', childY - 25);
    line1.setAttribute('class', 'tree-link');
    svg.appendChild(line1);
    
    // Horizontal line connecting children
    const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line2.setAttribute('x1', minChildX);
    line2.setAttribute('y1', childY - 25);
    line2.setAttribute('x2', maxChildX);
    line2.setAttribute('y2', childY - 25);
    line2.setAttribute('class', 'tree-link');
    svg.appendChild(line2);
    
    // Lines from horizontal line to each child
    childPositions.forEach((childPos) => {
      const line3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line3.setAttribute('x1', childPos.x);
      line3.setAttribute('y1', childY - 25);
      line3.setAttribute('x2', childPos.x);
      line3.setAttribute('y2', childY - 25);
      line3.setAttribute('class', 'tree-link');
      svg.appendChild(line3);
    });
    
    // Recursively draw connections for children
    node.children.forEach(child => {
      drawConnections(child, positions, svg);
    });
  }
}

function drawNodes(node, positions, svg, generation) {
  const pos = positions.get(node.id);
  if (!pos) return;
  
  const nodeWidth = 140;
  const nodeHeight = 50;
  const x = pos.x - nodeWidth / 2;
  const y = pos.y - nodeHeight / 2;
  
  // Create group for node
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('class', `tree-node generation-${Math.min(generation, 5)}`);
  g.setAttribute('data-id', node.id);
  
  // Background rectangle
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', x);
  rect.setAttribute('y', y);
  rect.setAttribute('width', nodeWidth);
  rect.setAttribute('height', nodeHeight);
  g.appendChild(rect);
  
  // Text
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', pos.x);
  text.setAttribute('y', pos.y + 5);
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('dy', '.3em');
  
  // Get display name
  const displayName = node.nickname || node.name || 'Unknown';
  text.textContent = displayName.substring(0, 16);
  
  g.appendChild(text);
  svg.appendChild(g);
  
  // Draw children
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      drawNodes(child, positions, svg, generation + 1);
    });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadFamilyTree);

