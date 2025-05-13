import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import User from '../models/User.js';

const secret = process.env.JWT_SECRET || '';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        if (user) return done(null, user);
        return done(null, false);
    } catch (err) {
        return done(err, false);
    }
}));
