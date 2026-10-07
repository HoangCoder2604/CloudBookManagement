function showLogin(req, res) {
  res.render("login", {
    title: "Đăng nhập",
    error: null
  });
}

function login(req, res) {
  const username = String(req.body.username || "").trim();

  if (!username) {
    return res.status(400).render("login", {
      title: "Đăng nhập",
      error: "Vui lòng nhập tên người dùng."
    });
  }

  req.session.user = {
    username,
    loggedInAt: new Date().toISOString()
  };

  req.session.save(() => {
    res.redirect("/");
  });
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/");
  });
}

module.exports = {
  showLogin,
  login,
  logout
};
