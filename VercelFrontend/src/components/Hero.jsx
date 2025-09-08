import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center pt-24 scroll-mt-24 bg-gradient-to-b from-blue-100 to-white px-4 overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-400 via-purple-500 to-pink-500 opacity-30 animate-blob mix-blend-multiply filter blur-xl"></div>
      <div className="absolute -bottom-20 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-pink-300 via-red-300 to-yellow-300 opacity-30 animate-blob animation-delay-2000 mix-blend-multiply filter blur-xl"></div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2 relative z-10">
        
        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
          
          {/* Logo */}
          <Link to="/" className="flex justify-center lg:justify-start -mt-8">
            <img
              src="/Advestor.svg"
              alt="AdVestor Logo"
              className="h-48 w-auto drop-shadow-2xl"
            />
          </Link>

          {/* Headline */}
          <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl text-gray-900">
            Your Time <br />
            is an <span className="text-indigo-600">Asset.</span> <br />
            Let’s Make it Grow.
          </h2>

          {/* Subtext */}
          <p className="text-lg text-gray-700 max-w-md mx-auto lg:mx-0">
            Monetize your screen time. Build real wealth.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center bg-white bg-opacity-30 backdrop-blur-md rounded-3xl p-6 shadow-lg">
          <img
            src="Theam_Advestor.png" // replace with actual image path
            alt="User watching ads and growing wealth"
            className="w-full max-w-md rounded-3xl shadow-xl object-cover"
            style={{ aspectRatio: "4 / 3" }}
          />
        </div>
      </div>
    </section>
  );
}
