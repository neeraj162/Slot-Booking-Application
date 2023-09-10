import Login from "./components/Login";
import RequireAuth from "./components/RequireAuth";
import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";
import Appointments from "./components/Appointments";
import Bookslot from "./components/Bookslot";
import Unauthorized from "./components/Unauthorized";
import About from "./components/About";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        {/* protected routes */}
        <Route element={<RequireAuth />}>
            <Route path="/" element={<Home />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/bookslot" element={<Bookslot />} />
            <Route path="/about" element={<About />} />
        </Route>
        {/* Unauthorized routes */}
        <Route path="/*" element={<Unauthorized />} />
      </Routes>
    </div>
  );
}

export default App;
