
import { Outlet } from "react-router-dom";
const MainBody = () => {
    return ( 
        <div className="w-full h-screen">
            <Outlet />
        </div>
     );
}
 
export default MainBody;