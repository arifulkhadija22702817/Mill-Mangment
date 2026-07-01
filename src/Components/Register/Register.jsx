import React, { Component } from "react";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";
import { Link } from "react-router-dom";
import { auth } from "../Firebase/Firebase";
import { FaEye, FaEyeSlash } from "react-icons/fa";

class Register extends Component {
    state = {
        error: "",
        success: "",
        terms: "",
        Email: "",
        showPassword: false,
    };

    clearMessages = () => {
        setTimeout(() => {
            this.setState({
                error: "",
                success: "",
                terms: "",
                Email: "",
            });
        }, 2000);
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
        });

        // Password Validation
        if (password.length < 6) {
            this.setState({
                error: "Password must be at least 6 characters.",
            });
            this.clearMessages();
            return;
        }

        if (!/[A-Z]/.test(password)) {
            this.setState({
                error: "Password must contain at least one uppercase letter.",
            });
            this.clearMessages();
            return;
        }

        if (!/[a-z]/.test(password)) {
            this.setState({
                error: "Password must contain at least one lowercase letter.",
            });
            this.clearMessages();
            return;
        }

        if (!/[0-9]/.test(password)) {
            this.setState({
                error: "Password must contain at least one number.",
            });
            this.clearMessages();
            return;
        }

        if (!terms) {
            this.setState({
                terms: "Please accept the Terms and Conditions.",
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
                success: "Registration successful!",
                Email:
                    "Verification email has been sent. Please check your inbox and verify your email before logging in.",
            });

            this.clearMessages();
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
            });

            this.clearMessages();
        }
    };

    render() {
        return (
            <div className="hero bg-base-200 min-h-screen">
                <div className="hero-content flex-col">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-green-500">
                            Registration Now
                        </h1>
                    </div>

                    <div className="card bg-base-100 w-full max-w-sm shadow-2xl mt-16">
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
                                        className="input border border-green-800 
                                       text-lg focus:border-green-500 outline-none text-red-300"
                                    />

                                    <label className="text-green-500 text-3xl mt-3">
                                        Password
                                    </label>

                                    <div className="relative">
                                        <input
                                            type={
                                                this.state.showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            placeholder="Enter your password"
                                            className="input w-full pr-12 border border-green-800 focus:border-green-500 
                                           text-lg outline-none text-red-300"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                this.setState({
                                                    showPassword:
                                                        !this.state
                                                            .showPassword,
                                                })
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-green-500 hover:text-white"
                                        >
                                            {this.state.showPassword ? (
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
                                        />
                                        <p className="text-green-400 text-md">
                                            Accept our Terms and Conditions?
                                        </p>
                                    </label>

                                    <button className="btn btn-neutral bg-green-700 mt-5 hover:bg-green-400 hover:text-black text-xl py-4">
                                        Register
                                    </button>

                                    <p className="mt-6 bg-gradient-to-r from-green-400 to-green-800 bg-clip-text text-transparent text-lg">
                                        Already have an account?
                                        <Link
                                            to="/login"
                                            className="text-blue-500 ml-2 hover:text-purple-400"
                                        >
                                            Login
                                        </Link>
                                    </p>
                                </fieldset>
                            </form>

                            {this.state.error && (
                                <p className="text-red-500 mt-3 text-center font-medium">
                                    {this.state.error}
                                </p>
                            )}

                            {this.state.success && (
                                <p className="text-green-500 mt-3 text-center font-medium">
                                    {this.state.success}
                                </p>
                            )}

                            {this.state.terms && (
                                <p className="text-red-500 mt-3 text-center font-medium">
                                    {this.state.terms}
                                </p>
                            )}

                            {this.state.Email && (
                                <p className="text-blue-500 mt-3 text-center font-medium">
                                    {this.state.Email}
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