import { Link } from 'react-router-dom';
import navbarList from '../const';
import { isLogin } from '../features/auth';

const Navbar = () => {
    return ( 
        <nav className="flex justify-between p-6 items-center bg-secondary z-10">
            <h1 className='text-white'>Ini adalah navbar</h1>
            <ul className="flex items-center ">
                {navList}
                <li>
                    <input type="text" name="" id="" placeholder='' className='rounded-3xl py-1 px-3 w-50 focus:outline-none'/>
                </li>
            </ul>
        </nav>
     );
}

const navList = (isLogin() ? navbarList.filter((item)=> item.text !== "Login"): navbarList.filter((item)=> item.text !== "Cart")).map((nav, index) => (
    <li key={index} className={`text-white mr-6`}>
        <Link to={nav.url}>{nav.text}</Link>
    </li>
));

 // /*${ index === navbarList.length - 1 ? 'mr-0' : 'mr-6' }*/`}>}



 
export default Navbar;