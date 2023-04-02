const express = require("express");
const controller = require("../controllers/controller");

const router = express.Router();

router.post("/register", controller.register);
router.post("/login", controller.login);

router.get("/current-ngo/members", controller.member);
router.put("/current-ngo/add-new-member", controller.new_member);
router.put("/current-ngo/remove-member", controller.delete_member);

module.exports = router;