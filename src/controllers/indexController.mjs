function get(req, res, next) {
  const userIsLoggedIn = res.locals.currentUser || false;
  res.render("home", {
    title: "Horder Heaven",
    userIsLoggedIn: userIsLoggedIn,
  });
  next();
}

export const home = {
  get,
};
