import error from "../images/error.png"
import { useNavigate } from "react-router-dom";


const Error = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      <div className="flex flex-col items-center mt-[3rem] w-[50%] ">
        <h1 className="inline-block text-transparent bg-clip-text text-[9rem] font-bold bg-gradient-to-r from-blue-400 to-emerald-400">Oops!</h1>
        <p className="text-2xl font-bold text-gray-700 mt-4">404 - Page not found.</p>
        <p className="text-lg text-gray-700 mt-4 px-10">The page you are trying to access may no longer exist, its name may have been modified, or it might be temporarily inaccessible.</p>
        <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-8"
            onClick={goBack}
          >
            Go Back
        </button>
      </div>
      <div className="mt-8">
        <img src={error} alt="Error" className=" h-full" />
      </div>
    </div>
  )
}

export default Error