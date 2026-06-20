import "dotenv/config";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? "https://painting-store-zdze.onrender.com/api/user/auth/google/callback"
          : "http://localhost:4000/api/user/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }

        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
        });
        await user.save();
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

export default passport;
