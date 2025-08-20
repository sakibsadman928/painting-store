# 🎨 Painting Store

A full-stack painting gallery e-commerce platform built with React.js and Node.js. This application allows users to browse and purchase paintings, book exhibition tickets, and includes a comprehensive admin dashboard for managing products and events.

## ✨ Features

### 🛍️ Customer Features
- **Product Catalog**: Browse beautiful paintings with detailed views and image galleries
- **Advanced Search & Filtering**: Sort by price, rating, availability, and search by name
- **Shopping Cart**: Add/remove items with quantity management and stock validation
- **User Authentication**: Secure registration and login system
- **Order Management**: Track orders with status updates (Order Placed → Packing → Shipped → Delivered)
- **Product Reviews**: Rate and review purchased products (1-5 stars)
- **Exhibition Booking**: Purchase tickets for art exhibitions and events
- **Address Management**: Multiple shipping addresses with default selection
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 👑 Admin Features
- **Product Management**: Add, edit, and remove paintings with multiple images
- **Order Tracking**: View and update order statuses
- **Exhibition Management**: Create and manage art exhibitions and events
- **Ticket Sales**: Monitor ticket sales and customer information
- **Analytics Dashboard**: View sales statistics and revenue reports
- **User Management**: Access to customer orders and ticket purchases

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Context API** - State management
- **Fetch API** - HTTP requests

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - Object Document Mapping
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cookie Parser** - Cookie management

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/sakibsadman928/painting-store.git
cd painting-store
```

### 2. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file with the following variables:
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key
# PORT=4000

# Start the server
npm run server
```

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Admin Dashboard**: http://localhost:5173/admin

## 🔑 Admin Credentials
- **Email**: admin@paletteplay.com
- **Password**: admin123

## 📱 Screenshots & Demo

### Customer Interface
- **Homepage**: Featured paintings and navigation
- **Product Catalog**: Grid view with filters and search
- **Product Details**: Image gallery, ratings, and reviews
- **Shopping Cart**: Item management and checkout
- **Order Tracking**: Status updates and order history

### Admin Dashboard
- **Analytics**: Sales statistics and revenue charts
- **Product Management**: Add/edit paintings with image uploads
- **Order Management**: Track and update order statuses
- **Exhibition Management**: Create events and manage ticket sales

## 🏗️ Project Structure
```
painting-store/
├── client/                 # React.js frontend
│   ├── src/
│   │   ├── assets/         # Static files (images, icons)
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Breadcrumb.jsx
│   │   │   ├── ExhibitionCard.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── TicketModal.jsx
│   │   ├── pages/          # Application pages
│   │   │   ├── Address.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Exhibition.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   ├── Products.jsx
│   │   │   └── ProductDetails.jsx
│   │   ├── context/        # Context providers
│   │   │   └── AppContext.jsx
│   │   ├── App.jsx         # Main application component
│   │   ├── main.jsx        # Application entry point
│   │   └── index.css       # Global styles
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   ├── package-lock.json   # Dependency lock file
│   ├── index.html          # HTML template
│   └── vite.config.js      # Vite configuration
├── server/                 # Node.js backend
│   ├── controllers/        # Route handlers
│   ├── models/             # Database schemas
│   ├── routes/             # API endpoints
│   ├── middlewares/        # Custom middleware
│   ├── services/           # Business logic
│   ├── configs/            # Configuration files
│   ├── package.json        # Backend dependencies
│   ├── package-lock.json   # Dependency lock file
│   ├── .env.example        # Environment variables template
│   └── server.js           # Server entry point
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## 🔗 API Endpoints

### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/user/logout` - User logout
- `POST /api/admin/login` - Admin login

### Products
- `GET /api/product/list` - Get all products with filters
- `POST /api/product/single` - Get single product
- `GET /api/product/top-rated` - Get top-rated products
- `POST /api/product/add` - Add new product (Admin)
- `PUT /api/product/update` - Update product (Admin)

### Cart & Orders
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/update` - Update cart quantity
- `POST /api/order/place` - Place new order
- `POST /api/order/userorders` - Get user orders

### Exhibitions
- `GET /api/exhibition/current` - Get current month exhibitions
- `POST /api/exhibition/purchase` - Purchase tickets
- `GET /api/exhibition/tickets` - Get user tickets

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

Built with ❤️ by [Your Name]



## 📞 Support

If you encounter any issues or have questions:
1. Check the existing issues on GitHub
2. Create a new issue with detailed description
3. Contact: your.email@example.com

---

⭐ If you found this project helpful, please give it a star on GitHub!