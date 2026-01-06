import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ServiceProvider } from "./services";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ServiceProvider>
    <App />
  </ServiceProvider>
);
