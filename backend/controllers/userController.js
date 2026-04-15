const { body, query } = require("express-validator");
const User = require("../models/User");
const AppError = require("../utils/errors");

const createUserValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["admin", "manager", "user"])
    .withMessage("Invalid role"),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Invalid status"),
];

const updateUserValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid email format"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["admin", "manager", "user"])
    .withMessage("Invalid role"),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Invalid status"),
];

const createUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = "user",
      status = "active",
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("Email already in use", 400));
    }

    const user = new User({
      name,
      email,
      passwordHash: password,
      role,
      status,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, status, search } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const filter = {};

    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const totalUsers = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select("-passwordHash")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .exec();

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalUsers / limitNum),
        totalUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select("-passwordHash")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, status } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (req.user.role === "manager" && user.role === "admin") {
      return next(new AppError("Managers cannot modify admin users", 403));
    }

    if (req.user.role === "manager" && role === "admin") {
      return next(new AppError("Managers cannot assign admin role", 403));
    }

    if (req.user.role === "manager" && status !== undefined) {
      return next(new AppError("Managers cannot change user status", 403));
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(new AppError("Email already in use", 400));
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.passwordHash = password;
    if (role !== undefined) user.role = role;
    if (status !== undefined) user.status = status;

    user.updatedBy = req.user._id;

    await user.save();

    res.json({
      success: true,
      message: "User updated successfully",
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

const activateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }
    user.status = "active";
    user.updatedBy = req.user._id;
    await user.save();
    res.json({
      success: true,
      message: "User activated successfully",
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    user.status = "inactive";
    user.updatedBy = req.user._id;

    await user.save();

    res.json({
      success: true,
      message: "User deactivated successfully",
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

const getOwnProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-passwordHash")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateOwnProfile = async (req, res, next) => {
  try {
    const { name, password } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (password) user.passwordHash = password;

    user.updatedBy = req.user._id;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  createUserValidation,
  getUsers,
  getUserById,
  updateUser,
  updateUserValidation,
  deactivateUser,
  activateUser,
  getOwnProfile,
  updateOwnProfile,
};
