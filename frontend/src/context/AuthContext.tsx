'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
// Ensure this imports the CORRECTED User type with lowercase keys
import { type User } from '@/types/user'; // Or wherever your type is defined

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
    isLoading: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        console.log('--- AuthContext Initial Load ---'); // Log mount
        let storedToken: string | null = null;
        let storedUser: string | null = null;
        try {
            storedToken = localStorage.getItem('authToken');
            storedUser = localStorage.getItem('authUser');

            // DEBUGGING START (Load) 
            console.log('[Load] Stored Token:', storedToken);
            console.log('[Load] Stored User (raw):', storedUser);
            // DEBUGGING END (Load) 

            if (storedToken && storedUser) {
                const parsedUser: User = JSON.parse(storedUser); // Assume parsedUser matches User type
                // DEBUGGING START (Parsed)
                console.log('[Load] Parsed User from localStorage:', JSON.stringify(parsedUser, null, 2));
                //DEBUGGING END (Parsed) 
                setToken(storedToken);
                setUser(parsedUser);
            } else {
                 console.log('[Load] No valid token/user found in localStorage.');
            }
        } catch (error) {
            console.error("[Load] Error loading/parsing auth state:", error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
        } finally {
            console.log('[Load] Finished loading check. IsLoading set to false.');
            setIsLoading(false);
        }
    }, []); // Run only once on mount

    const login = (userData: User, token: string) => { // userData type must match the actual object structure
        try {
            //DEBUGGING START (Login)
            console.log('--- AuthContext Login Function Called ---');
            console.log('Received userData:', JSON.stringify(userData, null, 2));
            console.log('Received token:', token);
            // DEBUGGING END (Login) 

            // Ensure userData has the expected structure before saving/setting
            if (!userData || typeof userData !== 'object' || !userData.UserID || !userData.Role) {
                console.error('AuthContext Login: Received invalid userData structure!', userData);
                // Optionally: throw an error or handle appropriately
                return; // Prevent setting invalid state
            }

            const userDataString = JSON.stringify(userData);
            localStorage.setItem('authToken', token);
            localStorage.setItem('authUser', userDataString);
            setToken(token);
            setUser(userData); // Set the validated user data
            console.log('AuthContext State Updated: User set, isAuthenticated should be true.');

        } catch (error) {
            console.error("Error saving auth state to localStorage:", error);
        }
    };

    const logout = () => {
        console.log('--- AuthContext Logout Function Called ---');
        try {
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            setToken(null);
            setUser(null);
            console.log('Auth state cleared from context and localStorage.');
            router.push('/login');
        } catch (error) {
            console.error("Error clearing auth state from localStorage:", error);
        }
    };

    // Check the derived state right before providing it
    const isAuthenticatedValue = !!token;
    console.log(`AuthContext Providing: isLoading=${isLoading}, isAuthenticated=${isAuthenticatedValue}, user=`, user ? JSON.stringify(user) : null); // Log provided value

    const value = {
        isAuthenticated: isAuthenticatedValue,
        user,
        token,
        login,
        logout,
        isLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
