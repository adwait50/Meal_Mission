import React from "react";

function HomeComponents() {
  const comp = [
    {
      image:
        "https://bc-user-uploads.brandcrowd.com/public/media-Production/0e523b9b-df39-4929-a861-701e45a7994a/fbd741ef-3686-4019-9c0d-2b0a05875792.png",
      topic: "Outreach Programs",
      content:
        "We actively connect with communities in need, providing essential services and support.",
    },
    {
      image:
        "https://bc-user-uploads.brandcrowd.com/public/media-Production/0e523b9b-df39-4929-a861-701e45a7994a/eec0b637-7c81-49ad-a88f-1436c8cf693e.png",
      topic: "Awareness Campaigns",
      content:
        "We raise awareness about critical social issues, inspiring action and advocating for positive change.",
    },
    {
      image:
        "https://bc-user-uploads.brandcrowd.com/public/media-Production/0e523b9b-df39-4929-a861-701e45a7994a/66097fd9-f919-40bb-8fcc-dbae30a0d97c.png",
      topic: "Empowerment Initiatives",
      content:
        "We invest in programs that equip people with the skills and resources to reach their full potential.",
    },
  ];
  return (
    <div className="w-full flex flex-col sm:flex-row sm:gap-6 gap-4 mt-5">
      {comp.map((e, i) => (
        <div
          key={i}
          className="w-full sm:h-[29vh] flex flex-col items-center text-center"
        >
          <img
            className="w-full h-[32vh] sm:h-[29vh] rounded-2xl object-cover"
            src={e.image}
            alt={e.topic}
          />
          <h2 className="mt-4 text-lg sm:text-xl font-semibold">
            {e.topic}
          </h2>
          <p className="mt-2 text-sm sm:text-base">{e.content}</p>
        </div>
      ))}
    </div>
  );
}

export default HomeComponents;
