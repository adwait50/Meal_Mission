import React from "react";
import HomeComponents from "../components/HomeComponents";
import ContactForm from "../components/ContactForm";
import { Link, useNavigate } from "react-router";

function Home() {
  const navComp = ["About", "Donor", "NGOs", "Stories", "Get Started"];
  return (
    <div className="bg-[#141C25] w-full text-white ">
      <nav className=" flex justify-between py-6 px-14 text-2xl border-b-[2px] border-[#1A2432] ">
        <div className="font-bold">Meal Mission</div>
        <div className="flex text-lg items-center gap-4 ">
          <div className="flex gap-8 ">
            {navComp.map((e) => (
              <h4 className="relative inline-block group transform transition-transform duration-200 hover:scale-115">
                {e}
                <span className="absolute left-0 bottom-[-2px] w-full h-0.5 bg-white transform scale-x-0 translate-x-0 transition-transform duration-300 group-hover:scale-x-100 group-hover:translate-x-0 group-focus:scale-x-100 group-focus:translate-x-0 group-active:scale-x-100 group-active:translate-x-0"></span>
              </h4>
            ))}
          </div>
          <div className="flex mx-4 gap-3 font-semibold ">
            <Link to={"/donor-login"}>
              <button className="bg-[#F4C752] text-[#141C25] px-3 py-2 rounded-xl transform transition-transform duration-200 hover:scale-115 ">
                Donor
              </button>
            </Link>
            <Link to={"/ngo-login"}>
              <button className="bg-[#1C2B36] px-3 py-2 rounded-xl transform transition-transform duration-200 hover:scale-115 ">
                NGO
              </button>
            </Link>
          </div>
        </div>
      </nav>
      <div className="mt-8 relative ">
        <img
          className="w-[70%] h-[65vh] rounded-3xl object-cover block mx-auto"
          src="https://s3-alpha-sig.figma.com/img/1206/4b5c/a33311f8b01f60c2130fa9364c938a28?Expires=1739750400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ZopZzM8PO8OquJgtsPFTI7VxJYDhrFvLgRagSDCzBBrzYKYqEOeYr3MHhcGNsrsBBPDLzsYwWXrT~6UKRKaiail0LGKDbbXW0VLGhwOStLol1xbe2IE5p0p~wV8jiCuRGAH8krmohaX3TY8CZoySDXQQZcGEbyMCtKrdhAcDXOw63K-9k1ANhZYsltYE6m-PYe215lX1Ulk8vXy57ZTTj3E~bm0zmS3WDZJeFzH~zTfwQGffzdzUcB40HhDPd0O0f9nuK0Lsc3Z8tAIZFfRLNy29TFitho0vavHg6vNsbhGZjpkd-RbUSTXhBlUhJ9LB5SpCvHkWSdtG1RenV33PqA__"
          alt=""
        />
        <div className="slogan absolute top-[68%] left-[47%] transform -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-[3.5rem] font-bold ">End Hunger. Stop Waste.</h1>
          <h5 className="w-[80%] text-base ">
            We connect donors with excess food to local hunger relief
            organizations that can use it. It's good for people and the planet
          </h5>
          <div className="flex mt-4 gap-3 font-semibold ">
            <Link to="/donor-login">
              <button className="bg-[#F4C752] text-[#141C25] px-3 py-2 rounded-xl hover:bg-[#141C25] hover:text-[#F4C752] transition duration-300 ">
                I'm a Donor
              </button>
            </Link>
            <button className="bg-[#1C2B36] px-3 py-2 rounded-xl  hover:bg-white hover:text-[#1C2B36] transition duration-300 ">
              I'm an NGO
            </button>
          </div>
        </div>
      </div>
      <div className="w-[70%] h-[40vh] mx-auto mt-15 mb-5 flex justify-center gap-6 items-center ">
        <div className="w-1/2  flex py-10  gap-5 items-center  ">
          <i className="ri-lightbulb-flash-line font-base text-[7rem] "></i>
          <div className="flex flex-col gap-8">
            <h1 className="text-5xl font-bold">Our Mission</h1>
            <h4 className="text-base ">
              Empowering underprivileged youth through access to quality
              education and mentorship programs, fostering a future filled with
              opportunity and success.
            </h4>
          </div>
        </div>
        <div className="w-1/2  flex py-10  gap-5 items-center  ">
          <i className="ri-team-line font-base text-[7rem] "></i>
          <div className="flex flex-col gap-8">
            <h1 className="text-5xl font-bold">Our Vision</h1>
            <h4 className="text-base ">
              A world where every young person, regardless of background, has
              the resources and support to reach their full potential and become
              a thriving member of society.
            </h4>
          </div>
        </div>
      </div>
      <div className="w-[70%]  mx-auto mt-[10vh]  ">
        <h1 className="text-center text-[3.7rem] font-bold mb-10 ">
          What We Do
        </h1>
        <HomeComponents />
      </div>
      <div className="w-[70%] gap-6 mx-auto mt-[15vh] text-center ">
        <h1 className="text-[3.7rem] font-bold">Ready to make a difference?</h1>
        <h4 className="mt-5 text-lg">
          We connect donors with excess food to local hunger relief
          organizations.
        </h4>

        <button className="bg-[#F4C752] text-[#141C25] px-3 py-2 rounded-xl mt-5 font-bold text-lg ml-5 hover:bg-[#141C25] hover:text-[#F4C752] transition duration-300">
          I'm a Donor
        </button>
        <button className="bg-[#1C2B36] px-3 py-2 rounded-xl mt-5 font-bold text-lg ml-5 hover:bg-white hover:text-[#1C2B36] transition duration-300 ">
          I'm an NGO
        </button>
      </div>
      <div className="w-[70%] mx-auto h-[82vh] mt-[7rem] ">
        <ContactForm />
      </div>
      <footer className="bg-[#111111] w-full flex flex-col justify-between h-[30vh] mt-[8rem] text-center ">
        <div className="text-[2.1rem] flex justify-center gap-8 pt-15 ">
          <i className="ri-facebook-circle-line transform transition-transform duration-200 hover:scale-125"></i>
          <i className="ri-instagram-line transform transition-transform duration-200 hover:scale-125  "></i>
          <i className="ri-twitter-x-line transform transition-transform duration-200 hover:scale-125 "></i>
          <i className="ri-linkedin-box-fill transform transition-transform duration-200 hover:scale-125 "></i>
          <i className="ri-mail-line transform transition-transform duration-200 hover:scale-125 "></i>
        </div>
        <div className="flex justify-center gap-8 mt-4 text-base">
          <h4 className="relative inline-block group">
            Home
            <span className="absolute left-0 bottom-[-2px] w-full h-0.5 bg-white transform scale-x-0 translate-x-0 transition-transform duration-300 group-hover:scale-x-100 group-hover:translate-x-0 group-focus:scale-x-100 group-focus:translate-x-0 group-active:scale-x-100 group-active:translate-x-0"></span>
          </h4>
          <h4 className="relative inline-block group">
            News
            <span className="absolute left-0 bottom-[-2px] w-full h-0.5 bg-white transform scale-x-0 translate-x-0 transition-transform duration-300 group-hover:scale-x-100 group-hover:translate-x-0 group-focus:scale-x-100 group-focus:translate-x-0 group-active:scale-x-100 group-active:translate-x-0"></span>
          </h4>
          <h4 className="relative inline-block group">
            About us
            <span className="absolute left-0 bottom-[-2px] w-full h-0.5 bg-white transform scale-x-0 translate-x-0 transition-transform duration-300 group-hover:scale-x-100 group-hover:translate-x-0 group-focus:scale-x-100 group-focus:translate-x-0 group-active:scale-x-100 group-active:translate-x-0"></span>
          </h4>
          <h4 className="relative inline-block group">
            Our Team
            <span className="absolute left-0 bottom-[-2px] w-full h-0.5 bg-white transform scale-x-0 translate-x-0 transition-transform duration-300 group-hover:scale-x-100 group-hover:translate-x-0 group-focus:scale-x-100 group-focus:translate-x-0 group-active:scale-x-100 group-active:translate-x-0"></span>
          </h4>
          <h4 className="relative inline-block group">
            Contact us
            <span className="absolute left-0 bottom-[-2px] w-full h-0.5 bg-white transform scale-x-0 translate-x-0 transition-transform duration-300 group-hover:scale-x-100 group-hover:translate-x-0 group-focus:scale-x-100 group-focus:translate-x-0 group-active:scale-x-100 group-active:translate-x-0"></span>
          </h4>
        </div>
        <div className="w-full bg-black py-1 mt-4 ">
          Copyright @2025; Designed by team Meal mission.
        </div>
      </footer>
    </div>
  );
}

export default Home;
