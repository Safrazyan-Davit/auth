import { useState, useContext } from "react";
import { AuthContext } from "../context/authContextValue";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        const result = await register({ name, email, password });

        if (result.ok) {
            navigate("/");
            return;
        }

        setError(result.message || "Registration failed");
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>

            <input value={name} placeholder="name" onChange={(e) => setName(e.target.value)} />
            <input value={email} placeholder="email" onChange={(e) => setEmail(e.target.value)} />
            <input value={password} type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />

            {error && <p>{error}</p>}

            <button type="submit">
                Register
            </button>
        </form>
    );
}
