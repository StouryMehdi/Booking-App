const validateBooking = (req, res, next) => {
  const { name, date, time, guests, tel } = req.body;
  
  if (!name || !date || !time || !guests) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
    return res.status(400).json({ error: "Invalid name format" });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date) || isNaN(new Date(date).getTime())) {
    return res.status(400).json({ error: "Use YYYY-MM-DD format for date" });
  }

  if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    return res.status(400).json({ error: "Use HH:MM format for time" });
  }

  const guestsNumber = Number(guests);
  if (isNaN(guestsNumber) || guestsNumber < 1 || guestsNumber > 20) {
    return res.status(400).json({ error: "Guests must be between 1-20" });
  }

  if (tel && !/^[\d\s+-]{6,20}$/.test(tel)) {
    return res.status(400).json({ error: "Invalid phone format" });
  }

  req.body.name = name.trim();
  req.body.tel = tel ? tel.trim() : null;

  next();
};

const validateUser = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  next();
};

module.exports = {
  validateBooking,
  validateUser
};