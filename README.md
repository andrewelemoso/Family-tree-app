# Adesina-Sobowale Family Tree Web App

An interactive, publicly accessible web application that visualizes the multi-generational family tree of the Adesina-Sobowale dynasty from Abeokuta, Nigeria.

## Features

✨ **Interactive Tree Visualization**
- Visual hierarchical representation of all 5 main family branches
- Expandable/collapsible family relationships
- Zoom and pan navigation

🔍 **Search Functionality**
- Search by full name, nicknames, aliases, or details
- Real-time filtering and highlighting
- Quick navigation to specific family members

👤 **Person Details Panel**
- View comprehensive information about each family member
- See spouse and children relationships
- Track data completeness for each record
- Notes and historical information

📊 **Data Integrity**
- Data completeness indicators (color-coded)
- Clear marking of incomplete records
- Distinction between living and deceased members
- Multiple name variants and aliases support

📱 **Responsive Design**
- Works on desktop, tablet, and mobile devices
- Touch-friendly interface
- Adaptive layout for all screen sizes

## Data Structure

The family tree includes:
- **Oluwo Adesina** (Grand Patriarch, ~1850-1900)
- **5 main branches** from Iya Agba Adesina:
  1. Dorcas Olaere Bankole (4 main lines)
  2. Alhaji Amidu Adebodun Sobowale (5 wives, extensive descendants)
  3. Alhaji Lasisi Sobowale
  4. Stephen Olayiwola Sobowale (3 wives, multiple children)
  5. Sikirat Abeni Elemoso

- **400+ family members** documented across generations
- **Durojaiye connection** (related families)

## Project Structure

```
Family tree app/
├── data/
│   └── family-tree.json          # Structured family data
├── styles/
│   └── style.css                 # Complete styling and responsive layout
├── scripts/
│   └── tree.js                   # Interactive tree rendering and search
├── index.html                    # Main application file
├── README.md                     # This file
└── .gitignore                    # Git configuration
```

## How to Use

1. **View the Tree**: Open `index.html` in a web browser
2. **Explore Relationships**: Click on any person's box to view their details
3. **Search**: Use the search bar to find specific family members by name or nickname
4. **View Details**: Use the sidebar to see information, relationships, and data completeness

## Data Completeness

Each person has a "Data Completeness" score:
- **Green (75-100%)**: High-confidence records with full details
- **Yellow (50-74%)**: Moderate data - basic information present
- **Orange (25-49%)**: Limited data - incomplete records
- **Red (<25%)**: Minimal data - only names documented

Records marked with incomplete data include a note inviting family members to contribute missing information.

## Technologies Used

- **HTML5**: Semantic markup and accessibility
- **CSS3**: Responsive design with Flexbox/Grid
- **JavaScript (Vanilla)**: No dependencies - lightweight and fast
- **SVG**: Vector graphics for tree visualization
- **JSON**: Structured data format for family relationships

## Deployment

This app is deployed using **GitHub Pages** for free, public hosting:
1. Repository is automatically deployed from the `main` branch
2. Accessible at: `https://andrewelemoso.github.io/Family-tree-app`
3. Updates are live immediately after pushing changes

## Adding Missing Data

Family members can contribute missing information:
1. Fork the repository
2. Edit `data/family-tree.json` with additional details
3. Submit a pull request with the updates
4. Data will be reviewed and merged

## Known Gaps & TODOs

The document mentions several incomplete sections:
- [ ] Full grandchildren names for Olawumi Browne/Adesina's 8 children
- [ ] Tejumola Sodeinde's grandchildren names
- [ ] Folasade Akibayo's grandchildren names
- [ ] Alhaji Amidu's extended descendants (across 5 wives)
- [ ] Alhaji Lasisi's complete family details
- [ ] Stephen Olayiwola's complete family details

**Help us complete the family tree!** If you have information about these missing connections, please contribute.

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contact & Contributions

- **Original Compiler**: Elemoso Abee
- **Web App Development**: Family volunteers
- **Repository**: https://github.com/andrewelemoso/Family-tree-app

## License

This family history is shared for posterity and collective family knowledge. Please respect the privacy and context of the information shared.

---

**Last Updated**: November 24, 2025

*"Now you know where you belong." - Elemoso Abee*
