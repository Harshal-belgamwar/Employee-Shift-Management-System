import './App.css'

import AppRoutes from './Routes/AppRoutes'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { listenForMessages } from "./Notification/onMessageListener";
import { useEffect } from "react";
import AppBootstrap from './Pages/AppBootstrap';

function App() {
  useEffect(() => {
    listenForMessages();
  }, []);

  return (

    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
      <AppBootstrap />

      <AppRoutes />

    </>

  )

}

export default App
