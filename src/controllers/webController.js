const { listBooks } = require("../services/bookService");
const { getStudentConfig } = require("../config/student");

async function home(req, res, next) {
  try {
    const books = await listBooks();
    const student = getStudentConfig();

    res.render("books", {
      title: "Quản lý Sách Cloud",
      books,
      student,
      message: req.session.flashMessage || null,
      error: req.session.flashError || null
    });

    delete req.session.flashMessage;
    delete req.session.flashError;
  } catch (error) {
    next(error);
  }
}

module.exports = {
  home
};
