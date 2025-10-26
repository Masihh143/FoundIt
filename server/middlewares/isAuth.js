import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    // 1️⃣ Try to extract token (from either cookies or Authorization header)
    let token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Attach user ID to request object
    req.userId = decoded.id;

    // 4️⃣ Pass control to next middleware or controller
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

export default isAuth;
