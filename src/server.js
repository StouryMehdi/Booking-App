require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const morgan = require("morgan");
const compression = require("compression");
const { initializeData } = require("./utils/init");
const path = require("path");
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// =====================
// Initial Middlewares
// =====================
app.use(morgan("dev"));
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());


// Security Headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});
app.use(cors());
// HTTPS Redirection (Production only)
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      return res.redirect(`https://${req.header("host")}${req.url}`);
    }
    next();
  });
  app.use(compression());
}

// =====================
// CORS Configuration
// =====================
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 200
}));

// =====================
// Rate Limiting
// =====================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests",
      message: "Please try again later",
      retryAfter: 15
    });
  }
});
app.use("/api", limiter);

// =====================
// API Routes
// =====================
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");
const adminRoutes = require("./routes/admin");

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// =====================
// Static Files (Production)
// =====================
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

// =====================
// Error Handling
// =====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  const message = process.env.NODE_ENV === "development" 
    ? err.message 
    : "An error occurred";
  
  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    code: err.code || "SERVER_ERROR"
  });
});

// =====================
// Server Initialization
// =====================
initializeData()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`
      Server running in ${process.env.NODE_ENV} mode
      Port: ${PORT}
      Origin: ${process.env.ALLOWED_ORIGIN || "http://localhost:3000"}
      `);
    });
  })
  .catch((err) => {
    console.error("Server initialization failed:", err);
    process.exit(1);
  });