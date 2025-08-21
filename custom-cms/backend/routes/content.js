const express = require("express");
const jwt = require("jsonwebtoken");
const Content = require("../models/Content");

const router = express.Router();

// Middleware JWT-tarkistukseen
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.companyId = decoded.companyId;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
}

// HAE sisältö
router.get("/:companyId", async (req, res) => {
  const content = await Content.findOne({ companyId: req.params.companyId });
  res.json(content);
});

// PÄIVITÄ sisältö (vain kirjautunut)
router.put("/", authMiddleware, async (req, res) => {
  const { content } = req.body;
  const updated = await Content.findOneAndUpdate(
    { companyId: req.companyId },
    { content, lastUpdated: Date.now() },
    { new: true, upsert: true }
  );
  res.json(updated);
});

module.exports = router;
