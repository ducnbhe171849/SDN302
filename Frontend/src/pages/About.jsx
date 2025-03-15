import React from "react";

const About = () => {
  return (
    <>
      <div className="flex flex-wrap gap-2 sm:gap-x-6 items-center justify-center">
        {/* text */}
        <h1 className="text-4xl font-bold leading-none tracking-tight ">
          We love
        </h1>

        {/*  */}
        <div className="stats bg-primary shadow">
          <div className="stat ">
            <div className="stat-title text-primary-content text-4xl font-bold tracking-widest">
              comfy
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-lg leading-8 max-w-2xl mx-auto">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Exercitationem
        voluptas alias placeat voluptatem eligendi facilis ipsum. Esse quaerat
        amet sit adipisci tempore dolores, et officia quas velit perspiciatis
        pariatur magni?
      </p>
    </>
  );
};

export default About;
