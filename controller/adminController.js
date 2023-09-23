import userModel from "../models/userModel.js"

export const getdonarlistController = async (req, res) => {
    try {
        const donarData = await userModel.find({ role: "donar" }).sort({ createdAt: -1 })
        return res.status(200).send({
            success: true,
            total_count: donarData.length,
            message: "Get Donar List Successfully",
            donarData
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error In Donar List.",
            success: false,
            error
        })
    }
}

export const deletedonarController = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id)
        return res.status(200).send({
            success: true,
            message: "Donar Deleted Successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error In Deleting Donar.",
            success: false,
            error
        })
    }
}

export const getorganisationlistController = async (req, res) => {
    try {
        const organisationData = await userModel.find({ role: "organisation" }).sort({ createdAt: -1 })
        return res.status(200).send({
            success: true,
            total_count: organisationData.length,
            message: "organisation List Fetched Successfully",
            organisationData
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error In organisation List.",
            success: false,
            error
        })
    }
}

export const deleteorganisationController = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id)
        return res.status(200).send({
            success: true,
            message: "organisation Deleted Successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error In Deleting organisation.",
            success: false,
            error
        })
    }
}

export const gethospitallistController = async (req, res) => {
    try {
        const hospitalData = await userModel.find({ role: "hospital" }).sort({ createdAt: -1 })
        return res.status(200).send({
            success: true,
            total_count: hospitalData.length,
            message: "hospital List Fetched Successfully",
            hospitalData
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error In hospital List.",
            success: false,
            error
        })
    }
}

export const deletehospitalController = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id)
        return res.status(200).send({
            success: true,
            message: "hospital Deleted Successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error In Deleting hospital.",
            success: false,
            error
        })
    }
}