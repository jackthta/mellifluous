import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/router";

import { router } from "./router";

import "./style.scss";

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

const body = createRoot(document.body);
body.render(<App />);
