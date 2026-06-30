import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Footer extends Component {
    render() {
        return (
            <footer className="footer sm:footer-horizontal bg-base-300 text-base-content p-10 flex justify-around">
                <nav>
                    <h1 className='text-green-400 text-2xl'>Developed by</h1>
                    <span className='my-4 text-xl bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent hover:text-green-400'><NavLink to='https://www.facebook.com/share/1BQVg8B6Xk/'>Ariful Islam</NavLink></span>
                </nav>

                <nav className="flex flex-col items-center text-center">
                    <h6 className="text-green-400 text-2xl">Social</h6>


                    <NavLink to='https://www.facebook.com/share/1BQVg8B6Xk/'>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            className="fill-current gap-2 hover:opacity-80 transition my-4"
                        >
                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                        </svg>
                    </NavLink>


                </nav>

            </footer >
        );
    }
}

export default Footer;
