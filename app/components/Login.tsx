'use client';

import { useState } from 'react';
import { useAuth } from '../../context/Authcontext';
import { useRouter } from 'next/navigation';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { signUp, login, loginWithGoogle } = useAuth();
const router= useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signUp(email, password);
        alert('Account created successfully!');
      } else {
        await login(email, password);
        alert('Logged in successfully!');
        router.push('/dashboard');

      }
    } catch (error:string | any) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      alert('Logged in with Google!');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-40 py-20 p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className=" text-black text-2xl font-bold mb-6">{isSignUp ? 'Sign Up' : 'Login'}</h2>
      
      <form onSubmit={handleSubmit} className=" text-black space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className=" text-black w-full px-4 py-2 border rounded-lg"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className=" text-black w-full px-4 py-2 border rounded-lg"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </form>

      <button
        onClick={handleGoogleLogin}
        className="w-full mt-4 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
      >
        Continue with Google
      </button>

      <p className=" text-black mt-4 text-center">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-600 hover:underline"
        >
          {isSignUp ? 'Login' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
}