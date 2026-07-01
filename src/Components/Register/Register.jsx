import React, { Component } from "react";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";
import { Link, Navigate } from "react-router-dom";
import { auth } from "../Firebase/Firebase";
import { FaEye, FaEyeSlash } from "react-icons/fa";

class Register extends Component {
    state = {
        error: "",
        success: "",
        terms: "",
        Email: "",
        showPassword: false,
        redirectToHome: false,
        isLoading: false, // NEW: লোডিং স্টেট যোগ করুন
    };

    clearMessages = () => {
        setTimeout(() => {
            this.setState({
                error: "",
                success: "",
                terms: "",
                Email: "",
                // ✅ redirectToHome রিসেট করবেন না
            });
        }, 3000); // 3 সেকেন্ড
    };

    handleRegister = async (event) => {
        event.preventDefault();

        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        const terms = form.terms.checked;

        this.setState({
            error: "",
            success: "",
            terms: "",
            Email: "",
            redirectToHome: false,
            isLoading: true, // লোডিং শুরু
        });

        // Password Validation
        if (password.length < 6) {
            this.setState({
                error: "Password must be at least 6 characters.",
                isLoading: false,
            });
            this.clearMessages();
            return;
        }

        if (!/[A-Z]/.test(password)) {
            this.setState({
                error: "Password must contain at least one uppercase letter.",
                isLoading: false,
            });
            this.clearMessages();
            return;
        }

        if (!/[a-z]/.test(password)) {
            this.setState({
                error: "Password must contain at least one lowercase letter.",
                isLoading: false,
            });
            this.clearMessages();
            return;
        }

        if (!/[0-9]/.test(password)) {
            this.setState({
                error: "Password must contain at least one number.",
                isLoading: false,
            });
            this.clearMessages();
            return;
        }

        if (!terms) {
            this.setState({
                terms: "Please accept the Terms and Conditions.",
                isLoading: false,
            });
            this.clearMessages();
            return;
        }

        try {
            // Account Create
            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            // Verification Email Send
            await sendEmailVerification(result.user);

            form.reset();

            this.setState({
                success: "Registration successful! 🎉",
                Email: "Verification email has been sent. Please check your inbox and verify your email before logging in.",
                isLoading: false,
                redirectToHome: true, // ✅ রেজিস্টার成功后 true
            });

            this.clearMessages();

            // ⏰ 3 সেকেন্ড পর Redirect হবে (clearMessages এর timeout এর সাথে মিলিয়ে)
            setTimeout(() => {
                this.setState({
                    redirectToHome: true,
                });
            }, 3000);

        } catch (error) {
            let errorMessage = "";

            switch (error.code) {
                case "auth/email-already-in-use":
                    errorMessage = "This email is already in use.";
                    break;

                case "auth/invalid-email":
                    errorMessage = "Please enter a valid email.";
                    break;

                case "auth/weak-password":
                    errorMessage = "Password should be at least 6 characters.";
                    break;

                default:
                    errorMessage = error.message;
            }

            this.setState({
                error: errorMessage,
                isLoading: false,
                redirectToHome: false,
            });

            this.clearMessages();
        }
    };

    render() {
        const { error, success, terms, Email, showPassword, redirectToHome, isLoading } = this.state;

        // ✅ Redirect চেক
        if (redirectToHome) {
            return <Navigate to="/" replace />;
        }

        return (
            <div className="hero bg-base-200 min-h-screen">
                <div className="hero-content flex-col w-full max-w-4xl"> {/* ✅ Container width বাড়ানো */}
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-green-500">
                            Registration Now
                        </h1>
                    </div>

                    <div className="card bg-base-100 w-full shadow-2xl mt-16 max-w-2xl"> {/* ✅ Card width বাড়ানো */}
                        <div className="card-body">
                            <form onSubmit={this.handleRegister}>
                                <fieldset className="fieldset relative">
                                    <label className="text-green-500 text-3xl">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="Enter your email"
                                        className="input w-full border border-green-800 text-lg focus:border-green-500 outline-none text-red-300 p-4" // ✅ Full width
                                        disabled={isLoading} // ✅ Loading এ disable
                                    />

                                    <label className="text-green-500 text-3xl mt-3">
                                        Password
                                    </label>

                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Enter your password"
                                            className="input w-full pr-12 border border-green-800 focus:border-green-500 text-lg outline-none text-red-300 p-4" // ✅ Full width
                                            disabled={isLoading} // ✅ Loading এ disable
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                this.setState({
                                                    showPassword: !showPassword,
                                                })
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-green-500 hover:text-white"
                                            disabled={isLoading}
                                        >
                                            {showPassword ? (
                                                <FaEye size={20} />
                                            ) : (
                                                <FaEyeSlash size={20} />
                                            )}
                                        </button>
                                    </div>

                                    <label className="flex gap-3 my-6">
                                        <input
                                            type="checkbox"
                                            name="terms"
                                            className="checkbox border-green-800 checked:border-green-400 accent-green-400"
                                            disabled={isLoading} // ✅ Loading এ disable
                                        />
                                        <p className="text-green-400 text-md">
                                            Accept our Terms and Conditions?
                                        </p>
                                    </label>

                                    <button 
                                        className="btn btn-neutral bg-green-700 mt-5 hover:bg-green-400 hover:text-black text-xl py-4"
                                        disabled={isLoading} // ✅ Loading এ disable
                                    >
                                        {isLoading ? "Registering..." : "Register"} {/* ✅ Loading text */}
                                    </button>

                                    <p className="mt-6 bg-gradient-to-r from-green-400 to-green-800 bg-clip-text text-transparent text-lg">
                                        Already have an account?
                                        <Link
                                            to="/login"
                                            className="text-blue-500 ml-2 hover:text-purple-400"
                                            style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                                        >
                                            Login
                                        </Link>
                                    </p>
                                </fieldset>
                            </form>

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

                            {terms && (
                                <p className="text-red-500 mt-3 text-center font-medium text-lg">
                                    {terms}
                                </p>
                            )}

                            {Email && (
                                <p className="text-blue-500 mt-3 text-center font-medium text-lg">
                                    {Email}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;