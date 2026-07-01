import React, { Component } from "react";
import {
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    onAuthStateChanged,
    sendPasswordResetEmail,
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
        isVerifying: false,
        email: "",
        isManualLogin: false, // ম্যানুয়াল লগইন ট্র্যাক করার জন্য
    };

    componentDidMount() {
        this.unsubscribe = onAuthStateChanged(auth, async (user) => {
            // শুধুমাত্র ম্যানুয়াল লগইনের সময় auto-login করবে
            if (user && this.state.isManualLogin) {
                await user.reload();
                if (user.emailVerified) {
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
                            isManualLogin: false,
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
        if (this.verificationInterval) {
            clearInterval(this.verificationInterval);
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
            isManualLogin: true, // ম্যানুয়াল লগইন মার্ক করা
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
                    isVerifying: true,
                    isManualLogin: false, // রিসেট করা
                });

                this.clearMessages();

                this.verificationInterval = setInterval(async () => {
                    await result.user.reload();

                    if (result.user.emailVerified) {
                        clearInterval(this.verificationInterval);

                        this.setState({
                            success: "Email verified! Logging in...",
                            isVerifying: false,
                            isLoading: true,
                            isManualLogin: true,
                        });

                        setTimeout(() => {
                            this.setState({
                                success: "Login successful!",
                                isLoading: false,
                                unverifiedUser: null,
                                isManualLogin: false,
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
                isManualLogin: false,
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
                isManualLogin: false,
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
                        isManualLogin: true,
                    });

                    setTimeout(() => {
                        this.setState({
                            success: "Login successful!",
                            isLoading: false,
                            unverifiedUser: null,
                            isManualLogin: false,
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
                <div className="hero-content flex-col w-full max-w-4xl"> {/* container width বাড়ানো */}
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-purple-600">
                            Login Now!
                        </h1>
                    </div>

                    <form onSubmit={this.handleLogin} className="w-full max-w-2xl"> {/* ফর্ম width বাড়ানো */}
                        <div className="card bg-base-100 w-full shadow-2xl mt-16"> {/* max-w-sm সরিয়ে ফেলা */}
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
                                        className="input w-full border border-purple-800 focus:border-purple-400 outline-none text-green-400 text-lg p-4" // বড় ইনপুট
                                        disabled={isLoading || isVerifying}
                                        value={this.state.email}
                                        onChange={(e) => this.setState({ email: e.target.value })}
                                    />

                                    <label className="text-purple-400 text-3xl mt-3">
                                        Password
                                    </label>

                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            required
                                            placeholder="Enter your password"
                                            className="input w-full pr-12 border border-purple-800 focus:border-purple-400 outline-none text-green-400 text-lg p-4" // বড় ইনপুট
                                            disabled={isLoading || isVerifying}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                this.setState({
                                                    showPassword: !showPassword,
                                                })
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-purple-500 hover:text-white"
                                        >
                                            {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                                        </button>
                                    </div>

                                    <div className="my-3">
                                        <NavLink
                                            to="/forgot-password"
                                            className="text-red-400 hover:text-red-600 text-lg"
                                        >
                                            Forgot Password?
                                        </NavLink>
                                    </div>

                                    <button
                                        className="btn btn-primary bg-purple-900 hover:bg-purple-500 hover:text-black text-xl py-4" // বড় বাটন
                                        disabled={isLoading || isVerifying}
                                    >
                                        {isLoading ? "Logging in..." :
                                            isVerifying ? "Waiting for verification..." :
                                                "Login"}
                                    </button>

                                    <p className="mt-5 bg-gradient-to-r from-purple-400 to-purple-800 bg-clip-text text-transparent text-lg">
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

                    {/* Error, Success এবং অন্যান্য এলিমেন্ট */}
                    {error && (
                        <p className="text-red-500 mt-3 text-center font-medium text-lg">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="text-green-500 mt-3 text-center font-medium text-lg">
                            {success}
                        </p>
                    )}

                    {unverifiedUser && !isVerifying && (
                        <button
                            onClick={this.handleResendVerification}
                            className="btn btn-warning mt-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-lg px-8 py-3"
                            disabled={isLoading}
                        >
                            {isLoading ? "Sending..." : "Resend Verification Email"}
                        </button>
                    )}

                    {isVerifying && (
                        <div className="mt-3 text-center">
                            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
                            <p className="text-purple-500 mt-2 font-medium text-lg">
                                Waiting for email verification...
                            </p>
                            <p className="text-sm text-gray-400 text-base">
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