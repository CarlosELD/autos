import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const AccessibilityControls = () => {
    const [contrastMode, setContrastMode] = useState('normal');
    const [fontSize, setFontSize] = useState('medium');

    useEffect(() => {
        // Cargar preferencias guardadas
        const savedContrast = localStorage.getItem('contrastMode') || 'normal';
        const savedFontSize = localStorage.getItem('fontSize') || 'medium';

        setContrastMode(savedContrast);
        setFontSize(savedFontSize);
        applyAccessibilitySettings(savedContrast, savedFontSize);
    }, []);

    const applyAccessibilitySettings = (contrast, size) => {
        // Remover clases anteriores
        document.body.classList.remove('high-contrast', 'protanopia-friendly');
        document.body.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');

        // Aplicar nuevo contraste
        if (contrast === 'high') {
            document.body.classList.add('high-contrast');
        } else if (contrast === 'protanopia') {
            document.body.classList.add('protanopia-friendly');
        }

        // Aplicar nuevo tamaño de fuente
        document.body.classList.add(`font-${size}`);
    };

    const handleContrastChange = (mode) => {
        setContrastMode(mode);
        localStorage.setItem('contrastMode', mode); // Persistencia
        applyAccessibilitySettings(mode, fontSize);
    };
    const handleFontSizeChange = (size) => {
        setFontSize(size);
        localStorage.setItem('fontSize', size);
        applyAccessibilitySettings(contrastMode, size);
    };

    return (
        <div className="accessibility-controls fixed-top end-0 mt-5 me-3">
            <div className="btn-group-vertical" role="group">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleContrastChange('normal')}
                    active={contrastMode === 'normal'}
                    className="mb-1"
                >
                    <i className="bi bi-eye me-1"></i> Normal
                </Button>

                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleContrastChange('high')}
                    active={contrastMode === 'high'}
                    className="mb-1"
                >
                    <i className="bi bi-brightness-high me-1"></i> Alto Contraste
                </Button>

                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleContrastChange('protanopia')}
                    active={contrastMode === 'protanopia'}
                    className="mb-1"
                >
                    <i className="bi bi-palette me-1"></i> Daltonismo
                </Button>

                <div className="btn-group" role="group">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleFontSizeChange('small')}
                        active={fontSize === 'small'}
                    >
                        A-
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleFontSizeChange('medium')}
                        active={fontSize === 'medium'}
                    >
                        A
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleFontSizeChange('large')}
                        active={fontSize === 'large'}
                    >
                        A+
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleFontSizeChange('xlarge')}
                        active={fontSize === 'xlarge'}
                    >
                        A++
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AccessibilityControls;