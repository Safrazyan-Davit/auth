import { useContext } from "react";
import { AuthContext } from "../context/authContextValue";

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome {user?.name}</p>

            <button onClick={logout}>Logout</button>
        </div>
    );
}
