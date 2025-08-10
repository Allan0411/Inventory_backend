const HttpException = require('../utils/HttpException.utils');
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// JWT/role authorization middleware
const auth = (...roles) => {
  return async function (req, res, next) {
    try {
      const authHeader = req.headers.authorization || '';
      const bearer = 'Bearer ';
      console.log('authHeader:', authHeader);

      if (!authHeader.startsWith(bearer)) {
        console.log('No Bearer token found in header');
        throw new HttpException(401, 'Access denied. No credentials sent!');
      }

      // Extract and verify JWT token
      const token = authHeader.replace(bearer, '').trim();
      console.log('Extracted token:', token);

      const secretKey = process.env.SECRET_JWT;
      console.log('JWT Secret:', secretKey);

      if (!secretKey) throw new HttpException(500, 'JWT secret is not set!');

      let decoded;
      try {
        decoded = jwt.verify(token, secretKey);
        console.log('Decoded JWT:', decoded);
      } catch (e) {
        console.log('JWT verification error:', e);
        throw new HttpException(401, 'Invalid or expired token');
      }

      // Check for undefined user_id in decoded token
      if (typeof decoded.user_id === 'undefined') {
        console.log('decoded.user_id is undefined! This will cause SQL error.');
        throw new HttpException(401, 'Invalid token payload: user_id missing');
      }

      // Fetch user (use correct key matching your DB)
      console.log('Looking up user with user_id:', decoded.user_id);
      const user = await UserModel.findOne({ user_id: decoded.user_id });
      console.log('User found:', user);

      if (!user) {
        throw new HttpException(401, 'Authentication failed! User not found.');
      }

      // Optional: Owner logic—for resource actions on `/resource/:id`
      // Only relevant if your endpoint needs users to act on their own data
      let ownerAuthorized = false;
      if (req.params.id) {
        // Use user.user_id to match your DB, not user.id
        ownerAuthorized = req.params.id == user.user_id;
      }
      console.log('req.params:', req.params);
      console.log('ownerAuthorized:', ownerAuthorized);
      console.log('roles required:', roles);
      console.log('user.role:', user.role);

      // Main role check
      if (!ownerAuthorized && roles.length && !roles.includes(user.role)) {
        console.log('Role check failed');
        throw new HttpException(403, 'Forbidden: insufficient permissions');
      }

      // User is authorized, attach info for controller use
      req.currentUser = user;
      next();
    } catch (e) {
      console.log('Error in auth middleware:', e);
      if (!e.status) e.status = 401;
      next(e);
    }
  };
};

module.exports = auth;
