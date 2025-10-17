import React from "react";

export default function Footer() {
  return (
    <footer className="w-full md:w-[calc(100%-16rem)] md:ml-64 bg-white text-blue-700 text-center py-4 shadow-none relative z-0 transition-all duration-300">
      <p className="text-sm tracking-wide">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-blue-700">Santiago</span>{" "}
        <span className="font-semibold text-black">Bernabeu</span>. All rights reserved.
      </p>
      <p className="text-xs text-blue-400 mt-1">
        Designed & Developed by{" "}
        <span className="font-medium text-blue-700">PinCode</span>
      </p>
    </footer>
  );
}
