import React, { useState } from 'react';


export const AuthContext = React.createContext({
    isAuth: false,
    login: () => { }
});

const AuthContextProvider = props => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const loginHandler = () => {
        setIsAuthenticated(true);
    }

    return (
        // valueshi avtomaturat mova info da
        // Provideris subscriber vinc iqneba cvlilebaze waigebs infos
        <AuthContext.Provider value={{ login: loginHandler, isAuth: isAuthenticated }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;

