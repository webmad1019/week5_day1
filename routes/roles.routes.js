const express = require("express");
const router = express.Router();
/*
const checkRole = role => (req, res, next) => {
  if (req.user && req.user.role === role) {
    return next()
  }
  else {
    res.render("index", { msg: `Necesitas ser un ${role} para acceder aquí` })
  }
}
*/


const checkRole = role => (req, res, next) => req.user && req.user.role === role ? next() : res.render("index", { roleErrorMessage: `Necesitas ser un ${role} para acceder aquí` })
const isRole = role => (req, res, next) => req.user && req.user.role === role

router.get('/guest-page', checkRole('GUEST'), (req, res) => res.render('save-items', { user: req.user }))
router.get('/editor-page', checkRole('EDITOR'), (req, res) => res.render('edit-items', { user: req.user }))
router.get('/admin-page', checkRole('ADMIN'), (req, res) => res.render('administrate-items', { user: req.user }))
router.get('/miscelania-page', (req, res) => res.render('conditional-rendering', { isAdmin: isRole('ADMIN') }))

module.exports = router