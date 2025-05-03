import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useAuth } from "./utils";
import { PrivateRoutes } from "./components/PrivateRoutes";
import { SignIn } from "./views/SignIn";
import { SignUp } from "./components/SignUp";

function AnimatedRoutes() {
  const nodeRef = React.useRef(null); // For react-transition-group
  const location = useLocation();
  const { user, setUser, isAuthenticated, isAuthReady, logOut } = useAuth();

  if (!isAuthReady) return null; // wait for auth to load

  // Decide root redirect
  if (location.pathname === "/") {
    if (isAuthenticated && user) return <Navigate to="/feed" />;
    if (isAuthenticated) return <Navigate to="/sign-up" />;
    return <Navigate to="/sign-in" />;
  }

  return (
    <TransitionGroup>
      <CSSTransition nodeRef={nodeRef} key={location.key} classNames="page-fade" timeout={300}>
        <Routes location={location}>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route
            path="*"
            element={
              <PrivateRoutes
                location={location}
                user={user}
                isAuthenticated={isAuthenticated}
                setUser={setUser}
                logOut={logOut}
              />
            }
          />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
}

export function AppRouter() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}
