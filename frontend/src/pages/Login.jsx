import { useState, useContext } from "react";
import { AuthContext } from "../context/authContextValue";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        const result = await login({ email, password });

        if (result.ok) {
            navigate("/");
            return;
        }

        setError(result.message || "Login failed");
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>

            <input value={email} placeholder="email" onChange={(e) => setEmail(e.target.value)} />
            <input value={password} type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />

            {error && <p>{error}</p>}

            <button type="submit">
                Login
            </button>
        </form>
    );
}
