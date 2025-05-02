import React from "react";
import ReactDOM from "react-dom/client";
import { updateHead, ProvideAuth } from "./utils";
import { AppRouter } from "./AppRouter";
import "./styles.scss";

function ServerApp() {
  console.log("ServerApp initialized");
  return (
    <ProvideAuth>
      <AppRouter />
    </ProvideAuth>
  );
}

// Required for website to behave like a phone app on mobile devices
updateHead(document);

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);
root.render(<ServerApp />);
