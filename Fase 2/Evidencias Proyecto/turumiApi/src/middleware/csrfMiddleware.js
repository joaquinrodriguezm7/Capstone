import crypto from "crypto";

export const csrfMiddleware = (req, res, next) => {
    const csrfToken = req.cookies.csrfToken || crypto.randomBytes(32).toString("hex");

    res.cookie("csrfToken", csrfToken, {
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
        httpOnly: false,
        maxAge: 24 * 60 * 60 * 1000
    })

    req.csrfToken = csrfToken;

    next();
};

export const verifyCsrfToken = (req, res, next) => {
    const tokenFromHeader = req.headers["x-csrf-token"];
    const tokenFromCookie = req.cookies.csrfToken;

    const shouldCheck = ["POST", "PUT", "DELETE"].includes(req.method);

    if (shouldCheck && tokenFromHeader !== tokenFromCookie) {
        return res.status(403).json({ message: "CSRF token inválido" });
    }

    next();
};
