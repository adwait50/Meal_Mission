import HomeComponents from "../components/HomeComponents";
import ContactForm from "../components/ContactForm";
import { Link } from "react-router";
import NavBar from "../components/NavBar";

function Home() {
  return (
    <div className="bg-[#141C25] w-full text-white">
      <NavBar />

      {/* Hero Section */}
      <div className="mt-8 relative flex flex-col items-center">
        <img
          className="w-[90%] md:w-[70%] h-[40vh] md:h-[65vh] rounded-3xl object-cover"
          src="https://media.istockphoto.com/id/1457738274/photo/unrecognizable-woman-hands-out-food-donations-during-charity-drive.jpg?s=612x612&w=0&k=20&c=6GjDAHu02Epgu19Zwlc7-YSxFsMmiPZWFfZTU5S2a5I="
          alt="hero"
        />
        <div className="slogan absolute top-[52%] md:top-[68%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center px-4">
          <h1 className="text-lg sm:text-3xl md:text-5xl font-bold">
            End Hunger. Stop Waste.
          </h1>
          <h5 className="mt-3 text-xs md:text-base max-w-lg mx-auto">
            We connect donors with excess food to local hunger relief
            organizations that can use it. It's good for people and the planet.
          </h5>
          <div className="flex flex-row justify-center mt-4 gap-3 font-semibold">
              <Link to="/donor-dashboard">
                <button className="bg-[#F4C752] text-[#141C25] px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-base rounded-xl hover:bg-[#141C25] hover:text-[#F4C752] transition">
                  I'm a Donor
                </button>
              </Link>
              <Link to="/ngo-dashboard">
              <button className="bg-[#1C2B36] px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-base rounded-xl hover:bg-white hover:text-[#1C2B36] transition">
                I'm an NGO
              </button>
              </Link>
          </div>

        </div>
      </div>

      {/* Mission & Vision */}
      <div className="w-[90%] p-2 md:w-[70%] mx-auto mt-10 mb-5 flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex gap-4 items-start">
          <i className="ri-lightbulb-flash-line text-6xl md:text-[7rem]" />
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl md:text-5xl font-bold">Our Mission</h1>
            <h4 className="text-sm md:text-base leading-relaxed">
              Empowering underprivileged youth through access to quality
              education and mentorship programs, fostering a future filled with
              opportunity and success.
            </h4>
          </div>
        </div>
        <div className="flex-1 flex gap-4 items-start">
          <i className="ri-team-line text-6xl md:text-[7rem]" />
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl md:text-5xl font-bold">Our Vision</h1>
            <h4 className="text-sm md:text-base leading-relaxed">
              A world where every young person, regardless of background, has
              the resources and support to reach their full potential and become
              a thriving member of society.
            </h4>
          </div>
        </div>
      </div>

      {/* What We Do */}
      <div className="w-[90%] md:w-[70%] sm:mb-53 mx-auto mt-16">
        <h1 className="text-center text-2xl sm:text-3xl md:text-[3.7rem] font-bold mb-10">
          What We Do
        </h1>
        <HomeComponents />
      </div>

      {/* Call to Action */}
      <div className="w-[90%] md:w-[70%] mx-auto sm:mt-22 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-[3.7rem] font-bold">
          Ready to make a difference?
        </h1>
        <h4 className="mt-5 text-sm md:text-lg">
          We connect donors with excess food to local hunger relief
          organizations.
        </h4>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Link to={"/donor-dashboard"}>
          <button className="bg-[#F4C752] text-[#141C25] px-4 py-2 rounded-xl font-bold text-base md:text-lg hover:bg-[#141C25] hover:text-[#F4C752] transition">
            I'm a Donor
          </button>
          </Link>
          <Link to={"/ngo-dashboard"}>
          <button className="bg-[#1C2B36] px-4 py-2 rounded-xl font-bold text-base md:text-lg hover:bg-white hover:text-[#1C2B36] transition">
            I'm an NGO
          </button>
          </Link>
        </div>
      </div>

      {/* Contact */}
      <div className="w-[90%] md:w-[70%] mx-auto mt-20">
        <ContactForm />
      </div>

      {/* Footer */}
      <footer className="bg-[#111111] w-full flex flex-col items-center justify-between py-8 mt-20 text-center">
        <div className="text-2xl flex justify-center gap-6">
          <i className="ri-facebook-circle-line hover:scale-125 transition-transform"></i>
          <i className="ri-instagram-line hover:scale-125 transition-transform"></i>
          <i className="ri-twitter-x-line hover:scale-125 transition-transform"></i>
          <i className="ri-linkedin-box-fill hover:scale-125 transition-transform"></i>
          <i className="ri-mail-line hover:scale-125 transition-transform"></i>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm md:text-base">
          <h4 className="relative group">Home</h4>
          <h4 className="relative group">News</h4>
          <h4 className="relative group">About us</h4>
          <h4 className="relative group">Our Team</h4>
          <h4 className="relative group">Contact us</h4>
        </div>
        <div className="w-full bg-black py-2 mt-4 text-xs md:text-sm">
          Copyright ©2025; Designed by team Meal mission.
        </div>
      </footer>
    </div>
  );
}

export default Home;
