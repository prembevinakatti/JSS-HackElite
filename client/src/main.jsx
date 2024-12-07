import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Login from "./components/Mycomponets/auth/Login";
import MetaMaskConnect from "./components/Mycomponets/metamask/MetaMaskConnect";
import CreateForm from "./components/Mycomponets/forms/CreateForm";
import FileUpload from "./components/Mycomponets/forms/FileUpload";
import { ContractProvider } from "./ContractContext/ContractContext";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path="/login" element={<Login />} />
        <Route path="/connectmetamask" element={<MetaMaskConnect />} />

        {/* restricted usrsroute */}
        <Route path="/createuser" element={<CreateForm />} />
        <Route path="/uploadfiles" element={<FileUpload />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ContractProvider>
          <RouterProvider router={router} />
        </ContractProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
