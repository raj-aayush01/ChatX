import { BrowserRouter, Routes, Route } from "react-router-dom" ;

import Signup from "./pages/Signup" ;
import Login from "./pages/Login" ;
import Chat from "./pages/Chat" ;
import "./App.css" ;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:chatId" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App ;