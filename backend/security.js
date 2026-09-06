function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === 'secret' || secret === 'super_secret_jwt_key') {
    throw new Error('JWT_SECRET must be set to a non-default value');
  }
  return secret;
}

module.exports = { getJwtSecret };
