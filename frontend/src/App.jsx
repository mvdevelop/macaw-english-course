import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import LenisScroll from "./components/Lenis"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import DashboardLayout from "./pages/dashboard/DashboardLayout"
import DashboardHome from "./pages/dashboard/DashboardHome"
import { useAuth } from "./context/AuthContext"
import { Navigate } from "react-router-dom"

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;
    return children;
}

function PublicOnlyRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (user) return <Navigate to="/dashboard" replace />;
    return children;
}

function LandingLayout() {
    return (
        <>
            <Navbar />
            <LenisScroll />
            <Home />
            <Footer />
        </>
    );
}

export default function App() {
    return (
        <Routes>
            {/* Landing page */}
            <Route path="/" element={<LandingLayout />} />

            {/* Auth routes (no navbar/footer) */}
            <Route
                path="/login"
                element={<PublicOnlyRoute><Login /></PublicOnlyRoute>}
            />
            <Route
                path="/signup"
                element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>}
            />

            {/* Protected dashboard routes */}
            <Route
                path="/dashboard"
                element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
            >
                <Route index element={<DashboardHome />} />
            </Route>
        </Routes>
    );
}
