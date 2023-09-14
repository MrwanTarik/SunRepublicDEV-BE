const router = require('express').Router();

const { ADMIN_PASSWORD } = require('../../config/constants');

router.post('/password', async (req, res) => {
  try {
    if (req.body.password === ADMIN_PASSWORD) {
      res.json({ isValid: true });
    } else {
      res.json({ isValid: false });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
