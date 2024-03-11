const express = require("express");
const { requireJwtAuth } = require("../../../../middlewares/auth");
const { friendshipController } = require("../../../controllers");

const router = express.Router();

router
    .route("/friendRequest")
    .post(requireJwtAuth, friendshipController.sendFriendRequest)
    .get(requireJwtAuth, friendshipController.getFriendRequests);

router.put(
    "/:id/accept",
    requireJwtAuth,
    friendshipController.acceptFriendRequest
);
router.delete(
    "/:id/reject",
    requireJwtAuth,
    friendshipController.rejectFriendRequest
);

router.get("", requireJwtAuth, friendshipController.getFriends);
router.delete("/:id/unfriend", requireJwtAuth, friendshipController.unfriend);
router.put("/:id/block", requireJwtAuth, friendshipController.blockFriend);
router.put("/:id/unblock", requireJwtAuth, friendshipController.unblockFriend);

module.exports = router;
