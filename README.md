# week5_day1

> Passport | Sign Up, Login, Logout
>
> Passport | Security & Roles

## Main points: Passport | Sign Up, Login, Logout

- Passport dispone de **Local Strategy** para gestionar el inicio de sesión mediante usuario/contraseña.
- Setup:
    * Instalar y requerir dependencias:
      ````javascript
      const session = require("express-session")
      const bcrypt = require("bcrypt")
      const passport = require("passport")
      const LocalStrategy = require("passport-local").Strategy
      const flash = require("connect-flash")    // Error handling
      ````
      
    * Configurar middleware de `express-session`:
      ````javascript
      app.use(session({
        secret: "our-passport-local-strategy-app",
        resave: true,
        saveUninitialized: true
      }))
      ````

    * Configurar serialización y deserialización de usuario:
      ````javascript
      passport.serializeUser((user, cb) => cb(null, user._id))
      passport.deserializeUser((id, cb) => {
        User.findById(id, (err, user) => {
          if (err) { return cb(err) }
          cb(null, user)
        })
      })
      ````
      
    * Configurar estrategia:
      ````javascript
      app.use(flash())    // Error handling
      passport.use(new LocalStrategy({ passReqToCallback: true }, (req, username, password, next) => {
        User.findOne({ username })
          .then(theUser => {
            if (!theUser) return next(null, false, { message: "Nombre de usuario incorrecto" })
            if (!bcrypt.compareSync(password, theUser.password)) return next(null, false, { message: "Contraseña incorrecta" })
            return next(null, theUser);
          })
          .catch(err => next(err))
      }))
      ````
    
    * Inicializar tanto `passport` como `passport session`:
      ````javascript
      app.use(passport.initialize())
      app.use(passport.session())
      ````
    
   * Configurar dos endpoints para login (`.get()`y `.post()`) y uno para logout (`.get()`):
       ````javascript
       router.get("/login", (req, res) => res.render("auth/login", { "message": req.flash("error") }))
       router.post("/login", passport.authenticate("local", {
         successRedirect: "/",
         failureRedirect: "/login",
         failureFlash: true,
         passReqToCallback: true
       }))
       router.get("/logout", (req, res) => {
         req.logout()
         res.redirect("/login")
       })
       ````
    
## Main points: protected routes

- Es posible gestionar rutas protegidas mediante la dependencia `connect-ensure-connect`
- Setup:
  * Instalar y requerir `ensure-connect`
      ````javascript
      const ensureLogin = require("connect-ensure-login");
      ````
      
  * Incluirlo como middleware de acceso cuando sea necesario:
      ````javascript
      router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => res.render("private", { user: req.user }));
      ````
