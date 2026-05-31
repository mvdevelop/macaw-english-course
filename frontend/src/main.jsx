import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeContextProvider } from './context/ThemeContext.jsx'

import { AuthContextProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ThemeContextProvider>
            <AuthContextProvider>
                <App />
            </AuthContextProvider>
        </ThemeContextProvider>
    </BrowserRouter>,
)