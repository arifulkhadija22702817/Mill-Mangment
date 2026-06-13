import React, { Component } from 'react';

class Error extends Component {
    render() {
        return (
            <div className='max-w-7xl mx-auto my-6 grid justify-center text-center'>
                <h1 className='text-5xl text-green-400'>Page not found</h1>
                <p className='text-3xl mt-6 text-red-400'>404</p>
            </div>
        );
    }
}

export default Error;
