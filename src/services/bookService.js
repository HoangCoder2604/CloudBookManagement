const { getReadDb, getWriteDb } = require("../config/database");
const { getStudentConfig } = require("../config/student");

const COLLECTION = "books";

function getBooksCollection() {
  // READ path always uses the READ connection/account.
  return getReadDb().collection(COLLECTION);
}

function getWriteCollection() {
  // WRITE path always uses the WRITE connection/account.
  return getWriteDb().collection(COLLECTION);
}

async function listBooks() {
  return getBooksCollection()
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
}

async function createBook({ code, name, price }) {
  const { last3, vat } = getStudentConfig();

  const cleanCode = String(code || "").trim();
  const cleanName = String(name || "").trim();
  const basePrice = Number(price);

  if (!cleanCode || !cleanName || !Number.isFinite(basePrice) || basePrice < 0) {
    throw new Error("Dữ liệu sách không hợp lệ.");
  }

  if (!cleanCode.startsWith(last3)) {
    throw new Error(`Mã sản phẩm phải bắt đầu bằng ${last3}.`);
  }

  const finalPrice = Math.round(basePrice * (1 + vat / 100));

  const book = {
    code: cleanCode,
    name: cleanName,
    price: basePrice,
    vat,
    finalPrice,
    createdAt: new Date()
  };

  // INSERT path always uses the WRITE connection/account.
  const result = await getWriteCollection().insertOne(book);

  return {
    _id: result.insertedId,
    ...book
  };
}

module.exports = {
  listBooks,
  createBook
};
