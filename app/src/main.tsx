import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GiphyProvider } from "./context/GiphyContext";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GiphyProvider>
      <App />
    </GiphyProvider>
  </React.StrictMode>,
)
