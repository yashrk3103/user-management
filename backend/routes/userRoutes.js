const express = require("express");
const {
  createUser,
  createUserValidation,
  getUsers,
  getUserById,
  updateUser,
  updateUserValidation,
  deactivateUser,
  activateUser,
  deleteUser,
  getOwnProfile,
  updateOwnProfile,
} = require("../controllers/userController");
const { authMiddleware, authorize } = require("../middleware/auth");
const { handleValidationErrors } = require("../utils/validation");

const router = express.Router();

router.get("/profile", authMiddleware, getOwnProfile);
router.put(
  "/profile",
  authMiddleware,
  updateUserValidation,
  handleValidationErrors,
  updateOwnProfile,
);

router.post(
  "/",
  authMiddleware,
  authorize("admin"),
  createUserValidation,
  handleValidationErrors,
  createUser,
);

router.get("/", authMiddleware, authorize("admin", "manager"), getUsers);

router.get("/:id", authMiddleware, authorize("admin", "manager"), getUserById);

router.put(
  "/:id",
  authMiddleware,
  authorize("admin", "manager"),
  updateUserValidation,
  handleValidationErrors,
  updateUser,
);

router.put(
  "/:id/deactivate",
  authMiddleware,
  authorize("admin"),
  deactivateUser,
);

router.put("/:id/activate", authMiddleware, authorize("admin"), activateUser);
router.delete("/:id", authMiddleware, authorize("admin"), deleteUser);
module.exports = router;
