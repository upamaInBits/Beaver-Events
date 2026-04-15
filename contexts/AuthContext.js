import { createContext, useState } from "react";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <AuthContext.Provider value={{
            userDetails,
            isLoggedIn,
            setIsLoggedIn,
            setUserDetails
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;
export {AuthContext}