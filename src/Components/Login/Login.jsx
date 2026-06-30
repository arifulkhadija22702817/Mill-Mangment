import React, { Component } from 'react';
import { Link, NavLink } from "react-router-dom";

class Login extends Component {
    render() {
        return (
            <div>
                <div className="hero bg-base-200 min-h-screen">
                    <div className="hero-content flex-col">
                        <div className="text-center">
                            <h1 className="text-5xl font-bold text-purple-600">Login now !</h1>

                        </div>
                        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl mt-16">
                            <div className="card-body">
                                <fieldset className="fieldset">
                                    <label className="text-purple-400 text-3xl">Email</label>
                                    <input type="email" required className="input border border-purple-800 outline-none focus:border-purple-400 focus:outline-none text-green-400" placeholder="Email" name='email' />
                                    <label className="text-purple-400 text-3xl mt-2">Password</label>
                                    <input type="password" required className="input border border-purple-800 outline-none focus:border-purple-400 focus:outline-none text-green-400" placeholder="Password" name='password' />
                                    <div className='my-3 text-red-400'><NavLink className=" hover:text-red-500">Forgot password ?</NavLink></div>
                                    <button className="btn btn-primary bg-purple-900 hover:bg-purple-500 hover:text-black">
                                        Login
                                    </button>

                                    <p className="mt-4 text-lg bg-gradient-to-r from-purple-400 to-purple-800 bg-clip-text text-transparent">
                                        Don't have an account ?
                                        <Link to="/register" className="text-blue-500 p-4 ml-2 hover:text-green-400">
                                            Register
                                        </Link>
                                    </p>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
