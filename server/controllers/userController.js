import User from "../models/usersModel.js";

export const getUser = async (req, res) => {
  try {
    const userData = await User.findById(req?.params?.userId);
    if (userData) {
      res.status(200).json({
        _id: userData._id,
        fullName: userData.fullName,
        email: userData.email,
        avatar: userData.avatar,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const profilePhotoUpdate = async (req, res) => {
  try {
    if (req.user.userId !== req?.params?.id) {
      return res.status(401).send({
        success: false,
        message:
          "You can only update your own account profile photo please login again!",
      });
    }

    const updatedProfilePhoto = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const validUser = await User.findById(req.params.id);
    const { password: pass, ...rest } = validUser._doc;

    if (updatedProfilePhoto) {
      return res.status(201).send({
        success: true,
        message: "Profile photo updated",
        user: rest,
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const profileUpdate = async (req, res) => {
  try {
    if (req.user.userId !== req?.params?.id) {
      return res.status(401).send({
        success: false,
        message: "You can only update your own account please login again!",
      });
    }

    const updatedProfile = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          fullName: req.body.fullName,
        },
      },
      { new: true }
    );

    const validUser = await User.findById(req.params.id);
    const { password: pass, ...rest } = validUser._doc;

    if (updatedProfile) {
      return res.status(201).send({
        success: true,
        message: "Profile updated",
        user: rest,
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getUserByEmail = async (req, res) => {
  const searchEmail = req?.params?.email;
  if (!searchEmail)
    return res.status(400).json({ error: "Search valid user!" });
  try {
    const user = await User.find(
      { email: searchEmail },
      { fullName: 1, email: 1 }
    );
    // console.log(user);
    if (user.length > 0) {
      return res.status(200).json({ success: true, user: user });
    } else {
      return res.status(200).json({ success: false, msg: "User not found!" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const searchUsers = async (req, res) => {
  const searchQuery = req?.params?.query;
  if (!searchQuery)
    return res.status(400).json({ error: "Search valid user!" });
  try {
    const users = await User.find(
      {
        $or: [
          { email: { $regex: searchQuery, $options: "i" } },
          { fullName: { $regex: searchQuery, $options: "i" } },
        ],
      },
      { fullName: 1, email: 1 }
    );
    // console.log(user);
    if (users.length > 0) {
      return res.status(200).json({ success: true, users: users });
    } else {
      return res.status(200).json({ success: false, msg: "User not found!" });
    }
  } catch (error) {
    console.log(error);
  }
};
