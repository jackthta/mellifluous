import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
  return <h1>👋</h1>;
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);