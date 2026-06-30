import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Navbar extends Component {
    render() {
        
        const Links = [
            { name: "Home", path: "/" },
            { name: "Mill Rate", path: "/mill-rate" },
            { name: "Present Mill", path: "/present-mill" },
            { name: "Big Market", path: "/big-market" },
            { name: "Daily Market", path: "/daily-market" }
        ];

        return (
            <div className="navbar bg-gradient-to-r from-green-900 to-green-800 shadow-sm sticky top-0 z-50">
                <div className="navbar-start p-2">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="m-3 lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 rounded-md" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        <ul
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-4 w-52 shadow">
                            {Links.map((Link) => (
                                <li key={Link.path}>
                                    <NavLink
                                        to={Link.path}
                                        className={({ isActive }) =>
                                            `px-3 py-1
                                         rounded-md
                                         border-2 border-green-400
                                         mt-0.5 
                                         text-[#01ff2b] 
                                         
                                         transition-all duration-300 ${isActive
                                                ? "bg-gradient-to-r from-green-500 to-green-800 text-white"
                                                : "hover:bg-[#380747]"
                                            }`
                                        }
                                    >
                                        {Link.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <a className="text-md md:text-2xl lg:text-2xl font-bold bg-clip-text bg-green-400 text-transparent ml-2">
                        Mill Manegment
                    </a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 text-base lg:text-sm">
                        {Links.map((Link) => (
                            <li key={Link.path}>
                                <NavLink
                                    to={Link.path}
                                    className={({ isActive }) =>
                                        `px-3 py-1 rounded-md transition-all
                                    ml-2
                                    text-[#01ff2b]
                                    border-2 border-green-400  duration-300
     ${isActive
                                            ? "bg-gradient-to-r from-green-500 to-green-800 text-white"
                                            : "hover:bg-[#380747]"
                                        }`
                                    }
                                >
                                    {Link.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="navbar-end mr-3 gap-5">
                    <NavLink to={"/Login"} className="bg-green-500 rounded-md px-4 py-2 text-black transition delay-150 duration-300 ease-in-out hover:-translate-y-2 hover:scale-110">Login</NavLink>
                    <NavLink to={"/Register"} className="bg-red-300 rounded-md px-4 py-2 text-black transition delay-150 duration-300 ease-in-out hover:-translate-y-2 hover:scale-110">Registration</NavLink>
                </div>
            </div>
        );
    }
}

export default Navbar;
