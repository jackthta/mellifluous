import { createRoot } from "react-dom/client";
import "./style.scss";

function App() {
  return <h1>👋</h1>;
}

const body = createRoot(document.body);
body.render(<App />);
