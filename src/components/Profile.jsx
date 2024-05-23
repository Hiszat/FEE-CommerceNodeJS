import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const Profile = () => {
    return ( 
        <div className="p-5 w-full">
            <div className="grid grid-cols-3 border-2 border-solid border-black">
                    <ul className="border-r-2 border-solid border-black">
                        <li className="border-b-2 border-black"><a href="/profile/">Profile</a></li>
                        <li className="border-b-2 border-black"><a href="/profile/da">Delivery Address</a></li>
                        <li className="border-b-2 border-black"><a href="/profile/orders">Pemesanan</a></li>
                    </ul>
                <div className="cols-span-2 min-h-[40vh] p-3">
                    <Outlet />
                </div>
            </div>
            <ToastContainer limit={3}/>
        </div>
     );
}
 
export default Profile;