import { Link } from "react-router-dom";
import { ArrowRight, Link2 } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center  justify-center bg-black">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover z-0"
      >
        <source src= {'/TrailVideo.mp4'} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Content */}
      <div className="relative z-20 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white">
          Your Next Adventure Starts <br /> <span className="text-green-400">Here</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Discover trails, join hiking groups, and prepare for your next outdoor experience with TrailSathi.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link
            to="/trails"
            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md text-base font-semibold transition"
          >
            Explore Trails <Link2 className="ml-2 h-5 w-5" />
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-md text-base font-semibold transition"
          >
            Sign Up <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
