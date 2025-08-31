const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Check if user exists
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        avatar: payload.picture,
        googleId: payload.sub,
        role: "staff",
      });
    }

    // Create JWT
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: jwtToken,
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(401).json({ message: "Invalid Google token" });
  }
};
