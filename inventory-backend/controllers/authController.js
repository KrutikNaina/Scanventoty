export const googleSuccess = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not Authorized" });
  }
  res.json({
    message: "Login successful",
    user: req.user,
  });
};

export const logout = (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out successfully" });
  });
};
