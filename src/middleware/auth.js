const jwt = require("jsonwebtoken");
require("dotenv").config();

// ------------------- Authenticate JWT -------------------
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1]; // ✅ get token from "Bearer <token>"
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Normalize role to lowercase
    req.user = {
      ...decoded,
      role: decoded.role ? String(decoded.role).toLowerCase() : undefined,
    };

    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// ------------------- Authorize Roles -------------------
const authorizeRoles = (...roles) => {
  const allowed = roles.map((r) => String(r).toLowerCase());
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ error: "Unauthorized: No user info" });

    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: Requires role(s): ${allowed.join(", ")}`,
      });
    }

    next();
  };
};

module.exports = { authenticate, authorizeRoles };
