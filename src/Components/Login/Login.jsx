import React, { Component } from "react";
import {
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    onAuthStateChanged,
} from "firebase/auth";
import { Link, NavLink } from "react-router-dom";
import { auth } from "../Firebase/Firebase";
import { FaEye, FaEyeSlash } from "react-icons/fa";

class Login extends Component {
    state = {
        error: "",
        success: "",
        showPassword: false,
        unverifiedUser: null,
        isLoading: false,
        isVerifying: false, // ভেরিফিকেশন চেক করার জন্য
    };

    componentDidMount() {
        // ইউজারের স্টেট চেক করা
        this.unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // ইউজার লগইন থাকলে
                await user.reload();
                
                if (user.emailVerified) {
                    // ইমেইল ভেরিফাইড হলে অটো লগইন
                    this.setState({
                        success: "Email verified! Logging in...",
                        isVerifying: false,
                        isLoading: true,
                    });

                    setTimeout(() => {
                        this.setState({
                            success: "Login successful!",
                            isLoading: false,
                            unverifiedUser: null,
                        });
                        this.clearMessages();
                    }, 1500);
                }
            }
        });
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    clearMessages = () => {
        setTimeout(() => {
            this.setState({
                error: "",
                success: "",
            });
        }, 2000);
    };

    handleLogin = async (e) => {
        e.preventDefault();

        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        this.setState({
            error: "",
            success: "",
            isLoading: true,
        });

        try {
            const result = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            await result.user.reload();

            if (!result.user.emailVerified) {
                await signOut(auth);

                this.setState({
                    error: "Your email is not verified. Please verify your email first.",
                    unverifiedUser: result.user,
                    isLoading: false,
                    isVerifying: true, // ভেরিফিকেশন চেক শুরু
                });

                this.clearMessages();

                // প্রতি 3 সেকেন্ড পর পর ইমেইল ভেরিফাইড কিনা চেক করবে
                this.verificationInterval = setInterval(async () => {
                    await result.user.reload();
                    
                    if (result.user.emailVerified) {
                        clearInterval(this.verificationInterval);
                        
                        this.setState({
                            success: "Email verified! Logging in...",
                            isVerifying: false,
                            isLoading: true,
                        });

                        // অটো লগইন
                        setTimeout(() => {
                            this.setState({
                                success: "Login successful!",
                                isLoading: false,
                                unverifiedUser: null,
                            });
                            this.clearMessages();
                        }, 1500);
                    }
                }, 3000);

                return;
            }

            form.reset();

            this.setState({
                success: "Login successful!",
                unverifiedUser: null,
                isLoading: false,
                isVerifying: false,
            });

            this.clearMessages();
        } catch (error) {
            let errorMessage = "";

            switch (error.code) {
                case "auth/invalid-credential":
                    errorMessage = "Invalid email or password.";
                    break;
                case "auth/invalid-email":
                    errorMessage = "Please enter a valid email.";
                    break;
                case "auth/user-disabled":
                    errorMessage = "This account has been disabled.";
                    break;
                case "auth/too-many-requests":
                    errorMessage = "Too many failed attempts. Please try again later.";
                    break;
                default:
                    errorMessage = error.message;
            }

            this.setState({
                error: errorMessage,
                isLoading: false,
                isVerifying: false,
            });

            this.clearMessages();
        }
    };

    handleResendVerification = async () => {
        const { unverifiedUser } = this.state;

        if (!unverifiedUser) {
            this.setState({
                error: "No user found. Please try logging in again.",
            });
            this.clearMessages();
            return;
        }

        this.setState({ isLoading: true });

        try {
            await sendEmailVerification(unverifiedUser);

            this.setState({
                success: "Verification email sent again! Please check your Gmail.",
                isLoading: false,
                isVerifying: true,
            });

            this.clearMessages();

            // রিসেন্ড করার পরেও ভেরিফিকেশন চেক করতে থাকবে
            if (this.verificationInterval) {
                clearInterval(this.verificationInterval);
            }

            this.verificationInterval = setInterval(async () => {
                await unverifiedUser.reload();
                
                if (unverifiedUser.emailVerified) {
                    clearInterval(this.verificationInterval);
                    
                    this.setState({
                        success: "Email verified! Logging in...",
                        isVerifying: false,
                        isLoading: true,
                    });

                    setTimeout(() => {
                        this.setState({
                            success: "Login successful!",
                            isLoading: false,
                            unverifiedUser: null,
                        });
                        this.clearMessages();
                    }, 1500);
                }
            }, 3000);

        } catch (error) {
            let errorMessage = "";

            switch (error.code) {
                case "auth/too-many-requests":
                    errorMessage = "Too many requests. Please try again later.";
                    break;
                default:
                    errorMessage = error.message || "Failed to send verification email.";
            }

            this.setState({
                error: errorMessage,
                isLoading: false,
            });

            this.clearMessages();
        }
    };

    render() {
        const { error, success, showPassword, unverifiedUser, isLoading, isVerifying } = this.state;

        return (
            <div className="hero bg-base-200 min-h-screen">
                <div className="hero-content flex-col">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-purple-600">
                            Login Now!
                        </h1>
                    </div>

                    <form onSubmit={this.handleLogin}>
                        <div className="card bg-base-100 w-full max-w-sm shadow-2xl mt-16">
                            <div className="card-body">
                                <fieldset className="fieldset">
                                    <label className="text-purple-400 text-3xl">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="Enter your email"
                                        className="input border border-purple-800 focus:border-purple-400 outline-none text-green-400"
                                        disabled={isLoading || isVerifying}
                                    />

                                    <label className="text-purple-400 text-3xl mt-3">
                                        Password
                                    </label>

                                    <div className="relative">
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            required
                                            placeholder="Enter your password"
                                            className="input w-full pr-12 border border-purple-800 focus:border-purple-400 outline-none text-green-400"
                                            disabled={isLoading || isVerifying}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                this.setState({
                                                    showPassword: !showPassword,
                                                })
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 border border-purple-500 rounded-md p-2 hover:bg-purple-500 hover:text-white"
                                        >
                                            {showPassword ? (
                                                <FaEye />
                                            ) : (
                                                <FaEyeSlash />
                                            )}
                                        </button>
                                    </div>

                                    <div className="my-3">
                                        <NavLink
                                            to="/forgot-password"
                                            className="text-red-400 hover:text-red-600"
                                        >
                                            Forgot Password?
                                        </NavLink>
                                    </div>

                                    <button 
                                        className="btn btn-primary bg-purple-900 hover:bg-purple-500 hover:text-black"
                                        disabled={isLoading || isVerifying}
                                    >
                                        {isLoading ? "Logging in..." : 
                                         isVerifying ? "Waiting for verification..." : 
                                         "Login"}
                                    </button>

                                    <p className="mt-5 bg-gradient-to-r from-purple-400 to-purple-800 bg-clip-text text-transparent">
                                        Don't have an account?
                                        <Link
                                            to="/register"
                                            className="text-blue-500 ml-2 hover:text-green-500"
                                        >
                                            Register
                                        </Link>
                                    </p>
                                </fieldset>
                            </div>
                        </div>
                    </form>

                    {error && (
                        <p className="text-red-500 mt-3 text-center font-medium">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="text-green-500 mt-3 text-center font-medium">
                            {success}
                        </p>
                    )}

                    {unverifiedUser && !isVerifying && (
                        <button
                            onClick={this.handleResendVerification}
                            className="btn btn-warning mt-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold"
                            disabled={isLoading}
                        >
                            {isLoading ? "Sending..." : "Resend Verification Email"}
                        </button>
                    )}

                    {isVerifying && (
                        <div className="mt-3 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                            <p className="text-purple-500 mt-2 font-medium">
                                Waiting for email verification...
                            </p>
                            <p className="text-sm text-gray-400">
                                Please check your Gmail and click the verification link
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Login;