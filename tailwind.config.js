module.exports = {
  content: ["./src/views/**/*.{html,js,ejs}", "./public/**/*.{html,js}"],
  theme: {
    extend: {
      gridTemplateRows: {
        "custom-layout": "80px 1fr 50px",
      },
      gridTemplateColumns: {
        "custom-layout": "minmax(100px, 250px) 1fr",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
