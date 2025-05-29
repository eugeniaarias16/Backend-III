import passport from 'passport';

export const authenticateJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.error('Error de autenticación', 500);
    }
    if (!user) {
      return res.error('No autorizado', 401, { info });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.error('Acceso denegado, se requiere rol de administrador', 403);
  }
};

export const authorizeUser = (req, res, next) => {
  if (req.user && (req.user.role === 'user' || req.user.role === 'admin')) {
    next();
  } else {
    res.error('Acceso denegado, debe iniciar sesión', 403);
  }
};