/**
 * ALL AUTHENTICATION UTILITIES
 * @returns 
 */

import type { UserData } from "@/types/user";

export const getAccessToken =() => {
    return (localStorage.getItem("access_token"));
}

export const getRefreshToken =() => {
    return (localStorage.getItem("refresh_token"));
}

export const clearAuthTokens=() =>{
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
}

export const storeAuthTokens = (access: string, refresh: string) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  };

export const checkAuth = () => {
    const access = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");
    const userData = localStorage.getItem("user");
    const authenticated = access !== null && refresh !== null && userData !== null;
    return {
      isAuthenticated: authenticated,
      user: userData ? JSON.parse(userData) : null,
    };
  };
  
export const storeUserData = (userData: UserData) => {
    localStorage.setItem("user", JSON.stringify(userData));
  };
  
