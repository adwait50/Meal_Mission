import React, { useState } from "react";

function ContactForm() {
  const [result, setResult] = useState("");
  const [buttonTrigger, setbuttonTrigger] = useState("Submit Form");

  const onSubmit = async (event) => {
    event.preventDefault();
    setbuttonTrigger("Sending...");
    setResult("Sending...");
    const formData = new FormData(event.target);
    const accessKey = import.meta.env.VITE_CONTACT_ACCESS_KEY;
    formData.append("access_key", accessKey);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully 🎉");
      setbuttonTrigger("Form Submitted");
      event.target.reset();
    } else {
      setResult("❌ " + data.message);
      setbuttonTrigger("Submit Form");
    }
  };

  return (
    <div className="w-full bg-[#1C2B36] p-5 rounded-2xl h-full flex flex-col sm:flex-row">
      <div className="sm:w-[30%] w-full flex justify-center items-center text-3xl sm:text-5xl font-bold text-center sm:text-left mb-5 sm:mb-0 text-white">
        Share <br /> Something With Us
      </div>
      <div className="sm:w-[70%] w-full">
        <form onSubmit={onSubmit} className="flex flex-col p-5">
          <div className="flex flex-col sm:flex-row w-full gap-3">
            <div className="sm:w-1/2 w-full">
              <h3 className="font-semibold text-white">First name</h3>
              <input
                type="text"
                name="firstname"
                required
                placeholder="First Name"
                className="w-full border border-white bg-transparent rounded-md p-2 mt-3 focus:ring-2 focus:ring-[#F4C752] focus:outline-none"
              />
            </div>
            <div className="sm:w-1/2 w-full">
              <h3 className="font-semibold text-white">Last name</h3>
              <input
                type="text"
                name="lastname"
                required
                placeholder="Last Name"
                className="w-full border border-white bg-transparent rounded-md p-2 mt-3 focus:ring-2 focus:ring-[#F4C752] focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-5">
            <h3 className="font-semibold text-white">Email</h3>
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className="p-2 w-full border border-white bg-transparent rounded-md mt-3 focus:ring-2 focus:ring-[#F4C752] focus:outline-none"
            />
          </div>

          <div className="mt-5">
            <h3 className="font-semibold text-white">Phone number</h3>
            <input
              type="text"
              name="number"
              placeholder="Phone Number"
              className="p-2 w-full border border-white bg-transparent rounded-md mt-3 focus:ring-2 focus:ring-[#F4C752] focus:outline-none"
            />
          </div>

          <div className="mt-5">
            <h3 className="font-semibold text-white">Message</h3>
            <textarea
              name="message"
              required
              placeholder="Message"
              className="p-2 h-[10rem] w-full border border-white bg-transparent rounded-md mt-3 focus:ring-2 focus:ring-[#F4C752] focus:outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={buttonTrigger === "Sending..."}
            className={`p-2 w-[10rem] mx-auto border border-white rounded-md mt-5 transition-transform duration-300 ${
              buttonTrigger === "Sending..."
                ? "bg-gray-500 cursor-not-allowed"
                : "hover:bg-[#F4C752] hover:text-black"
            }`}
          >
            {buttonTrigger}
          </button>
        </form>

        {result && (
          <p className="text-center mt-3 text-sm text-[#F4C752]">{result}</p>
        )}
      </div>
    </div>
  );
}

export default ContactForm;
