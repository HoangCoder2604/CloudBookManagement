# Cloud Book Manager

Bài giữa kỳ môn Điện toán đám mây.

## Stack

- Node.js
- Express
- Handlebars
- MongoDB Atlas
- Mongoose
- express-session
- connect-mongo
- Git/GitHub
- Vercel

## Requirements mapped to the assignment

### 1. Cloud database security

Two MongoDB Atlas users are intended:

- READ user: only FIND on `books`
- WRITE user: INSERT on `books`
- WRITE user also has restricted permissions on `sessions` because `connect-mongo` must persist/read sessions.

The application uses two independent MongoDB connections:

- `MONGO_READ_URI`
- `MONGO_WRITE_URI`

### 2. Stateless backend

Session data is stored in MongoDB Atlas using `connect-mongo`.

No application session state is stored in server RAM.

### 3. Personalization

The application derives:

- product prefix = last 3 digits of MSSV
- VAT = last digit of MSSV + 4

Examples:

- `23IT.B065` -> prefix `065`, VAT `9%`
- `23IT.B091` -> prefix `091`, VAT `5%`

The final price is calculated before INSERT.

### 4. Git/DevOps

Recommended branches:

```text
feature/database
feature/session
main
```

Merge with:

```bash
git checkout main
git merge --no-ff feature/database
git merge --no-ff feature/session
```

### 5. Deployment

Set all sensitive values in Vercel Environment Variables.

Do not commit `.env`.

## Local setup

```bash
npm install
copy .env.example .env
```

Edit `.env`.

Then:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

Health:

```text
http://localhost:3000/api/health
```
