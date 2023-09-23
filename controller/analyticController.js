import mongoose from "mongoose";
import inventoryModel from "../models/inventoryModel.js";

export const bloodGroupDetailController = async (req, res) => {
  try {
    const bloodGroups = ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"];
    const bloodGroupsData = [];
    const organisation = req.body.userId;

    await Promise.all(
      bloodGroups.map(async (bloodGroup) => {
        const totalBloodIn = await inventoryModel.aggregate([
          {
            $match: {
              bloodGroup: bloodGroup,
              inventoryType: "in",
            },
          },
          {
            $group: {
              _id: "$bloodGroup",
              total: { $sum: "$quantity" },
            },
          },
        ]);

        const totalBloodOut = await inventoryModel.aggregate([
          {
            $match: {
              bloodGroup: bloodGroup,
              inventoryType: "out",
            },
          },
          {
            $group: {
              _id: "$bloodGroup",
              total: { $sum: "$quantity" },
            },
          },
        ]);

        
        const availableBlood = (totalBloodIn[0]?.total || 0) - (totalBloodOut[0]?.total || 0);

        bloodGroupsData.push({
          bloodGroup,
          totalIn: totalBloodIn[0]?.total || 0,
          totalOut: totalBloodOut[0]?.total || 0,
          availableBlood,
        });
      })
    );

    return res.status(200).send({
      success: true,
      message: "BloodGroup Data Fetch Successfully",
      bloodGroupsData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in Analytics Blood Record",
      success: false,
      error,
    });
  }
};
