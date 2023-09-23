import userModel from "../models/userModel.js"

export const registerController = async (req, res) => {
    try {
        console.log("requestbody",req.body)
        const {email} = req.body;
        const existingUser = await userModel.findOne({ email })
            if (existingUser) {
                return res.status(200).send({
                    success: false,
                    message: "Email Already Registered Please Login"
                })
            }
            const newUser = new userModel(req.body);
            const token = await newUser.createJWT();
            await newUser.save()
            return res.status(201).send({
                success: true,
                message: "User Registered Successfully",
                newUser,
                token
            })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error In Register",
            success: false,
            error
        })
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).send({ success: false, message: "please provide email" })
        }
        if (!password) {
            return res.status(400).send({ success: false, message: "please provide password" })
        }
        const user = await userModel.findOne({ email }).select("+password")
        if (!user) {
            return res.status(400).send({ success: false, message: "Invalid Username or Password" })
        }
        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(400).send({ success: false, message: "Invalid Username or Password" })
        }
        if(user.role !== req.body.role){
            return res.status(500).send({
                success: false,
                message: "Roles doesn't match"
            })
        }
        user.password = undefined;
        const token = user.createJWT()
        res.status(200).json({
            success: true,
            message: "Login Successfully",
            user,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            message: "Error In Login",
            success: false,
            error
        })
    }
} 


export const currentUserController = async (req, res) => {
    try {
        const user = await userModel.findOne({_id:req.body.userId})
        return res.status(200).send({
            success: true,
            message: "User Fetched SuccessFully",
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error In Register",
            success: false,
            error
        })
    }
}