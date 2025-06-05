'use client'

import { useEffect, useRef, useState } from 'react'

interface LogEntry {
  id: number
  message: string
  type: 'log' | 'error'
  timestamp: Date
}

export function Console() {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, message: 'Welcome to Cascade Studio!', type: 'log', timestamp: new Date() },
    { id: 2, message: 'Loading CAD Kernel...', type: 'log', timestamp: new Date() },
  ])
  const containerRef = useRef<HTMLDivElement>(null)
  const logIdRef = useRef(3)

  useEffect(() => {
    const handleLog = (event: CustomEvent) => {
      const newLog: LogEntry = {
        id: logIdRef.current++,
        message: event.detail.message,
        type: 'log',
        timestamp: new Date(),
      }
      setLogs(prev => [...prev, newLog])
    }

    const handleError = (event: CustomEvent) => {
      const newLog: LogEntry = {
        id: logIdRef.current++,
        message: event.detail.message,
        type: 'error',
        timestamp: new Date(),
      }
      setLogs(prev => [...prev, newLog])
    }

    const handleProgress = (event: CustomEvent) => {
      const { opNumber, opType } = event.detail
      const message = `> Generating Model${'.' .repeat(opNumber)}${opType ? ` (${opType})` : ''}`
      
      setLogs(prev => {
        const newLogs = [...prev]
        const lastLog = newLogs[newLogs.length - 1]
        if (lastLog && lastLog.message.startsWith('> Generating Model')) {
          lastLog.message = message
          return newLogs
        } else {
          return [...newLogs, {
            id: logIdRef.current++,
            message,
            type: 'log',
            timestamp: new Date(),
          }]
        }
      })
    }

    window.addEventListener('cascade-log', handleLog as EventListener)
    window.addEventListener('cascade-error', handleError as EventListener)
    window.addEventListener('cascade-progress', handleProgress as EventListener)

    const originalConsoleLog = console.log
    const originalConsoleError = console.error

    console.log = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ')
      
      const event = new CustomEvent('cascade-log', { detail: { message } })
      window.dispatchEvent(event)
      originalConsoleLog.apply(console, args)
    }

    console.error = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ')
      
      const event = new CustomEvent('cascade-error', { detail: { message } })
      window.dispatchEvent(event)
      originalConsoleError.apply(console, args)
    }

    return () => {
      window.removeEventListener('cascade-log', handleLog as EventListener)
      window.removeEventListener('cascade-error', handleError as EventListener)
      window.removeEventListener('cascade-progress', handleProgress as EventListener)
      console.log = originalConsoleLog
      console.error = originalConsoleError
    }
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div className="console-container" ref={containerRef}>
      {logs.map((log, index) => (
        <div 
          key={log.id} 
          className={`console-line ${log.type} ${index % 2 === 0 ? 'even' : 'odd'}`}
        >
          &gt; {log.message}
        </div>
      ))}
    </div>
  )
}
