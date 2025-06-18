# Student Progress Management System

A full-stack MERN application to manage and visualize student progress on Codeforces, with automated data sync, inactivity detection, and email reminders.

---

## Features

- **Student Table View**

  - List all enrolled students with Name, Email, Phone, Codeforces Handle, Current Rating, and Max Rating.
  - Add, edit, delete students.
  - Download student data as CSV.
  - View more details for each student.

- **Student Profile View**

  - Contest history with rating graph and contest list (filter by 30/90/365 days).
  - Problem solving stats (filter by 7/30/90 days): most difficult problem, total solved, average rating, average per day, rating distribution bar chart.
  - GitHub-style submission heatmap.

- **Codeforces Data Sync**

  - Daily automatic sync of Codeforces data via cron job (default: 2 AM, configurable).
  - Option to change cron time from the UI.
  - Real-time data fetch if a student's CF handle is updated.

- **Inactivity Detection & Email Reminders**

  - Detects students with no submissions in the last 7 days after each sync.
  - Sends automatic reminder emails (can be disabled per student).
  - Tracks and displays how many reminders have been sent.

## Tech Stack

- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Other:** Nodemailer (for email), node-cron (for scheduling), Axios

---

## API Endpoints

### Student APIs

- `GET /api/students` — List all students
- `POST /api/students` — Add a student
- `PUT /api/students/:id` — Update a student (including toggling email reminders)
- `DELETE /api/students/:id` — Delete a student
- `GET /api/students/:id/profile` — Get student profile (with CF data)
- `GET /api/students/:id/contests?days=30` — Get contest history

### Cron & Sync APIs

- `GET /api/cron/current-time` — Get current cron schedule
- `POST /api/cron/update-time` — Update cron schedule

---

## How to Run Locally

1. **Clone the repository:**

   ```sh
   git clone https://github.com/vivek-bandi/Progess_Management.git
   cd Progess_Management
   ```

2. **Backend Setup:**

   - Go to the backend folder:
     ```sh
     cd backend
     ```
   - Install dependencies:
     ```sh
     npm install
     ```
   - Create a `.env` file with:
     ```
     MONGO_URI=your_mongodb_connection_string
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_app_password
     ```
   - Start the backend:
     ```sh
     node server.js
     ```

3. **Frontend Setup:**

   - Go to the frontend folder:
     ```sh
     cd frontend
     ```
   - Install dependencies:
     ```sh
     npm install
     ```
   - Start the frontend:
     ```sh
     npm run dev
     ```

4. **Access the app:**  
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Screenshots

 Email
<img width="1440" alt="exampleEmail" src="https://github.com/user-attachments/assets/43207189-c20b-4492-97d0-9e48cdad9697" />

<img width="1440" alt="table" src="https://github.com/user-attachments/assets/df736d05-846d-4681-8e79-eb7cfb8540f8" />

<img width="1440" alt=" contest history" src="https://github.com/user-attachments/assets/d6c335e9-593f-4287-86c1-aa314ed6771c" />

<img width="1440" alt="psData" src="https://github.com/user-attachments/assets/2017efc7-30d7-4601-b3d3-f95050c01388" />



## Video Demo

[Video Link](https://github.com/vivek-bandi/Progess_Management/blob/main/Assignment.mp4)

---
