const Location = require("../models/Location");




const NearbyController = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.body;

    // const locations = await Location.aggregate([
    //   {
    //     $geoNear: {
    //       near: { type: "Point", coordinates: [latitude,longitude ] },
    //       distanceField: "distance",
    //       maxDistance: radius * 1000, // meters
    //       spherical: true,
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "user",
    //       foreignField: "_id",
    //       as: "userInfo",
    //     },
    //   },
    //   { $unwind: "$userInfo" },
    //   {
    //     $project: {
    //       _id: "$userInfo._id",
    //       fullName: "$userInfo.fullName",
    //       currentPosition: "$userInfo.currentPosition",
    //       bio: "$userInfo.bio",
    //       latitude: { $arrayElemAt: ["$location.coordinates", 1] },
    //       longitude: { $arrayElemAt: ["$location.coordinates", 0] },
    //       distance: 1,
    //     },
    //   },
    // ]);
    const locations = await Location.aggregate([
  {
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      distanceField: "distance",
      spherical: true,
      maxDistance: radius * 1000, // meters
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "userDetails",
    },
  },
  {
    $unwind: "$userDetails",
  },
  {
    $project: {
      _id: "$userDetails._id",
      fullName: "$userDetails.fullName",
      currentPosition: "$userDetails.currentPosition",
      bio: "$userDetails.bio",
      latitude: { $arrayElemAt: ["$location.coordinates", 1] },
      longitude: { $arrayElemAt: ["$location.coordinates", 0] },
      distance: 1,
    },
  },
]);


    res.json({ success: true, users: locations });
  } catch (error) {
    console.error("Nearby users error:", error);
    res.status(500).json({ success: false, message: "Could not fetch nearby users" });
  }
};
 module.exports = NearbyController;