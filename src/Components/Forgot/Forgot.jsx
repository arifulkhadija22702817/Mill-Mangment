import React, { Component } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";
import { auth } from "../Firebase/Firebase";

class ForgotPassword extends Component {
    state = {
        email: "",
        error: "",
        success: "",
        isLoading: false,
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { email } = this.state;

        if (!email) {
            this.setState({
                error: "Please enter your email address",
            });
            this.clearMessages();
            return;
        }

        this.setState({
            isLoading: true,
            error: "",
            success: "",
        });

        try {
            await sendPasswordResetEmail(auth, email, {
                url: window.location.origin + "/login",
                handleCodeInApp: false,
            });

            this.setState({
                success: "✅ Password reset email sent! Please check your Gmail.",
                isLoading: false,
                email: "",
            });

            this.clearMessages();
        } catch (error) {
            let errorMessage = "";

            switch (error.code) {
                case "auth/user-not-found":
                    errorMessage = "No account found with this email address.";
                    break;
                case "auth/invalid-email":
                    errorMessage = "Please enter a valid email address.";
                    break;
                case "auth/too-many-requests":
                    errorMessage = "Too many requests. Please try again later.";
                    break;
                default:
                    errorMessage = error.message || "Failed to send reset email.";
            }

            this.setState({
                error: errorMessage,
                isLoading: false,
            });

            this.clearMessages();
        }
    };

    clearMessages = () => {
        setTimeout(() => {
            this.setState({
                error: "",
                success: "",
            });
        }, 5000);
    };

    handleChange = (e) => {
        this.setState({
            email: e.target.value,
        });
    };

    render() {
        const { email, error, success, isLoading } = this.state;

        return (
            <div className="hero bg-base-200 min-h-screen">
                <div className="hero-content flex-col">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-purple-600">
                            Forgot Password
                        </h1>
                        <p className="text-gray-400 mt-2">
                            Enter your email to receive a password reset link
                        </p>
                    </div>

                    <form onSubmit={this.handleSubmit}>
                        <div className="card bg-base-100 w-full max-w-sm shadow-2xl mt-16">
                            <div className="card-body">
                                <fieldset className="fieldset">
                                    <label className="text-purple-400 text-3xl">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={this.handleChange}
                                        required
                                        placeholder="Enter your registered email"
                                        className="input border border-purple-800 focus:border-purple-400 outline-none text-green-400"
                                        disabled={isLoading}
                                    />

                                    <button
                                        type="submit"
                                        className="btn btn-primary bg-purple-900 hover:bg-purple-500 hover:text-black mt-4"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Sending..." : "Send Reset Link"}
                                    </button>

                                    <p className="mt-5 bg-gradient-to-r from-purple-400 to-purple-800 bg-clip-text text-transparent">
                                        Remember your password?
                                        <Link
                                            to="/login"
                                            className="text-blue-500 ml-2 hover:text-green-500"
                                        >
                                            Back to Login
                                        </Link>
                                    </p>
                                </fieldset>
                            </div>
                        </div>
                    </form>

                    {error && (
                        <div className="alert alert-error shadow-lg mt-4 max-w-sm w-full">
                            <div>
                                <span>❌</span>
                                <span className="font-medium">{error}</span>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success shadow-lg mt-4 max-w-sm w-full">
                            <div>
                                <span>✅</span>
                                <span className="font-medium">{success}</span>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="mt-4 text-center text-sm text-gray-400 max-w-sm">
                            <p>📧 Please check your email inbox (and spam folder) for the reset link.</p>
                            <p className="mt-1">The link will expire in 1 hour.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default ForgotPassword;