// Root.jsx
import React, { Component } from 'react';
import Navbar from '../Header/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';
import {auth} from '../Firebase/Firebase';
import { onAuthStateChanged } from 'firebase/auth';

class Root extends Component {
    state = {
        user: null,
        loading: true
    };

    componentDidMount() {
        this.unsubscribe = onAuthStateChanged(auth, (user) => {
            this.setState({ user, loading: false });
        });
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    render() {
        const { user, loading } = this.state;

        if (loading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-[#010704] text-white">
                <Navbar user={user} /> {/* user prop পাঠান */}
                <Outlet />
                <Footer />
            </div>
        );
    }
}

export default Root;