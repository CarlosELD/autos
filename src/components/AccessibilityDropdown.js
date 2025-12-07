import React, { useState, useEffect } from 'react';

export default function AccessibilityDropdown() {
  const [contrastMode, setContrastMode] = useState('normal');
  const [fontSize, setFontSize] = useState('medium');

  useEffect(() => {
    const savedContrast = localStorage.getItem('contrastMode') || 'normal';
    const savedFont = localStorage.getItem('fontSize') || 'medium';
    setContrastMode(savedContrast);
    setFontSize(savedFont);
    applySettings(savedContrast, savedFont);
  }, []);

  const applySettings = (contrast, size) => {
    document.body.classList.remove('high-contrast', 'protanopia-friendly');
    document.body.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');

    if (contrast === 'high') document.body.classList.add('high-contrast');
    if (contrast === 'protanopia') document.body.classList.add('protanopia-friendly');

 
    document.body.classList.remove('font-small','font-medium','font-large','font-xlarge');
    document.body.classList.add(`font-${size}`);
  };

  const handleContrast = (mode, e) => {
    if (e && e.stopPropagation) e.stopPropagation(); // ESTO NOS DEJA CLICKEAR LAS VECES QUE QUERAMOS LOS BOTONES SIN CERRARSE
    setContrastMode(mode);
    localStorage.setItem('contrastMode', mode);
    applySettings(mode, fontSize);
  };

  const handleFontSize = (size, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    applySettings(contrastMode, size);
  };

  return (
    <div style={{ width: 230 }}>
      <small className="text-muted fw-bold">Contraste</small>
      <div className="d-grid gap-1 mb-2">
        <button type="button"
          className={`btn btn-sm btn-secondary ${contrastMode === 'normal' ? 'active' : ''}`}
          onClick={(e) => handleContrast('normal', e)}
        >
          Normal
        </button>

        <button type="button"
          className={`btn btn-sm btn-secondary ${contrastMode === 'high' ? 'active' : ''}`}
          onClick={(e) => handleContrast('high', e)}
        >
          Alto Contraste
        </button>

        <button type="button"
          className={`btn btn-sm btn-secondary ${contrastMode === 'protanopia' ? 'active' : ''}`}
          onClick={(e) => handleContrast('protanopia', e)}
        >
          Daltonismo
        </button>
      </div>

      <small className="text-muted fw-bold">Tamaño de Fuente</small>
      <div className="btn-group d-flex">
        <button type="button" className={`btn btn-sm btn-secondary ${fontSize === 'small' ? 'active' : ''}`}
          onClick={(e) => handleFontSize('small', e)}>A-</button>
        <button type="button" className={`btn btn-sm btn-secondary ${fontSize === 'medium' ? 'active' : ''}`}
          onClick={(e) => handleFontSize('medium', e)}>A</button>
        <button type="button" className={`btn btn-sm btn-secondary ${fontSize === 'large' ? 'active' : ''}`}
          onClick={(e) => handleFontSize('large', e)}>A+</button>
        <button type="button" className={`btn btn-sm btn-secondary ${fontSize === 'xlarge' ? 'active' : ''}`}
          onClick={(e) => handleFontSize('xlarge', e)}>A++</button>
      </div>
    </div>
  );
}

