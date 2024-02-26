import "./App.css";
import PrivateRoute from "./Routes/PrivateRoute";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Signin from "./pages/form/Signin";
import Signup from "./pages/form/Signup";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<PrivateRoute />}>
          <Route path="" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
