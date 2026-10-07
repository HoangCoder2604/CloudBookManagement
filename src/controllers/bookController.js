const { createBook } = require("../services/bookService");

async function create(req, res) {
  try {
    await createBook({
      code: req.body.code,
      name: req.body.name,
      price: req.body.price
    });

    req.session.flashMessage = "Thêm sách thành công. Giá sau VAT đã được tính tự động.";
    res.redirect("/");
  } catch (error) {
    req.session.flashError = error.message;
    res.redirect("/");
  }
}

module.exports = {
  create
};
