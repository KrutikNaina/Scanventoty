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

    // Send token via postMessage to opener
    res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage({ type: 'oauth-success', token: '${token}' }, '*');
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
