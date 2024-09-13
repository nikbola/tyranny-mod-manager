import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import PathReqPage from './pages/setup/PathReqPage.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PathReqPage />
  </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
