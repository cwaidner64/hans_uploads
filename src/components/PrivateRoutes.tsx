import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useLocation, Navigate, Routes, Route } from "react-router-dom";

import { getUserFromCanister } from "../utils";
import { Feed } from "../views/Feed";
import { Discover } from "../views/Discover";
import { Upload } from "./Upload";
import { Rewards } from "../views/Rewards";
import { Profile } from "../views/Profile";
import { DropDayNotification } from "./DropDayNotification";
import { RewardShowerNotification } from "./RewardShowerNotification";
import { MainNav } from "./MainNav";

export function PrivateRoutes({ user, isAuthenticated, setUser, logOut }) {
  const location = useLocation();

  function refreshProfileInfo() {
    getUserFromCanister(user?.userName!).then((user) => {
      if (user) {
        setUser(user);
      }
    });
  }

  const privateRoutes = [
    {
      path: "/feed",
      element: (
        <Feed profileInfo={user} onRefreshUser={refreshProfileInfo} />
      ),
    },
    {
      path: "/discover",
      element: <Discover profileInfo={user} />,
    },
    {
      path: "/upload",
      element: <Upload onUpload={refreshProfileInfo} user={user} />,
    },
    {
      path: "/rewards",
      element: <Rewards />,
    },
    {
      path: "/profile",
      element: <Profile currentUser={user} onLogOut={logOut} />,
    },
    {
      path: "/profiles/:userId",
      element: <Profile currentUser={user} />,
    },
  ];

  const privatePaths = privateRoutes.map(({ path }) => path);

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <DropDayNotification />
      <RewardShowerNotification currentUser={user} />
      <MainNav paths={privatePaths} />

      <TransitionGroup component={null}>
        <CSSTransition
          key={location.pathname}
          classNames="page-slide"
          timeout={250}
        >
          <div className="page-slide">
            <Routes location={location}>
              {privateRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
              {/* Catch-all fallback to Feed if path not matched */}
              <Route path="*" element={<Navigate to="/feed" replace />} />
            </Routes>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </>
  );
}
