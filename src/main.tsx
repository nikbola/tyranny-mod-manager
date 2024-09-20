import ReactDOM from 'react-dom/client'
import PathReqPage from './pages/setup/PathReqPage.tsx'
import ModManager from './pages/main/ModManager.tsx'
import './index.css'
import './style/elements/Toggle.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DownloadDependenciesPage from './pages/setup/DownloadDependenciesPage.tsx';
import BepInExDownloadPage from './pages/setup/BepInExDownloadHandler.tsx';
import TopBar from './pages/static/TopBar.tsx';
import ProgressBar from './pages/static/ProgressBar.tsx';
import { PopupProvider } from './pages/static/PopupContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <PopupProvider>
  <Router>
    <Routes>  
      <Route path="/" element={<PathReqPage />} /> {/* Front page for requesting paths */}
      <Route path="/bep-in-ex-dependencies" element={<BepInExDownloadPage />} /> {/* Front page for requesting paths */}
      <Route path="/download-dependencies" element={<DownloadDependenciesPage />} /> {/* Front page for requesting paths */}
      <Route path="/mod-manager" element={<ModManager />} /> {/* The current page */}
    </Routes>
    <ProgressBar></ProgressBar>
    <TopBar></TopBar>
  </Router>
  </PopupProvider>
)

window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
