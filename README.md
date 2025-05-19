# 🚗 Vehicle Parking Management System

A full-stack web application that helps parking facility managers and vehicle owners streamline parking slot allocation. The system supports vehicle registration, slot request management, automatic slot assignment, email notifications, role-based access, and more — all built with modern technologies.

---

## 🔧 Technologies Used

**Frontend:**

- React.js (with TypeScript)
- TailwindCSS

**Backend:**

- Node.js + Express.js (REST API)
- PostgreSQL (Database)
- Nodemailer (Email notifications)
- JWT (Authentication & Security)

**Other Tools:**

- Figma (UI/UX Design)
- GitHub (Version control)
- Bcrypt (Password hashing)

---

## ✨ Features

### 👥 User Management

- Register & login (JWT-based)
- Update profile (name, email, password)
- Two roles: `user` (vehicle owner) and `admin` (parking manager)

### 🚗 Vehicle Management

- Add/update/delete your vehicles
- Vehicle details: Plate number, type, size, color, model (JSONB for flexibility)
- Paginated vehicle list with search

### 🅿️ Parking Slot Management (Admin)

- Bulk slot creation (e.g., 100 slots)
- CRUD operations on individual slots
- Slot attributes: number, size, type, location
- Slot status (`available`, `unavailable`)
- Paginated list with search

### 📥 Slot Request Management

- Request a parking slot for a vehicle
- Admins can approve or reject
- Automatic assignment of compatible slot on approval
- Paginated request list with search
- Email sent upon approval with slot & vehicle info

### 🔍 Pagination & Search

- Lists for vehicles, slots, requests, and users
- Page controls: next, previous, page number
- Search: plate number, vehicle type, slot status, etc.

### 🔐 Authentication & Security

- JWT-secured endpoints
- Passwords stored using bcrypt
- Admin-only routes secured by role

### 📧 Email Notifications

- Users receive approval emails with slot & vehicle details

### 🧾 Audit Logging

- Logs all key actions: user registration, vehicle changes, request handling, etc.
- Tracks user ID, action, and timestamp

---

## 🗂️ Folder Structure (Simplified)

```bash
├── frontend/               # React Frontend
│   └── ...
├── backend/               # Node + Express Backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   └── utils/
├── docs/                 # Figma wireframes and documentation
├── .env.example          # Sample environment config
├── README.md
```

````

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/NE-Pratical-Templates/PMS
cd PMS
```

### 2. Set up environment variables

Create a `.env` file in the `server/` directory using `.env.example` as a guide.

```env
PORT=5000
JWT_SECRET_KEY =kalisa
JWT_EXPIRES_IN =3d
DATABASE_URL=postgres://user:password@localhost:5432/parking_db
NODEMAILER_EMAIL=your_email@example.com
NODEMAILER_PASS=your_email_password


In backend/src
run: 
npx prisma  migrate dev --name new_migration

cd ..

```

### 3. Install dependencies

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd ../frontend
npm install
```

### 4. Run the app

**Backend:**

```bash
cd backend
npm run dev
```

**Frontend:**

```bash
cd ../frontend
npm run dev
```

### 5. Visit in browser

```bash
http://localhost:3058
```

---

## 🧪 API Documentation

All endpoints are RESTful and follow the `/api/v1/` prefix.

Some examples:

| Endpoint                     | Method | Description                          |
| ---------------------------- | ------ | ------------------------------------ |
| `/auth/register`             | POST   | Register a new user                  |
| `/auth/login`                | POST   | Login and receive JWT token          |
| `/vehicles`                  | GET    | Get user vehicles (paginated/search) |
| `/slots` (admin)             | POST   | Bulk add parking slots               |
| `/slot-requests`             | POST   | Create a new slot request            |
| `/slot-requests/:id/approve` | PATCH  | Admin approves a request             |

More detailed API docs coming soon with Swagger or Postman collection.

---

## ✅ Roadmap

- [x] JWT Auth with Role-based Access
- [x] CRUD for vehicles and slots
- [x] Email notifications
- [x] Search and Pagination
- [x] Admin dashboard
- [ ] Swagger API documentation
- [ ] Unit and integration tests
- [ ] Mobile responsiveness polish

---

## 👨‍💻 Contributing

Contributions are welcome! Feel free to:

- Fork the repo
- Create a feature branch
- Submit a pull request

Please follow the Git workflow:

```bash
feature/your-feature-name
```

---

## 📄 License

MIT License. See [LICENSE](./LICENSE) for details.

---

## 💬 Contact

Built with ❤️ by \[BYUMVUHORE Aimable].

For feedback or support, contact \[[aimablebyumvuhore@gmail.com](mailto:aimablebyumvuhore@gmail.com)].
````
