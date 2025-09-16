# 🛍️ Gadgetory  

A **full-stack e-commerce web application** built with **Node.js, Express, MongoDB, EJS**, and **Razorpay integration**. It provides a seamless shopping experience with **user authentication, cart & order management, stock control, and an admin dashboard with analytics**.  

---

## 🚀 Tech Stack  

- **Frontend:** EJS, Chart.js, Tailwind  
- **Backend:** Node.js, Express, MongoDB, Mongoose  
- **Authentication:** Passport.js (Google OAuth 2.0), bcryptjs, express-session  
- **Payments:** Razorpay (with COD restrictions)  
- **File Uploads:** Multer (with client-side cropping support)  
- **Email Services:** Nodemailer  
- **Reports & Documents:** ExcelJS, PDFKit, Puppeteer  
- **Utilities:** dotenv, nocache, uuid  

---

## ✨ Features  

### **User Side**  
- 👤 Signup/Login with Email & Google OAuth  
- 🛒 Cart & Wishlist management  
- 📦 Place, cancel, return payment and track orders  
- 💳 Online payment with Razorpay + Cash on Delivery  
- 📄 Download invoices in PDF format 
- 🏷️ Manage multiple addresses  
- 🔍 Search, filter, and sort products (popularity, price, rating, etc.)  
- 📊 Stock availability display  

### **Admin Side**  
- 📦 Manage products, categories, and stock  
- 📊 Dashboard with sales analytics (Chart.js)  
- 🏆 Best-selling products, categories, and brands  
- 📈 Sales reports export (Excel/PDF)  
- 📢 Order management (status updates & cancellations)  
- 🔐 Role-based access (Admin/User)  

---

## 📦 Installation & Setup  

### **1️⃣ Clone the Repository**  
```bash
git clone https://github.com/sanushifan/gadgetory.git
cd gadgetory

# *Install Backend Dependencies*
npm install

#**start both frontend & backend together using:**
npm run start
