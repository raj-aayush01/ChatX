import { Link, useNavigate } from "react-router-dom" ;
import { useState } from "react" ;
import { signupUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "./Auth.css" ;

function Signup() {
    const [name, setName] = useState("") ;
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

        try {
            const data = await signupUser(name, email, password) ;

            if(!data || !data?.token || !data?.user){
                setError("Signup failed: Please try again.") ;
                return ;
            }

            localStorage.setItem("token", data.token) ;
            login(data.user) ;
            navigate("/chat") ;

        } catch ( err ) {
            setError( err.response?.data?.message || "Unable to create your account. Please try again.") ;
        
        } finally{
            setLoading(false) ;
        }
    }

    return(
        <div className="auth-container">
            <form className="auth-card" onSubmit={handleSubmit}>
                <div className="auth-brand">ChatX</div>

                <h1>Create Account</h1>
                <p className="auth-subtitle">Join ChatX today</p>

                {error && <p className="auth-error" role="alert">{error}</p>}

                <div className="form-group">
                    <label htmlFor="name">Name: </label>
                    <input 
                        id="name" 
                        type="text" 
                        placeholder="Enter your name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        required 
                    />
                </div>

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
                    {loading? "Creating account..." : "Sign up"}
                </button>

                <p className="auth-footer">
                    Already have an account.{" "}
                    <Link to="/login">Log in</Link>
                </p>


            </form>
        </div>
    );
}

export default Signup ;