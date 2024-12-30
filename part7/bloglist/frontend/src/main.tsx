import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import UsersList from "./pages/UsersList.tsx";
import UserView from "./pages/UserView.tsx";
import BlogView from "./pages/BlogView.tsx";

import { store } from './store'
import { Provider } from 'react-redux'

import { BrowserRouter, Routes, Route } from "react-router";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="user">
            <Route index element={<UsersList />} />
            <Route path=":id" element={<UserView/>}/>
          </Route>
          <Route path="blogs">
            <Route path=":id" element={<BlogView/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
