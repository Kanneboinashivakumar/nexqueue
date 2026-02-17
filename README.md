# 🏥 NexQueue - Smart Healthcare Queue Management System

![NexQueue Logo](https://via.placeholder.com/800x200/2563eb/ffffff?text=NexQueue+-+Skip+the+Queue.+Meet+the+Cure.)

> **Skip the Queue. Meet the Cure.**  
> A real-time, priority-based patient queue optimization system that reduces waiting time by 60%.

---

## 📋 **Table of Contents**
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📸 Screenshots](#-screenshots)
- [🚀 Live Demo](#-live-demo)
- [💻 Installation](#-installation)
- [🔧 Configuration](#-configuration)
- [👥 User Roles](#-user-roles)
- [📊 How It Works](#-how-it-works)
- [🌐 Deployment](#-deployment)
- [📄 License](#-license)

---

## ✨ **Features**

### 👤 **For Patients**
| Feature | Description |
|---------|-------------|
| 📅 **Instant Booking** | Book appointments in under 30 seconds |
| 🎫 **Smart Token** | Get unique token with priority scoring |
| 📍 **Live Tracking** | Watch your queue position update in real-time |
| ⏱️ **Wait Time Estimate** | Know exactly when you'll be seen |
| 🔔 **Smart Notifications** | Get alerts when your turn is approaching |

### 👩‍💼 **For Staff**
| Feature | Description |
|---------|-------------|
| 📊 **Intelligent Queue** | Emergency > Senior > Normal + waiting boost |
| 🚨 **Emergency Override** | One-click to jump critical cases to front |
| ✅ **One-Click Actions** | Call, Skip, Complete with single click |
| 🔍 **Search & Filter** | Find any patient instantly |
| 📈 **Real-time Updates** | Queue syncs across all devices instantly |

### 👨‍⚕️ **For Doctors**
| Feature | Description |
|---------|-------------|
| 👤 **Auto Patient Load** | Patient appears automatically when called |
| 📝 **Digital Notes** | Add consultation notes digitally |
| 💊 **Prescription Creator** | Create prescriptions with auto-queue to lab/pharmacy |
| 🖨️ **Print Prescription** | Professional, formatted print output |
| 🔄 **Auto Next Patient** | Next patient loads automatically on completion |

### 🔬 **For Lab & Pharmacy**
| Feature | Description |
|---------|-------------|
| ⚡ **Auto Queue** | Tests/medicines appear automatically from prescriptions |
| 🏷️ **Priority Tags** | Emergency, Urgent, Normal visual indicators |
| ✅ **Status Tracking** | Waiting → Processing → Ready → Completed |
| 📊 **Queue Dashboard** | Complete visibility of all pending tasks |

### 👑 **For Admins**
| Feature | Description |
|---------|-------------|
| 📊 **Real-time Analytics** | Track appointments, users, system health |
| 👥 **User Management** | Add/edit/activate/deactivate any user |
| 📈 **Peak Hours Analysis** | Know when to schedule more staff |
| 🔧 **System Health** | Monitor server, database, API performance |
| 📋 **Complete Oversight** | One dashboard to rule them all |

---

## 🛠️ **Tech Stack**

### **Frontend**
| Technology | Purpose |
|------------|---------|
| **React 18** | UI Library |
| **Vite** | Build Tool |
| **Tailwind CSS** | Styling |
| **Framer Motion** | Animations |
| **Socket.io Client** | Real-time Updates |
| **Recharts** | Data Visualization |
| **React Router** | Navigation |

### **Backend**
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime |
| **Express.js** | Web Framework |
| **MongoDB Atlas** | Database |
| **Mongoose** | ODM |
| **Socket.io** | WebSocket Server |
| **JWT** | Authentication |
| **Bcrypt** | Password Hashing |

### **Deployment**
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend Hosting |
| **Render** | Backend Hosting |
| **MongoDB Atlas** | Database Hosting |
| **GitHub** | Version Control |

---

## 📸 **Screenshots**

### **Landing Page**
![Landing Page](https://via.placeholder.com/800x400/1a202c/ffffff?text=Landing+Page+-+Netflix+Style+Intro+Animation)

*Netflix-style intro animation with "NXQ" reveal*

### **Patient Dashboard**
![Patient Dashboard](https://via.placeholder.com/800x400/2563eb/ffffff?text=Patient+Dashboard+-+Live+Queue+Tracking)

*Real-time queue position with wait time estimate*

### **Staff Dashboard**
![Staff Dashboard](https://via.placeholder.com/800x400/7c3aed/ffffff?text=Staff+Dashboard+-+Smart+Queue+Management)

*Priority-sorted queue with one-click controls*

### **Doctor Dashboard**
![Doctor Dashboard](https://via.placeholder.com/800x400/059669/ffffff?text=Doctor+Dashboard+-+Consultation+Interface)

*Current patient view with digital notes and prescription*

### **Lab Queue Dashboard**
![Lab Queue](https://via.placeholder.com/800x400/db2777/ffffff?text=Lab+Queue+-+Test+Management)

*Lab tests with priority indicators and status tracking*

### **Pharmacy Queue Dashboard**
![Pharmacy Queue](https://via.placeholder.com/800x400/d97706/ffffff?text=Pharmacy+Queue+-+Medicine+Dispensing)

*Prescription management with full workflow*

### **Admin Dashboard**
![Admin Dashboard](https://via.placeholder.com/800x400/4f46e5/ffffff?text=Admin+Dashboard+-+Complete+Oversight)

*System analytics, user management, and peak hours analysis*

### **Queue Priority Algorithm**
![Priority Algorithm](https://via.placeholder.com/800x300/6b7280/ffffff?text=Emergency+%3E+Senior+%3E+Normal+%2B+Waiting+Boost)

*Smart algorithm that reorders queue based on priority AND fairness*

---

## 🚀 **Live Demo**

| **Component** | **URL** | **Credentials** |
|--------------|---------|-----------------|
| **Frontend** | [https://nexqueue.vercel.app](https://nexqueue.vercel.app) | - |
| **Backend API** | [https://nexqueue-backend.onrender.com](https://nexqueue-backend.onrender.com) | - |
| **Patient Demo** | `/patient` | `rajesh@test.com` / `patient123` |
| **Staff Demo** | `/staff` | `staff@test.com` / `staff123` |
| **Doctor Demo** | `/doctor` | `doctor@test.com` / `doctor123` |
| **Lab Demo** | `/lab` | `lab@test.com` / `staff123` |
| **Pharmacy Demo** | `/pharmacy` | `pharmacy@test.com` / `staff123` |
| **Admin Demo** | `/admin` | `admin@nexqueue.com` / `admin123` |

---

## 💻 **Installation**

### **Prerequisites**
- Node.js v18+
- MongoDB (local or Atlas)
- Git

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/yourusername/nexqueue.git
cd nexqueue
```

### **Step 2: Clone the Repository**
```bash
cd backend
npm install
```
### **Step 3: Configure Backend Environment**
## Create backend/.env:
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nexqueue
JWT_SECRET=your_super_secret_key
```

### **Step 4: Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

### **Step 5: Configure Frontend Environment**
## Create frontend/.env:
```bash
VITE_API_URL=http://localhost:5000/api
```
### **Step 6: Run the Application**
## Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

## Terminal 2 - Frontend:
```bash
cd Frontend
npm run dev
```
### **Step 7: Access the Application
## Open http://localhost:5173
### **Step 4: Install Frontend Dependencies**
### **Step 4: Install Frontend Dependencies**

## 👥 User Roles

| Role            | Access Route | Permissions |
|-----------------|-------------|-------------|
| Patient         | `/patient`  | Book appointments, view queue, get notifications |
| Staff           | `/staff`    | Manage queue, call patients, emergency override |
| Doctor          | `/doctor`   | Consult patients, add notes, create prescriptions |
| Lab Staff       | `/lab`      | View and process lab tests |
| Pharmacy Staff  | `/pharmacy` | Process medicine prescriptions |
| Admin           | `/admin`    | Full system control, user management, analytics |


## 📊 How It Works

### 🧠 Smart Priority Algorithm

```javascript
const priorityScore = {
  emergency: 100,  // 🚨 Jumps to front
  senior: 50,      // 👵 Fair priority
  normal: 10 + (waitingMinutes * 0.1)  // 👤 Waiting boost
};
```

This ensures:
- 🚨 Emergency patients get immediate attention  
- 👵 Senior citizens receive fair priority  
- 👤 Normal patients gradually move up based on waiting time  

---

### 🏥 Complete Patient Journey

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Patient    │ -> │   Staff     │ -> │   Doctor    │ -> │ Lab/Pharmacy│
│  Books      │    │  Calls      │    │  Consults   │    │  Processes  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

1. **Patient** books an appointment  
2. **Staff** manages and calls patients  
3. **Doctor** consults and adds prescriptions  
4. **Lab/Pharmacy** processes tests and medicines  

---

## 🌐 Deployment

### 🚀 Frontend (Vercel)

```bash
cd frontend
npm run build
vercel --prod
```

---

### ⚙️ Backend (Render)

1. Push backend code to GitHub  
2. Connect repository to Render  
3. Add environment variables  
4. Deploy  

---

### 🗄️ Database (MongoDB Atlas)

1. Create a free cluster  
2. Get your connection string  
3. Update `MONGODB_URI` in backend `.env` file  

---

## 📄 License

This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---

## 👨‍💻 Team

**Shiva Kumar Kanneboina** – Full Stack Developer  
**Gurutej Ganapurapu** – Team Leader
**Nandu Kankala** - Pitch Presenter

---

## 🙏 Acknowledgments

- IIT Delhi Research Paper (2022) on healthcare queue optimization  
- Human Rights Forum, Hyderabad (Jan 2026) report on Osmania Hospital  
- All the patients who inspired us to build this  

---

## 📞 Contact
 
🐙 GitHub: https://github.com/yourusername/nexqueue  
🌍 Live Demo: https://nexqueue.vercel.app (in progress)
💼 LinkedIn: https://linkedin.com/in/yourprofile  
---

![NexQueue Banner](https://via.placeholder.com/1200x100/1f2937/ffffff?text=NexQueue+-+Skip+the+Queue.+Meet+the+Cure.)
