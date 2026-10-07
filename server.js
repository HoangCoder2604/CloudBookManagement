require("dotenv").config();

const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { engine } = require("express-handlebars");

const {
  connectDatabases,
  getReadDb,
  getWriteDb
} = require("./src/config/database");

const { validateStudentConfig } = require("./src/config/student");

const authRoutes = require("./src/routes/authRoutes");
const bookRoutes = require("./src/routes/bookRoutes");
const webRoutes = require("./src/routes/webRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

validateStudentConfig();

app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    helpers: {
      currency(value) {
        return new Intl.NumberFormat("vi-VN").format(Number(value || 0));
      }
    }
  })
);

app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

/*
 * Stateless session:
 * Session data is stored in MongoDB Atlas instead of server RAM.
 *
 * We intentionally use the WRITE connection for the session store because
 * connect-mongo must be able to read/write the sessions collection.
 * The WRITE account is still restricted to the sessions collection for
 * session operations and has only INSERT on books.
 */

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_WRITE_URI,
      dbName: process.env.MONGO_DB_NAME,
      collectionName: "sessions",
      ttl: 60 * 60 * 24
    }),

    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

app.use((req, res, next) => {
  res.locals.studentName = process.env.STUDENT_NAME;
  res.locals.mssv = process.env.MSSV;
  res.locals.isLoggedIn = Boolean(req.session.user);
  res.locals.user = req.session.user || null;
  next();
});

app.use("/", webRoutes);
app.use("/auth", authRoutes);
app.use("/books", bookRoutes);

app.get("/api/health", async (req, res) => {
  try {
    await getReadDb().command({ ping: 1 });
    await getWriteDb().command({ ping: 1 });

    res.json({
      status: "ok",
      message: "Cloud Book Manager is healthy",
      student: process.env.STUDENT_NAME,
      mssv: process.env.MSSV
    });
  } catch (error) {
    console.error("Health check failed:", error);

    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).render("error", {
    title: "Lỗi hệ thống",
    message: "Có lỗi xảy ra. Vui lòng thử lại."
  });
});

async function bootstrap() {
  await connectDatabases();

  // Vercel imports the module; local execution starts the HTTP server.
  if (!process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`Cloud Book Manager: http://localhost:${PORT}`);
      console.log(`Student: ${process.env.STUDENT_NAME}`);
      console.log(`MSSV: ${process.env.MSSV}`);
    });
  }
}

bootstrap().catch((error) => {
  console.error("Application startup failed:", error);

  if (!process.env.VERCEL) {
    process.exit(1);
  }
});

module.exports = app;