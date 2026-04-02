const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { errorHandler } = require("./utils/errorHandler");
const { apiLimiter } = require("./middleware/rateLimit.middleware");

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = (
  process.env.CLIENT_URLS ||
  process.env.CLIENT_URL ||
  "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server and tools that don't send Origin.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/api", apiLimiter);

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/resume", require("./routes/resume.routes"));
app.use("/api/jobs", require("./routes/jobs.routes"));
app.use("/api/applications", require("./routes/application.routes"));

app.get("/health", (req, res) =>
  res.json({ status: "OK", timestamp: new Date() }),
);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
