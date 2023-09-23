import userModel from "../models/userModel.js";

const adminAuth = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.body.userId)
        if(user && user.role !== "admin"){
            return res.status(401).send({
                success :false,
                message:"Admin Not Verified"
            })
        }else{
            next()
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Admin Auth Failed",
            error
        })
    }
};

export default adminAuth;