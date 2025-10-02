import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    authToken: null,
    role: null,
    user: null, // normalized: { id, name, email, ... }
  });
  const [isHydrating, setIsHydrating] = useState(true);

  // Hydrate from storage on mount
  useEffect(() => {
    try {
      // Internal app users (LG/Admin/CRE)
      const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
      const storedRole = localStorage.getItem("role") || sessionStorage.getItem("role");
      const storedUserStr = localStorage.getItem("user") || sessionStorage.getItem("user");
      const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;

      // Corporate employer
      const storedCorpToken = localStorage.getItem("corp_token") || sessionStorage.getItem("corp_token");
      const storedCorpAccStr = localStorage.getItem("corp_account") || sessionStorage.getItem("corp_account");
      const storedCorpAcc = storedCorpAccStr ? JSON.parse(storedCorpAccStr) : null;

      if (storedToken && storedRole && storedUser) {
        const cleanUser = {
          id: storedUser.id,
          name: storedUser.name?.replace(/ LG$/, "") || "User",
          email: storedUser.email || "",
          reportsTo: storedUser.reportsTo || null,
        };
        setAuthData({ authToken: storedToken, role: storedRole, user: cleanUser });
      } else if (storedCorpToken && (storedCorpAcc || !storedCorpAccStr)) {
        // Allow login persistence even if corp_account is missing. Use minimal user info.
        const cleanCorp = storedCorpAcc ? {
          id: storedCorpAcc.id,
          name: storedCorpAcc.hrName || storedCorpAcc.companyName || "Employer",
          hrName: storedCorpAcc.hrName || "",
          email: storedCorpAcc.email || "",
          mobile: storedCorpAcc.mobile || "",
          companyName: storedCorpAcc.companyName || "",
          designation: storedCorpAcc.designation || "",
        } : {
          id: undefined,
          name: "Employer",
          hrName: "",
          email: "",
          mobile: "",
          companyName: "",
          designation: "",
        };
        setAuthData({ authToken: storedCorpToken, role: "corporate", user: cleanCorp });
      }
      setIsHydrating(false);
    } catch (e) {
      console.error("Auth hydration error:", e);
      // Do not clear storage on hydration parse errors.
      setIsHydrating(false);
    }
  }, []);

  // Internal login (LG/Admin/CRE)
  const login = (token, role, user, remember) => {
    const cleanUser = {
      id: user.id,
      name: user.name?.replace(/ LG$/, "") || "User",
      email: user.email || "",
      reportsTo: user.reportsTo || null,
    };
    const userStr = JSON.stringify(cleanUser);
    if (remember) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", userStr);
    } else {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("user", userStr);
    }
    setAuthData({ authToken: token, role, user: cleanUser });
  };

  // Corporate login (Employer)
  // account: { id, companyName, hrName, email, mobile, designation }
  const loginCorporate = (tokenOrResponse, accountMaybe, rememberMaybe) => {
    // Support calling with (token, account, remember) OR ({ token, account }, remember)
    let token = tokenOrResponse;
    let account = accountMaybe;
    let remember = rememberMaybe;

    if (typeof tokenOrResponse === 'object' && tokenOrResponse !== null && 'token' in tokenOrResponse) {
      token = tokenOrResponse.token;
      account = tokenOrResponse.account;
      remember = accountMaybe; // second param becomes remember
    }

    if (typeof remember === 'undefined') remember = true; // default to persistent

    const cleanCorp = {
      id: account.id,
      name: account.hrName || account.companyName || "Employer",
      hrName: account.hrName || "",
      email: account.email || "",
      mobile: account.mobile || "",
      companyName: account.companyName || "",
      designation: account.designation || "",
    };
    const accStr = JSON.stringify(cleanCorp);
    if (remember) {
      localStorage.setItem("corp_token", token);
      localStorage.setItem("corp_account", accStr);
    } else {
      sessionStorage.setItem("corp_token", token);
      sessionStorage.setItem("corp_account", accStr);
    }
    setAuthData({ authToken: token, role: "corporate", user: cleanCorp });
  };

  // Logout for both modes
  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setAuthData({ authToken: null, role: null, user: null });
  };

  return (
    <AuthContext.Provider value={{
      ...authData,
      // lifecycle
      isHydrating,
      // actions
      login,
      loginCorporate,
      logout,
      // computed flags
      isAuthenticated: !!authData.authToken,
      isCorporate: authData.role === 'corporate',
      isInternal: authData.role !== null && authData.role !== 'corporate',
      // getters to avoid storage reads elsewhere
      getToken: () => authData.authToken,
      getUser: () => authData.user,
      getRole: () => authData.role,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
