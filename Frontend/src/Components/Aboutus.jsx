import React from "react";

const Aboutus = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 text-center">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-6">About Agri-Tech</h1>
        <p className="text-lg text-gray-300 mb-4">
          Agri-Tech is dedicated to revolutionizing agriculture through
          technology. We provide innovative solutions to help farmers increase
          productivity, manage resources efficiently, and achieve sustainable
          growth.
        </p>
        <p className="text-lg text-gray-300 mb-4">
          Our platform offers a comprehensive suite of tools, including product
          marketplaces, crop and farm management systems, detailed crop
          information, and real-time weather forecasts. We believe in empowering
          the agricultural community with the knowledge and tools they need to
          thrive in a changing world.
        </p>
        <p className="text-lg text-gray-300 mb-8">
          Join us in building a smarter, more sustainable future for
          agriculture.
        </p>
        <div className="mt-8">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-gray-300">
            To bridge the gap between traditional farming practices and modern
            technological advancements, ensuring food security and environmental
            stewardship.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
