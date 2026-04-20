import { useState } from 'react';
import { elements, categories } from '../data/elements';
import './PeriodicTable.css';

export default function PeriodicTable() {
  const [selectedElement, setSelectedElement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const getElementPosition = (element) => {
    if (element.category === 'lanthanide' || element.category === 'actinide') {
      return { row: element.period + 2, col: element.number === 57 || element.number === 89 ? 3 : (element.number - (element.category === 'lanthanide' ? 57 : 88)) + 2 };
    }
    return { row: element.period, col: element.group };
  };

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.name === category);
    return cat ? cat.color : '#ccc';
  };

  const filteredElements = elements.filter(el => {
    const matchesSearch = el.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     el.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     el.number.toString().includes(searchTerm);
    const matchesCategory = !filterCategory || el.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleElementClick = (element) => {
    setSelectedElement(element);
  };

  return (
    <div className="periodic-table-container">
      <div className="controls">
        <input
          type="text"
          placeholder="Search elements..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.name} value={cat.name}>{cat.label}</option>
          ))}
        </select>
      </div>

      <div className="periodic-table">
        {elements.map(element => {
          const pos = getElementPosition(element);
          const isFiltered = filteredElements.includes(element);
          const isSelected = selectedElement?.number === element.number;

          return (
            <div
              key={element.number}
              className={`element ${isFiltered ? '' : 'dimmed'} ${isSelected ? 'selected' : ''}`}
              style={{
                gridRow: pos.row,
                gridColumn: pos.col,
                backgroundColor: getCategoryColor(element.category),
              }}
              onClick={() => handleElementClick(element)}
              title={element.name}
            >
              <span className="atomic-number">{element.number}</span>
              <span className="symbol">{element.symbol}</span>
            </div>
          );
        })}
      </div>

      <div className="legend">
        {categories.map(cat => (
          <div key={cat.name} className="legend-item">
            <div className="legend-color" style={{ backgroundColor: cat.color }}></div>
            <span>{cat.label}</span>
          </div>
        ))}
      </div>

      {selectedElement && (
        <div className="element-detail" onClick={() => setSelectedElement(null)}>
          <div className="element-detail-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedElement(null)}>×</button>
            <div className="detail-header" style={{ backgroundColor: getCategoryColor(selectedElement.category) }}>
              <span className="detail-number">{selectedElement.number}</span>
              <span className="detail-symbol">{selectedElement.symbol}</span>
              <span className="detail-name">{selectedElement.name}</span>
            </div>
            <div className="detail-body">
              <div className="detail-row">
                <span className="detail-label">Atomic Mass</span>
                <span className="detail-value">{selectedElement.mass}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Category</span>
                <span className="detail-value">{categories.find(c => c.name === selectedElement.category)?.label}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Electron Configuration</span>
                <span className="detail-value">{selectedElement.electronConfig}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Block</span>
                <span className="detail-value">{selectedElement.block}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Period</span>
                <span className="detail-value">{selectedElement.period}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Group</span>
                <span className="detail-value">{selectedElement.group}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}