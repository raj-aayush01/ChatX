import { Link, useNavigate } from "react-router-dom" ;
import { useState } from "react" ;
import { loginUser } from "../services/authService";
import { useAuth } from "./../context/AuthContext" ;
import "./Auth.css" ;

function Login() {
    const [email, setEmail] = useState("") ;
    const [password, setPassword] = useState("") ;
    const [error, setError] = useState("") ;
    const [loading, setLoading] = useState(false) ;

    const { login } = useAuth() ;
    const navigate = useNavigate() ;

    const handleSubmit = async (e) => {
        e.preventDefault() ;
        setError("") ;
        setLoading(true) ;
        console.log("Login form submitted");

        try {
            const data = await loginUser(email, password);

            if (!data || !data?.token || !data?.user) {
                console.log("3. IF BLOCK EXECUTED");
                setError("Login failed: authentication token was not received.");
                return;
            }

            localStorage.setItem("token", data.token);
            login(data.user);
            navigate("/chat");

        } catch ( err ) {
            console.log("Login failed — staying on login page");
            setError( err.response?.data?.message || "Unable to log in. Please try again.") ;
        
        } finally{
            setLoading(false) ;
        }
    }

    return(
        <div className="auth-container">
            <form className="auth-card" onSubmit={handleSubmit}>
                <div className="auth-brand">ChatX</div>

                <h1>Welcome Back</h1>
                <p className="auth-subtitle">Login to your ChatX account</p>

                {error && <p className="auth-error" role="alert">{error}</p>}

                <div className="form-group">
                    <label htmlFor="email">Email: </label>
                    <input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password: </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button 
                    className="auth-button"
                    type="submit"
                    disabled={loading}
                >
                    {loading? "Logging in..." : "Log in"}
                </button>

                <p className="auth-footer">
                    Don't have an account?{" "}
                    <Link to="/signup">Create one</Link>
                </p>


            </form>
        </div>
    );
}

export default Login ;