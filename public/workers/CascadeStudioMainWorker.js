importScripts(
  'https://unpkg.com/three@0.129.0/build/three.min.js',
  '/workers/CascadeStudioStandardLibrary.js',
  '/workers/CascadeStudioShapeToMesh.js',
  'https://unpkg.com/opencascade.js@0.1.15/dist/opencascade.wasm.js',
  'https://unpkg.com/opentype.js@1.3.4/dist/opentype.min.js');

var preloadedFonts = ['/fonts/Roboto.ttf',
  '/fonts/Papyrus.ttf', '/fonts/Consolas.ttf'];

var console = {};
console.log = function(msg) {
  postMessage({ type: "log", payload: msg });
};
console.error = function(msg) {
  postMessage({ type: "error", payload: msg });
};

var sceneShapes = [];
var externalShapes = {};
var oc = null;
var messageHandlers = {};

new opencascade({
  locateFile(path) {
    if (path.endsWith('.wasm')) {
      return "https://unpkg.com/opencascade.js@0.1.15/dist/opencascade.wasm.wasm";
    }
    return path;
  }
}).then((openCascade) => {
  oc = openCascade;
  console.log("OpenCascade.js has loaded!");

  onmessage = function(e) {
    let messageHandler = messageHandlers[e.data.type];
    if (messageHandler) { messageHandler(e.data.payload); }
  };

  postMessage({ type: "startupCallback" });
});

function Evaluate(payload) {
  try {
    sceneShapes = [];
    externalShapes = {};
    
    let code = payload.code;
    let GUIState = payload.GUIState;
    
    eval(code);
    
    postMessage({ type: "resetWorking" });
  } catch (error) {
    console.error("Error evaluating code: " + error.message);
    postMessage({ type: "resetWorking" });
  }
}
messageHandlers["Evaluate"] = Evaluate;

function combineAndRenderShapes(payload) {
  try {
    let maxDeviation = payload.maxDeviation || 0.1;
    let sceneOptions = payload.sceneOptions || {};
    
    if (sceneShapes.length === 0) {
      postMessage({ type: "combineAndRenderShapes", payload: [[[],[]], sceneOptions] });
      return;
    }

    let facesAndEdges = [[], []];
    
    for (let i = 0; i < sceneShapes.length; i++) {
      postMessage({ type: "Progress", payload: { opNumber: i + 1, opType: "Meshing" } });
      
      try {
        let shape = sceneShapes[i];
        if (shape && !shape.IsNull()) {
          let mesh = ShapeToMesh(shape, maxDeviation, false);
          if (mesh && mesh[0] && mesh[1]) {
            facesAndEdges[0].push(mesh[0]);
            facesAndEdges[1].push(mesh[1]);
          }
        }
      } catch (meshError) {
        console.error("Error meshing shape " + i + ": " + meshError.message);
      }
    }

    postMessage({ type: "combineAndRenderShapes", payload: [facesAndEdges, sceneOptions] });
  } catch (error) {
    console.error("Error in combineAndRenderShapes: " + error.message);
    postMessage({ type: "resetWorking" });
  }
}
messageHandlers["combineAndRenderShapes"] = combineAndRenderShapes;

importScripts('/workers/CascadeStudioFileUtils.js');
