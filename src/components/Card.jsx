import React from "react";

export default function Card({ title, value, icon, bgColor }) {
  return (
    <div className={`flex items-center p-4 rounded-lg shadow-md ${bgColor || "bg-white"}`}>
      {icon && <div className="text-3xl mr-4">{icon}</div>}
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
