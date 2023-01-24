import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import RecipePage from "./pages/RecipePage";
import BoxPage from "./pages/BoxPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<HomePage />} />
        <Route path="recipe/:id" element={<RecipePage />} />
        <Route path="my-recipes/" element={<BoxPage />} />
        <Route path="my-recipes/:type" element={<BoxPage />} />
        <Route path="my-recipes/:type/:id" element={<BoxPage />} />
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
