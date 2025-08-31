import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("🔑 Google Access Token:", accessToken);
        console.log("👤 Google Profile:", profile);

        // Check if user exists
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Assign role based on email
          const role = profile.emails[0].value === "nenakrutik2004@gmail.com" ? "Admin" : "staff";

          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            role,
          });
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: user._id, name: user.name, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        // Return user and token via done
        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// ✅ Remove serializeUser / deserializeUser
// JWT approach does not require session support


export default passport;
