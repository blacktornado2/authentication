const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({
        msg: "You are not authorized to view this resource"
    });
};

const isNotAuth = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect("/protected-route");
};

const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.admin) {
        next();
    } else {
        res.status(401).json({
            msg: "You are not authorized to view this resource because you are not admin"
        });
    }
};

module.exports = {
    isAuth,
    isAdmin,
    isNotAuth
};
