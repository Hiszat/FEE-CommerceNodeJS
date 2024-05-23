import { useState } from "react";
import {LogIn} from "../features/auth";
import Cookies from 'js-cookie';
 
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function setData(name, value){
        if(name === "email"){
            setEmail(value);
        }else if(name === "password"){
            setPassword(value);
        }
    }

    async function handleLogin(event){
        event.preventDefault();
        const response = await LogIn({email, password});
        const data = response.data;
        Cookies.set('token', data.token, { expires: 1});
        if(data.token){
            window.location.replace('/');
        }
    } 

    return ( 
        <div className="w-full min-h-screen pt-10">
            <form onSubmit={(e) => handleLogin(e)} >
                <div className="border-2 border-black w-96 mx-auto p-10 rounded-xl">
                    <h1 className="font-semibold text-3xl mb-4">Login Page</h1>
                    <div className="flex flex-col mb-2">
                        <label htmlFor="email" className="font-medium mb-1">Email</label>
                        <input type="text" name="email"  onChange={(e) => setData("email", e.target.value)} id="email" className="block border-2 border-slate-400 focus:outline-none rounded-md p-2.5" placeholder="name@email.com"/>
                    </div>
                    <div className="flex flex-col  mb-2">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password"  onChange={(e) => setData("password", e.target.value)} className="block border-2 border-slate-400 focus:outline-none rounded-md p-2.5" placeholder="••••••"/>
                    </div>
                    <button className="bg-primary text-white py-2.5 px-6 rounded-full w-full">Login</button>
                </div>
            </form>
        </div>
     );
}
 
export default Login;