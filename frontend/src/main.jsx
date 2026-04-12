import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import Global from "./styles/Global/Global.jsx";
import { TagsProvider } from "./contexts/TagsContext.jsx";
import { ListsProvider } from "./contexts/ListsContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Global>
        <TagsProvider>
          <ListsProvider>
            <App />
          </ListsProvider>
        </TagsProvider>
      </Global>
    </BrowserRouter>
  </StrictMode>,
);
