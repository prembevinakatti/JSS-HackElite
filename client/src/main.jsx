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
import store, { persistor } from "./redux/store";
import Login from "./components/Mycomponets/auth/Login";
import MetaMaskConnect from "./components/Mycomponets/metamask/MetaMaskConnect";
import CreateForm from "./components/Mycomponets/forms/CreateForm";
import FileUpload from "./components/Mycomponets/forms/FileUpload";
import { ContractProvider } from "./ContractContext/ContractContext";
import { PersistGate } from "redux-persist/integration/react";
import View from "./components/Mycomponets/fileview/View";
import AdminHeadPanel from "./components/Mycomponets/forms/AdminHeadPanel";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path="/login" element={<Login />} />
        <Route path="/connectmetamask" element={<MetaMaskConnect />} />

        {/* restricted usrsroute */}
        <Route path="/createuser" element={<CreateForm />} />
        <Route path="/uploadfiles" element={<FileUpload />} />
        <Route path="/view" element={<View/>}/>
        <Route path="/assignpanel" element={<AdminHeadPanel/>}/>
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <PersistGate loading={null} persistor={persistor}>
          <ContractProvider>
            <RouterProvider router={router} />
          </ContractProvider>
        </PersistGate>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
