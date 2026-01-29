import { createRoot } from 'react-dom/client'
import type { ReactNode } from 'react'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(<App /> as ReactNode)
