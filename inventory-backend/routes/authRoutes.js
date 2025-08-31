import express from "express";
import passport from "../config/passport.js"; // JWT-based Google strategy

const router = express.Router();

// Login with Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);


router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    const { token } = req.user;

    // Determine the allowed origin from an environment variable or config
    const allowedOrigin = process.env.ALLOWED_OAUTH_ORIGIN;

    if (!allowedOrigin) {
      // Fail securely if not configured
      return res.status(500).send("OAuth origin not configured");
    }

    // Safely serialize the token to prevent XSS
    const safeToken = JSON.stringify(token);

    // Send token via postMessage to opener with restricted origin
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener && typeof window.opener.postMessage === 'function') {
              window.opener.postMessage({ type: 'oauth-success', token: ${safeToken} }, '${allowedOrigin}');
            }
            window.close();
          </script>
        </body>
      </html>
    `);
  }
);


// Logout (optional if using JWT only)
router.get("/logout", (req, res) => {
  res.send("Logged out (frontend should remove token if stored)");
});

export default router;
