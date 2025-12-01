"use client";
import Image from "next/image";
import herosection from "../../public/herosection.jpg"
import {useAuth} from "../../context/Authcontext";
import {useRouter} from "next/navigation";

function Herosection() {
    const {user , logout}=useAuth();
    const router=useRouter();

    const handleAuthClick=()=>{
        if(user){
            logout();
        }else{
            router.push("/login");
        }
    }
    return (
       <div className="min-h-screen bg-white">
     
      <nav className="flex justify-between items-center px-16 py-6">
      
        <div className="flex items-center gap-2">
          <div className="flex w-8 h-8">
            <div className="w-4 h-8 bg-orange-500 rounded-l-full"></div>
            <div className="w-4 h-8 bg-blue-500 rounded-r-full"></div>
          </div>
          <span className="text-xl font-semibold text-gray-800">Feedback Pluse</span>
        </div>

   
        <div className="flex gap-4">
        {user ?(
            <>
            <span className="px-6 py-2.5 text-gray-700">
                {user.email}
            </span>
            <button
            onClick={handleAuthClick}
            className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
            Logout
            </button>
            </>
        ):( <button
                onClick={() => router.push("/Auth/login")}
                className="px-6 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Login
              </button>
        )}
          <button
  onClick={() => router.push('/Auth/signup')}
  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
>
  Sign up
</button>
        </div>
      </nav>

<div className="flex items-center justify-between px-16 py-10 max-w-7xl mx-auto gap-12">
        {/* Left Content */}
        <div className="flex-1 max-w-2xl">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            Get feedback.<br />
            Make your customers<br />
            happy.
          </h1>
          
          <p className="text-xl text-gray-500 mb-4">
            Collect Bug, features and Sentiment with a code snippet.
          </p>
          <p className="text-xl text-gray-500 mb-10">
            Dive deep with the dashboard.
          </p>

          <div className="flex items-center gap-6">
            <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              Get started for free
              <span className="text-lg">›</span>
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-end">
          <Image 
            src={herosection} 
            alt="herosection image"
            className="w-full h-auto max-w-xl object-contain"
          />
        </div>
        
      
      </div>
    </div>

    )}

    export default Herosection;