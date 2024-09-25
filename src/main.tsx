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
import { LogProvider } from './pages/main/LogContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <LogProvider>
    <PopupProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PathReqPage />} />
          <Route path="/bep-in-ex-dependencies" element={<BepInExDownloadPage />} />
          <Route path="/download-dependencies" element={<DownloadDependenciesPage />} />
          <Route path="/mod-manager" element={<ModManager />} />
        </Routes>
        <ProgressBar></ProgressBar>
        <TopBar></TopBar>
      </Router>
    </PopupProvider>
  </LogProvider>
)

window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
