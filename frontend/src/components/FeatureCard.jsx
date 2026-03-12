import React from "react";

function FeatureCard({ icon, title, description, gradient }) {
  return (
    <div className="p-6 rounded-2xl shadow-lg bg-white hover:shadow-2xl transition duration-300">
      
      <div className={`w-14 h-14 flex items-center justify-center rounded-xl text-white mb-4 bg-gradient-to-r ${gradient}`}>
        {icon}
      </div>

      <h3 className="text-xl font-semibold mb-2">
        {title}
      </h3>

      <p className="text-gray-600">
        {description}
      </p>

    </div>
  );
}

export default FeatureCard;