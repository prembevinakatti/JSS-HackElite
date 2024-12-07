import { useState } from "react";
// import './App.css'
import { Outlet } from "react-router-dom";
import Navbar from "./components/Mycomponets/Navbar/Navbar";
import ShowFiles from "./components/Mycomponets/showFiles/ShowFiles";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <Outlet />
      {/* <ShowFiles /> */}
    </>
  );
}

export default App;
