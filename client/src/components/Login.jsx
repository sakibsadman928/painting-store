import React from 'react'
import { useAppContext } from '../context/AppContext';

const Login = () => {
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const { setShowUserLogin, setUser, setAdmin, navigate } = useAppContext();

    const handleAdminLogin = async (email, password) => {
        const response = await fetch('http://localhost:4000/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (data.success) {
            setAdmin({
                email: data.admin.email,
                role: 'admin'
            });
            setShowUserLogin(false);
            navigate("/admin");
            return true;
        }
        return false;
    };

    const handleUserLogin = async (email, password) => {
        const response = await fetch('http://localhost:4000/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            setUser({
                email: data.user.email,
                name: data.user.name,
                id: data.user.id
            });
            setShowUserLogin(false);
            navigate("/");
            return true;
        } else {
            alert(data.message || 'Login failed');
            return false;
        }
    };

    const handleUserRegister = async (name, email, password) => {
        const response = await fetch('http://localhost:4000/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (data.success) {
            setUser({
                email: data.user.email,
                name: data.user.name,
                id: data.user.id
            });
            setShowUserLogin(false);
            navigate("/");
            return true;
        } else {
            alert(data.message || 'Registration failed');
            return false;
        }
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            if (state === "login") {
                const isAdminLogin = await handleAdminLogin(email, password);
                if (!isAdminLogin) {
                    await handleUserLogin(email, password);
                }
            } else {
                await handleUserRegister(name, email, password);
            }
        } catch (error) {
            console.error('Authentication error:', error);
            alert('Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div onClick={() => setShowUserLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'>
            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
                <p className="text-2xl font-medium m-auto">
                    <span className="text-[#bb86fc]">User</span> {state === "login" ? "Login" : "Sign Up"}
                </p>
                
                <div className="w-full text-xs text-center text-gray-500 bg-gray-50 p-2 rounded">
                    Admin Login: admin@paletteplay.com / admin123
                </div>

                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>
                        <input 
                            onChange={(e) => setName(e.target.value)} 
                            value={name} 
                            placeholder="Enter your name" 
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-[#bb86fc]" 
                            type="text" 
                            required 
                        />
                    </div>
                )}
                
                <div className="w-full">
                    <p>Email</p>
                    <input 
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email} 
                        placeholder="Enter your email" 
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-[#bb86fc]" 
                        type="email" 
                        required 
                    />
                </div>
                
                <div className="w-full">
                    <p>Password</p>
                    <input 
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password} 
                        placeholder="Enter your password" 
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-[#bb86fc]" 
                        type="password" 
                        required 
                    />
                </div>
                
                {state === "register" ? (
                    <p>
                        Already have account? <span onClick={() => setState("login")} className="text-[#bb86fc] cursor-pointer">click here</span>
                    </p>
                ) : (
                    <p>
                        Create an account? <span onClick={() => setState("register")} className="text-[#bb86fc] cursor-pointer">click here</span>
                    </p>
                )}
                
                <button 
                    type="submit"
                    disabled={loading}
                    className="bg-[#bb86fc] hover:bg-[#9b6fe5] transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50"
                >
                    {loading ? "Please wait..." : (state === "register" ? "Create Account" : "Login")}
                </button>
            </form>
        </div>
    )
}

export default Login