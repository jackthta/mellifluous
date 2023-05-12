import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/router";

import { router } from "./router";

import "./style.scss";

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
