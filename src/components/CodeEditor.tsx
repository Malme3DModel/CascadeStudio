'use client'

import { useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import type { editor } from 'monaco-editor'

const starterCode = `// Welcome to Cascade Studio!   Here are some useful functions:
//  Translate(), Rotate(), Scale(), Mirror(), Union(), Difference(), Intersection()
//  Box(), Sphere(), Cylinder(), Cone(), Text3D(), Polygon()
//  Offset(), Extrude(), RotatedExtrude(), Revolve(), Pipe(), Loft(), 
//  FilletEdges(), ChamferEdges(),
//  Slider(), Checkbox(), TextInput(), Dropdown()

let holeRadius = Slider("Radius", 30 , 20 , 40);

let sphere     = Sphere(50);
let cylinderZ  =                     Cylinder(holeRadius, 200, true);
let cylinderY  = Rotate([0,1,0], 90, Cylinder(holeRadius, 200, true));
let cylinderX  = Rotate([1,0,0], 90, Cylinder(holeRadius, 200, true));

Translate([0, 0, 50], Difference(sphere, [cylinderX, cylinderY, cylinderZ]));

// Don't forget to push imported or oc-defined shapes into sceneShapes to add them to the workspace!`

export default function CodeEditor() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const [code, setCode] = useState(starterCode)

  useEffect(() => {
    const handleEvaluate = () => {
      if (editorRef.current) {
        const currentCode = editorRef.current.getValue()
        const event = new CustomEvent('cascade-evaluate', { 
          detail: { code: currentCode } 
        })
        window.dispatchEvent(event)
      }
    }

    const handleSave = () => {
      if (editorRef.current) {
        const currentCode = editorRef.current.getValue()
        const blob = new Blob([currentCode], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'cascade-project.js'
        a.click()
        URL.revokeObjectURL(url)
      }
    }

    const handleLoad = () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.js,.ts'
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const content = e.target?.result as string
            if (editorRef.current) {
              editorRef.current.setValue(content)
              setCode(content)
            }
          }
          reader.readAsText(file)
        }
      }
      input.click()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F5') {
        e.preventDefault()
        handleEvaluate()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
        handleEvaluate()
      }
    }

    window.addEventListener('cascade-save', handleSave)
    window.addEventListener('cascade-load', handleLoad)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('cascade-save', handleSave)
      window.removeEventListener('cascade-load', handleLoad)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor
    
    editor.addAction({
      id: 'evaluate-code',
      label: 'Evaluate Code',
      keybindings: [monaco.KeyCode.F5],
      run: () => {
        const currentCode = editor.getValue()
        const event = new CustomEvent('cascade-evaluate', { 
          detail: { code: currentCode } 
        })
        window.dispatchEvent(event)
      }
    })
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value)
    }
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Editor
        height="100%"
        defaultLanguage="typescript"
        theme="vs-dark"
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  )
}
