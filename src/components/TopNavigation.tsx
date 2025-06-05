'use client'

import { useState } from 'react'

export function TopNavigation() {
  const [activeTab, setActiveTab] = useState('file')

  const handleSave = () => {
    const event = new CustomEvent('cascade-save')
    window.dispatchEvent(event)
  }

  const handleLoad = () => {
    const event = new CustomEvent('cascade-load')
    window.dispatchEvent(event)
  }

  const handleExportSTL = () => {
    const event = new CustomEvent('cascade-export-stl')
    window.dispatchEvent(event)
  }

  const handleExportOBJ = () => {
    const event = new CustomEvent('cascade-export-obj')
    window.dispatchEvent(event)
  }

  const handleExportSTEP = () => {
    const event = new CustomEvent('cascade-export-step')
    window.dispatchEvent(event)
  }

  return (
    <div className="topnav" id="topnav">
      <a 
        href="#" 
        className={activeTab === 'file' ? 'active' : ''}
        onClick={() => setActiveTab('file')}
      >
        File
      </a>
      <a href="#" onClick={handleSave}>Save</a>
      <a href="#" onClick={handleLoad}>Load</a>
      <a href="#" onClick={handleExportSTL}>Export STL</a>
      <a href="#" onClick={handleExportOBJ}>Export OBJ</a>
      <a href="#" onClick={handleExportSTEP}>Export STEP</a>
      <a 
        href="https://github.com/zalo/CascadeStudio" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        GitHub
      </a>
    </div>
  )
}
