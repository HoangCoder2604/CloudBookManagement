function getStudentConfig() {
  const mssv = String(process.env.MSSV || "").trim();
  const studentName = String(process.env.STUDENT_NAME || "").trim();

  // The assignment format is 23IT.B065 / 23IT.B091.
  const digits = mssv.replace(/\D/g, "");

  if (digits.length < 3) {
    throw new Error("MSSV must contain at least 3 digits.");
  }

  const last3 = digits.slice(-3);
  const lastDigit = Number(digits.slice(-1));
  const vat = lastDigit + 4;

  return {
    mssv,
    studentName,
    last3,
    vat
  };
}

function validateStudentConfig() {
  const config = getStudentConfig();

  if (!config.studentName) {
    throw new Error("STUDENT_NAME is required.");
  }

  if (!process.env.MONGO_DB_NAME) {
    throw new Error("MONGO_DB_NAME is required.");
  }

  if (!process.env.MONGO_READ_URI) {
    throw new Error("MONGO_READ_URI is required.");
  }

  if (!process.env.MONGO_WRITE_URI) {
    throw new Error("MONGO_WRITE_URI is required.");
  }

  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is required.");
  }

  return config;
}

module.exports = {
  getStudentConfig,
  validateStudentConfig
};
