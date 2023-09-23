
import userModel from "../models/userModel.js";
import inventoryModel from "../models/inventoryModel.js";
import mongoose from "mongoose";

export const createInventoryController = async (req, res) => {
    try {
      const { email } = req.body;
      //validation
      const user = await userModel.findOne({ email });
      if (!user) {
        throw new Error("User Not Found");
      }
      // if (inventoryType === "in" && user.role !== "donar") {
      //   throw new Error("Not a donar account");
      // }
      // if (inventoryType === "out" && user.role !== "hospital") {
      //   throw new Error("Not a hospital");
      // }
  
      if (req.body.inventoryType == "out") {
        const requestedBloodGroup = req.body.bloodGroup;
        const requestedQuantityOfBlood = req.body.quantity;
        const organisation = new mongoose.Types.ObjectId(req.body.userId);
        //calculate Blood Quanitity
        const totalInOfRequestedBlood = await inventoryModel.aggregate([
          {
            $match: {
              organisation,
              inventoryType: "in",
              bloodGroup: requestedBloodGroup,
            },
          },
          {
            $group: {
              _id: "$bloodGroup",
              total: { $sum: "$quantity" },
            },
          },
        ]);
        // console.log("Total In", totalInOfRequestedBlood);
        const totalIn = totalInOfRequestedBlood[0]?.total || 0;
        //calculate OUT Blood Quanitity
  
        const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
          {
            $match: {
              organisation,
              inventoryType: "out",
              bloodGroup: requestedBloodGroup,
            },
          },
          {
            $group: {
              _id: "$bloodGroup",
              total: { $sum: "$quantity" },
            },
          },
        ]);
        const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;
  
        //in & Out Calc
        const availableQuanityOfBloodGroup = totalIn - totalOut;
        //quantity validation
        if (availableQuanityOfBloodGroup < requestedQuantityOfBlood) {
          return res.status(500).send({
            success: false,
            message: `Only ${availableQuanityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`,
          });
        }
        req.body.hospital = user?._id;
      }else{
        req.body.donar = user?._id;
      }
  
      //save record
      const inventory = new inventoryModel(req.body);
      await inventory.save();
      return res.status(201).send({
        success: true,
        message: "New Blood Reocrd Added",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Errro In Create Inventory API",
        error,
      });
    }
  };

export const getInventoryController = async(req,res)=>{
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .populate("donar")
      .populate("hospital")
      .sort({ createdAt: -1 });
    if (!inventory) {
      return res.status(401).send({
        message: "Error Getting Inventory",
        success: false,
      })
    }
    return res.status(200).send({
      success: true,
      message: "get all records successfully",
      inventory
    })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error Getting Inventory",
            success: false,
            error
        })
    }
}
export const getInventoryHospitalController = async(req,res)=>{
  try {
    // console.log("req.body.filter",req.body)
    const inventory = await inventoryModel
      .find({ inventoryType: req.body.filters })
      .populate("donar")
      .populate("hospital")
      .populate("organisation")
      .sort({ createdAt: -1 });
    if (!inventory) {
      return res.status(401).send({
        message: "Error Getting Hospital Consumer Inventory",
        success: false,
      })
    }
    return res.status(200).send({
      success: true,
      message: "get all records successfully",
      inventory
    })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error Getting Consumer Inventory",
            success: false,
            error
        })
    }
}

export const getDonarController = async (req, res) => {
  try {
    const organisation = req.body.userId
    const donarId = await inventoryModel.distinct("donar",{
      organisation
    });
    const donars = await userModel.find({_id:{$in:donarId}}).select("+password")
    return res.status(200).send({
      success:true,
      message:"Donar Record Fetched SuccesFully",
      donars
    })
  } catch (error) {
    console.log(error)
      res.status(500).send({
          message: "Error Getting Donar records",
          success: false,
          error
      })
  }
}

export const getHospitalController = async (req, res) => {
  try {
    const hospitals = await userModel.find({ role: "hospital" }).select("+password");

    return res.status(200).send({
      success: true,
      message: "Hospital Records Fetched Successfully",
      hospitals,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error Getting Hospital Records",
      success: false,
      error,
    });
  }
};

export const getOrganisationController = async (req, res) => {
  try {
   const donar = req.body.userId;
  //  const orgId = await inventoryModel.distinct("organisation",{donar})
   const orgId = await inventoryModel.distinct("organisation",{donar})
   const organisations = await userModel.find({_id:{$in:orgId}})
   return res.status(200).send({
    success: true,
    message:"organisation Records fetched succesfully",
    organisations
   })
  } catch (error) {
    console.log(error)
      res.status(500).send({
          message: "Error Getting Organisation  records",
          success: false,
          error
      })
  }
}

export const getOrganisationForHospitalController = async (req, res) => {
  try {
    const organisations = await userModel.find({ role: "organisation" });

    return res.status(200).send({
      success: true,
      message: "Organization Records Fetched Successfully",
      organisations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error Getting Organization Records",
      success: false,
      error,
    });
  }
};

export const getRecentInventoryController = async (req, res) => {
  try {
   const inventory = await inventoryModel.find({
    organisation : req.body.userId
   }).limit(3).sort({createdAt : -1})
   return res.status(200).send({
    success: true,
    message:"inventory Records fetched succesfully",
    inventory
   })
  } catch (error) {
    console.log(error)
      res.status(500).send({
          message: "Error In Recent Inventory.",
          success: false,
          error
      })
  }
}