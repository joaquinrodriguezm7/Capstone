export async function logout (req, res, next){
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "Strict",
            secure: process.env.NODE_ENV === "production"
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "Strict",
            secure: process.env.NODE_ENV === "production"
        });

        res.clearCookie("csrfToken", {
            httpOnly: false,
            sameSite: "Strict",
            secure: process.env.NODE_ENV === "production"
        });
        
        return res.status(200).json({ message: "Logout exitoso" });
    } catch(error) {
        next(error);
    }
}