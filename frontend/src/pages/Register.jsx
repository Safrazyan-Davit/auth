import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
    const { register } = useContext(AuthContext);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div>
            <h2>Register</h2>

            <input placeholder="name" onChange={(e) => setName(e.target.value)} />
            <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />

            <button onClick={() => register({ name, email, password })}>
                Register
            </button>
        </div>
    );
}