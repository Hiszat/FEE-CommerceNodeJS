import { Routes, } from "react-router-dom"
import Items from "./components/Items"
import MainBody from "./components/Main"
import Navbar from "./components/Navbar"
import Login from "./components/Login"
import { Route } from "react-router-dom"
import Cart from "./components/Cart"
import Profile from "./components/Profile"
import DeliveryAddress from "./components/Da"
import Proffile from "./components/Profile1"
import Orders from "./components/Orders"

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainBody />}>
          <Route index element={<Items />} />
          <Route path="mycart" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="profile/" element={<Profile />} >
            <Route index element={<Proffile/>} />
            <Route path="da" element={<DeliveryAddress/>} />
            <Route path="orders" element={<Orders/>} />
          </Route>
        </Route>
        <Route path="*" element={<NoMatch/>} />
      </Routes>
    </>
  )
}



function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        {/* <Link to="/">Go to the home page</Link> */}
      </p>
    </div>
  );
}

export default App
