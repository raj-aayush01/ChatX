import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../services/authService";

const AuthContext = createContext(null);

function getStoredUser() {
    try {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });
    const [isAuthLoading, setIsAuthLoading] = useState(true) ;

    useEffect(() => {
        const restoreSession = async () => {
            const token = localStorage.getItem("token") ;

            if(!token){
                localStorage.removeItem("token") ;
                setUser(null) ;
                setIsAuthLoading(false) ;
                return ;
            }

            try {
                const data = await getCurrentUser() ;

                setUser(data.user) ;
                localStorage.setItem(
                    "user" ,
                    JSON.stringify(data.user)
                ) ;

            } catch ( error ) {
                localStorage.removeItem("token") ;
                localStorage.removeItem("user") ;
                setUser(null) ;

            } finally {
                setIsAuthLoading(false) ;
            }
        } ;

        restoreSession() ;
    }, []) ;

    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, isAuthLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}