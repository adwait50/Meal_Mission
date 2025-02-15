import React, { useState } from "react";

function ContactForm() {
  const [result, setResult] = useState("");
  const [buttonTrigger, setbuttonTrigger] = useState("Submit Form");

  const onSubmit = async (event) => {
    event.preventDefault();
    setbuttonTrigger("Sending...");
    setResult("Sending....");
    const formData = new FormData(event.target);
    const accessKey = import.meta.env.VITE_CONTACT_ACCESS_KEY;
    console.log(accessKey);
    formData.append("access_key", accessKey);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log(data);

    if (data.success) {
      setResult("Form Submitted Successfully");
      setbuttonTrigger("Form Submitted");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };
  return (
    <div className="w-full bg-[#1C2B36] p-5 rounded-2xl h-full flex ">
      <div className="w-[30%]  flex justify-center items-center text-5xl font-bold ">
        Share <br /> Something With Us
      </div>
      <div className="w-[70%]">
        <form onSubmit={onSubmit} className="flex flex-col p-5 ">
          <div className="flex w-full gap-3 ">
            <div className="w-1/2  ">
              <h3 className="font-semibold">First name</h3>
              <input
                type="text"
                name="firstname"
                required
                placeholder="First Name"
                className="w-full focus:outline-white border-white h-10 outline mt-3 bg-transparent rounded-md p-2"
              />
            </div>
            <div className="w-1/2  ">
              <h3 className="font-semibold">Last name</h3>
              <input
                type="text"
                name="lastname"
                required
                placeholder="Last Name"
                className="w-full focus:outline-white border-white h-10 outline bg-transparent mt-3 rounded-md p-2"
              />
            </div>
          </div>
          <div className="mt-5">
            <h3 className="font-semibold">Email</h3>
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className="p-2 w-full focus:outline-white border-white bg-transparent rounded-md mt-3 outline"
            />
          </div>
          <div className="mt-5">
            <h3 className="font-semibold">Phone number</h3>
            <input
              type="text"
              name="number"
              placeholder="Phone Number"
              className="p-2 focus:outline-white border-white bg-transparent rounded-md mt-3 outline w-full  "
            />
          </div>
          <div className="mt-5">
            <h3 className="font-semibold">Message</h3>
            <textarea
              name="message"
              required
              placeholder="Message"
              className="p-2 h-[10rem] bg-transparent border-white rounded-md mt-3 outline w-full  focus:outline-white "
            ></textarea>
          </div>

          <button
            type="submit"
            className="p-2 w-[10rem] mx-auto border-white rounded-md mt-5 outline hover:bg-[#F4C752] hover:text-black transition-transform duration-300 "
          >
            {buttonTrigger}
          </button>
        </form>
        {/* <span className="text-white">{result}</span> */}
      </div>
    </div>
  );
}

export default ContactForm;
