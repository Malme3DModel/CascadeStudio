'use client'

import { useEffect, useState, useRef } from 'react'
import { Mosaic, MosaicWindow } from 'react-mosaic-component'
import type { MosaicNode } from 'react-mosaic-component'
import 'react-mosaic-component/react-mosaic-component.css'
import CodeEditor from './CodeEditor'
import { CascadeView } from './CascadeView'
import { Console } from './Console'
import { WorkerManager } from '@/lib/WorkerManager'

export type ViewId = 'editor' | 'viewport' | 'console'

const ELEMENT_MAP: Record<ViewId, JSX.Element> = {
  editor: <CodeEditor />,
  viewport: <CascadeView />,
  console: <Console />,
}

const TITLES: Record<ViewId, string> = {
  editor: '* Untitled',
  viewport: 'CAD View',
  console: 'Console',
}

export default function CascadeStudio() {
  const [currentNode, setCurrentNode] = useState<MosaicNode<ViewId>>({
    direction: 'row' as const,
    first: 'editor',
    second: {
      direction: 'column' as const,
      first: 'viewport',
      second: 'console',
      splitPercentage: 80,
    },
    splitPercentage: 50,
  })

  const workerManagerRef = useRef<WorkerManager | null>(null)

  useEffect(() => {
    workerManagerRef.current = new WorkerManager()
    
    return () => {
      if (workerManagerRef.current) {
        workerManagerRef.current.terminate()
      }
    }
  }, [])

  const renderTile = (id: ViewId, path: any) => (
    <MosaicWindow<ViewId>
      path={path}
      title={TITLES[id]}
      createNode={() => 'editor'}
      renderToolbar={() => <div />}
    >
      {ELEMENT_MAP[id]}
    </MosaicWindow>
  )

  return (
    <div className="mosaic-root">
      <Mosaic<ViewId>
        renderTile={renderTile}
        value={currentNode}
        onChange={setCurrentNode}
        className="mosaic-blueprint-theme"
      />
    </div>
  )
}
