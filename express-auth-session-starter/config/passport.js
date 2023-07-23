const passport = require("passport");
const { validPassword } = require("../lib/passwordUtils");
const LocalStrategy = require("passport-local").Strategy;
const connection = require("./database");
const User = connection.models.User;

// const customFields = {
//     usernameField: "uname",
//     passwordField: "pw"
// };

const verifyCallback = (username, password, done) => {
    console.log("I am verify callback");
    User.findOne({ username: username })
        .then(user => {
            if (!user) return done(null, false);

            const isValid = validPassword(password, user.hash, user.salt);

            if (isValid) return done(null, user);
            return done(null, false);
        })
        .catch(err => done(err));
};

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    console.log("I am serialize");
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    console.log("I am deserialize");
    User.findById(userId)
        .then(user => {
            done(null, user);
        })
        .catch(err => done(err));
});
