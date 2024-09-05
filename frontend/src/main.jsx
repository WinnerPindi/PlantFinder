import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { Provider } from "react-redux";
import store from "./redux/store/index.js";
import AdvancedSearch from "./pages/AdvancedSearch.jsx";
import Gallery from "./pages/Gallery.jsx";
import PlantDetails from "./pages/PlantDetails.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import UserDetails from "./pages/UserDetails.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import AddObservation from "./pages/AddObservation.jsx";
import SearchResults from "./pages/SearchResults.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="advanced-search" element={<AdvancedSearch />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="plants/:id" element={<PlantDetails />} />
          <Route path="/userprofil/:id" element={<UserProfile />} />
          <Route path="/user/:userId" element={<UserDetails />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="add-obersation" element={<AddObservation/>}/>
          <Route path="/search" element={<SearchResults/>}/>
        </Routes>
      </Provider>
      <ToastContainer />
    </BrowserRouter>
  </React.StrictMode>
);
