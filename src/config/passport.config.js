import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import  config  from './config.js';
import userService from '../services/user.service.js';

// Función para extraer cookies
export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.authToken;
  }
  return token;
};

// Configuración de la estrategia JWT
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  secretOrKey: config.jwt_secret
};

// Estrategia JWT
passport.use('jwt', new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await userService.getUserById(payload.id);
    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

// Estrategia current para obtener el usuario actual
passport.use('current', new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await userService.getUserById(payload.id);
    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

export default passport;