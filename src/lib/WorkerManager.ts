export class WorkerManager {
  private worker: Worker | null = null
  private isWorking = false

  constructor() {
    this.initializeWorker()
  }

  private initializeWorker() {
    try {
      this.worker = new Worker('/workers/cascade-worker.js')
      
      this.worker.onmessage = (event) => {
        const { type, payload } = event.data
        
        switch (type) {
          case 'log':
            const logEvent = new CustomEvent('cascade-log', { detail: { message: payload } })
            window.dispatchEvent(logEvent)
            break
            
          case 'error':
            this.isWorking = false
            const errorEvent = new CustomEvent('cascade-error', { detail: { message: payload } })
            window.dispatchEvent(errorEvent)
            break
            
          case 'Progress':
            const progressEvent = new CustomEvent('cascade-progress', { detail: payload })
            window.dispatchEvent(progressEvent)
            break
            
          case 'combineAndRenderShapes':
            this.isWorking = false
            const renderEvent = new CustomEvent('cascade-render-shapes', { 
              detail: { 
                facelist: payload[0][0], 
                edgelist: payload[0][1], 
                sceneOptions: payload[1] 
              } 
            })
            window.dispatchEvent(renderEvent)
            break
            
          case 'resetWorking':
            this.isWorking = false
            break
            
          case 'startupCallback':
            const startupEvent = new CustomEvent('cascade-worker-ready')
            window.dispatchEvent(startupEvent)
            break
        }
      }

      this.worker.onerror = (error) => {
        console.error('Worker error:', error)
        this.isWorking = false
      }

      window.addEventListener('cascade-evaluate', this.handleEvaluate.bind(this))
      window.addEventListener('cascade-evaluate-from-gui', this.handleEvaluateFromGUI.bind(this))
      
    } catch (error) {
      console.error('Failed to initialize worker:', error)
    }
  }

  private handleEvaluate = (event: CustomEvent) => {
    if (this.isWorking || !this.worker) return
    
    this.isWorking = true
    const { code } = event.detail
    
    this.worker.postMessage({
      type: 'Evaluate',
      payload: {
        code,
        GUIState: {
          MeshRes: 0.1,
          'Cache?': true,
          'GroundPlane?': true,
          'Grid?': true,
        }
      }
    })

    this.worker.postMessage({
      type: 'combineAndRenderShapes',
      payload: {
        maxDeviation: 0.1,
        sceneOptions: {
          groundPlaneVisible: true,
          gridVisible: true,
        }
      }
    })
  }

  private handleEvaluateFromGUI = () => {
    const evaluateEvent = new CustomEvent('cascade-evaluate', { 
      detail: { code: '' } 
    })
    window.dispatchEvent(evaluateEvent)
  }

  public terminate() {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
    window.removeEventListener('cascade-evaluate', this.handleEvaluate as EventListener)
    window.removeEventListener('cascade-evaluate-from-gui', this.handleEvaluateFromGUI as EventListener)
  }
}
