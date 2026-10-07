# Source structure

- `config/database.js`: independent READ/WRITE MongoDB connections
- `config/student.js`: derives prefix/VAT from MSSV
- `services/bookService.js`: routes FIND to READ and INSERT to WRITE
- `controllers/`: request logic
- `routes/`: HTTP routes
- `views/`: Handlebars UI
- `middleware/auth.js`: simple login guard
