import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { env } from './env.config.js';
import { userRepository } from '../repositories/_index.js';
import { verifyPassword } from '../utils/hash.js';
import { errorResponse } from '../dto/response.dto.js';

export const initializePassport = (passport) => {
  passport.use(
    'local',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          const user = await userRepository.getByEmail(email);

          if (!user) {
            return done(null, false, { message: 'Invalid credentials' });
          }

          if (!user.password) {
            return done(null, false, { message: 'Invalid credentials' });
          }

          const valid = await verifyPassword(user.password, password);

          if (!valid) {
            return done(null, false, { message: 'Invalid credentials' });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    'jwt',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          ExtractJwt.fromAuthHeaderAsBearerToken(),
          (req) => req?.cookies?.accessToken || null
        ]),
        secretOrKey: env.JWT_ACCESS_SECRET
      },
      async (payload, done) => {
        try {
          const user = await userRepository.getById(payload.sub);

          if (!user) {
            return done(null, false, { message: 'User not found' });
          }

          return done(null, user);
        } catch (error) {
          return done(error, false, { message: 'Error retrieving user' });
        }
      }
    )
  );
};
