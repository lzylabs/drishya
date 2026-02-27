import React from 'react'
import { createRoot } from 'react-dom/client'
import './i18n/index.js'
import './styles/index.css'
import App from './App.jsx'

const root = document.getElementById('root')

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
