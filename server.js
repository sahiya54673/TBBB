// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');

// // Connect to Database
// connectDB().catch(err => {
//   console.error("Critical: Database connection failed at startup", err.message);
// });

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// // Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/tasks', require('./routes/taskRoutes'));

// // Health-check endpoints
// app.get("/api", (req, res) => {
//   res.json({ message: "Task Manager API is running..." });
// });

// app.get('/api/health', (req, res) => {
//   res.json({ status: 'ok', database: 'connected?' });
// });

// // Final catch-all for unmatched /api routes
// app.use('/api', (req, res) => {
//   res.status(404).json({
//     error: 'Not Found',
//     message: `API route ${req.method} ${req.originalUrl} not found on this server.`
//   });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong!' });
// });

// // For local development
// if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
//   const PORT = process.env.PORT || 5001;
//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// }

// module.exports = app;

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// ✅ Connect to Database
connectDB().catch(err => {
  console.error("Database connection failed:", err.message);
});

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Request Logger (for debugging Vercel paths)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Root route (FIX for "Cannot GET /")
app.get("/", (req, res) => {
  res.json({
    message: "Task Manager API is running 🚀",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      tasks: "/api/tasks"
    }
  });
});

// ✅ API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ✅ 404 handler for API
app.use('/api', (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `${req.method} ${req.originalUrl} not found`
  });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// ✅ Local development only
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// ✅ Export for Vercel
module.exports = app;