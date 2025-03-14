import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';

function App() {
  const { user } = useAuthContext()
  return (
    <div className="App">
       <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element = { <Home /> } /> 
            <Route path="/cart" element = {user ? <Cart />: <Navigate to="/login" /> } /> 
            <Route path="/login" element = {!user ? <Login />: <Navigate to="/" />} /> 
            <Route path="/signup" element = {!user ? <Signup />:<Navigate to="/" />} /> 
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
