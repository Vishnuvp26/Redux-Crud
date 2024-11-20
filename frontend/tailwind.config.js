module.exports = {
  content: [
    "./index.html", // Include your HTML entry point
    "./src/**/*.{js,jsx,ts,tsx}", // Include all React component files
    "./node_modules/flowbite-react/**/*.js", // Include Flowbite components
  ],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")], // Add Flowbite plugin
};
