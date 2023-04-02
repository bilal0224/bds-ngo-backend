import NGO from "../models/ngo";
import { hashPassword, comparePassword } from "../helpers/auth";
import jwt from "jsonwebtoken";
import user from "../models/user";
import mongoose from "mongoose";

//console.log(user);

export const register = async (req, res) => {
  console.log("REGISTER ENDPOINT => ", req.body);
  const { name, email, password } = req.body;
  //validation
  if (!name) return res.status(400).send("Name is required");
  if (!password || password.length < 6)
    return res
      .status(400)
      .send("Password is required and should be atleast 6 characters long");
  if (!email) return res.status(400).send("Email is required");
  const exist = await NGO.findOne({ email });
  if (exist) return res.status(400).send("Email is already taken");
  // hash password
  const hashedPassword = await hashPassword(password);

  //new ngo
  const ngo = new NGO({ name, email, password: hashedPassword });
  try {
    await ngo.save();
    console.log("REGISTERED USER => ", ngo);
    return res.json({
      ok: true,
    });
  } catch (err) {
    console.log("REGISTER FAILED => ", err);
    return res.status(400).send("Error, Try again.");
  }
};

export const login = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    const ngo = await NGO.findOne({ email });
    if (!ngo) return res.status(400).send("No NGO found");
    const match = await comparePassword(password, ngo.password);
    if (!match) return res.status(400).send("Invalid password");

    //create token
    const token = jwt.sign({ _id: ngo._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    ngo.password = undefined;
    ngo.secret = undefined;

    res.json({
      token,
      ngo,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try Again.");
  }
};

export const member = async (req, res) => {
  console.log(req.query);
  try {
    const _id = req.query._id;
    const email = req.query.email;

    if (_id && email) {
      const membersQuery = await NGO.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "members",
            foreignField: "_id",
            as: "members_info",
          },
        },
        { $match: { email: email } },
        { $project: { members_info: 1, _id: 0 } },
      ]);
      res.json({ membersQuery });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try Again");
  }
};

export const new_member = async (req, res) => {
  //console.log(req.body);
  try {
    const { new_member_info, ngo_id, ngo_email } = req.body;
    //const {fullName, email, phoneNumber} = new_member_info;
    const userExists = await user.findOne(new_member_info);
    if (!userExists) return res.status(400).send("Such a user does not exist");
    const searchNGO = {
      email: ngo_email,
      _id: mongoose.Types.ObjectId(ngo_id),
    };
    const targetNGO = await NGO.findOne(searchNGO);
    const targetNGOmembers = await targetNGO.members;
    const userID = await userExists._id;
    const userIDinNGO = await targetNGOmembers.includes(userID);
    if (userIDinNGO) return res.status(400).send("User is already your member");

    console.log(userID, targetNGO._id);
    res.json({ userExists });

    await NGO.updateOne({ _id: targetNGO._id }, { $push: { members: userID } });

    //const userInNGOAlreadyExists = await user.findOne()
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try Again");
  }
};

export const delete_member = async (req, res) => {
  console.log(req.body);
  try {
    const { ngo_id, user_id } = req.body;
    //console.log(ngo_id, user_id);
    const ngoQuery = { _id: mongoose.Types.ObjectId(ngo_id) };
    const delUser = {$pull: {'members': mongoose.Types.ObjectId(user_id)}}

    res.json({done: '1'}); 
    await NGO.updateOne(ngoQuery, delUser);

  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try to delete the member again");
  }
};