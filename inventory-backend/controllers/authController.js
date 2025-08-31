export const googleSuccess = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not Authorized" });
  }
  // Only return non-sensitive user fields
  const { id, email, name } = req.user;
  res.json({
    message: "Login successful",
    user: { id, email, name },
  });
};

export const logout = (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out successfully" });
  });
};
