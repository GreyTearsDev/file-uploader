function log_in(req, res, next) {
  res.render("login_form", { title: "Log in", errors: null, username: null });
}

export const user = {
  log_in,
};
