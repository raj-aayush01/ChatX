import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/authService";
import "./Signup.css";

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Button Clicked");

        if (formData.password.length < 8) {
            alert("Password must be at least 8 characters long");
            return;
        }

        try {
            const data = await signup(formData);
            console.log("Signup Success:", data);
            navigate("/login");
            
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="signup-wrapper">
            <div className="signup-card">
                <div className="signup-header">
                    <h1 className="signup-title">Create account</h1>
                    <p className="signup-subtitle">Get started for free</p>
                </div>

                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">
                            Name
                        </label>
                        <input
                            className="form-input"
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Jane Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="form-input"
                            type="email"
                            id="email"
                            name="email"
                            placeholder="jane@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="form-input"
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Min. 8 characters"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button className="signup-btn" type="submit">
                        Create account
                    </button>
                </form>

                <p className="signup-login">
                    Already have an account?{" "}
                    <Link to="/login" className="signup-link">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;