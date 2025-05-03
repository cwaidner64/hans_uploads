import React from "react";
import { CSSTransition } from "react-transition-group";
import { getUserFromCanister } from "../utils";
import { Feed } from "../views/Feed";
import { Discover } from "../views/Discover";
import { Upload } from "./Upload";
import { Rewards } from "../views/Rewards";
import { Profile } from "../views/Profile";
import { DropDayNotification } from "./DropDayNotification";
import { RewardShowerNotification } from "./RewardShowerNotification";
import { MainNav } from "./MainNav";
import { Routes, Route, Navigate } from "react-router-dom";

function wrapPrivateRouteWithSlide(render) {
  const nodeRef = React.useRef(null); // For react-transition-group
  return ({ match }) => (
    <CSSTransition
      in={match != null}
      timeout={250}
      classNames="page-slide"
      unmountOnExit
      nodeRef={nodeRef}  // For react-transition-group compatibility
    >
      <div className="page-slide" ref={nodeRef}>
        {render({ match })}
      </div>
    </CSSTransition>
  );
}

export function PrivateRoutes({
  location,
  user,
  isAuthenticated,
  setUser,
  logOut,
}) {
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
      element: <Feed profileInfo={user} onRefreshUser={refreshProfileInfo} />,
    },
    { path: "/discover", element: <Discover profileInfo={user} /> },
    {
      path: "/upload",
      element: <Upload onUpload={refreshProfileInfo} user={user} />,
    },
    { path: "/rewards", element: <Rewards /> },
    {
      path: "/profile",
      element: <Profile currentUser={user} onLogOut={logOut} />,
    },
    {
      path: "/profiles/:userId",
      element: <Profile currentUser={user} />,
    },
  ];

  return (
    <>
      {isAuthenticated && user ? (
        <>
          {/* These components are now outside <Routes> */}
          <DropDayNotification />
          <RewardShowerNotification currentUser={user} />
          <MainNav paths={privateRoutes.map((route) => route.path)} />

          <Routes location={location}>
            {privateRoutes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={wrapPrivateRouteWithSlide(() => element)({ match: null })}
              />
            ))}
          </Routes>
        </>
      ) : (
        <Navigate to="/" replace />
      )}
    </>
  );
}
