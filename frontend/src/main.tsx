import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { ThemeContextProvider } from './context/ThemeContext'

import { AuthContextProvider } from './context/AuthContext'
import { LanguageProvider } from './i18n/LanguageContext'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <ThemeContextProvider>
            <AuthContextProvider>
                <LanguageProvider>
                    <App />
                </LanguageProvider>
            </AuthContextProvider>
        </ThemeContextProvider>
    </BrowserRouter>,
)
