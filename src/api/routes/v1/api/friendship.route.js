const express = require("express");
const { requireJwtAuth, restrictTo } = require("../../../../middlewares/auth");
const { friendshipController } = require("../../../controllers");

const router = express.Router();

router
    .route("/friendRequest")
    .post(requireJwtAuth, restrictTo('player'), friendshipController.sendFriendRequest)
    .get(requireJwtAuth, restrictTo('player'), friendshipController.getFriendRequests);

router.put(
    "/:id/accept",
    requireJwtAuth,
    restrictTo('player'),
    friendshipController.acceptFriendRequest
);
router.delete(
    "/:id/reject",
    requireJwtAuth,
    restrictTo('player'),
    friendshipController.rejectFriendRequest
);

router.get("", requireJwtAuth, restrictTo('player'), friendshipController.getFriends);
router.delete("/:id/unfriend", requireJwtAuth, restrictTo('player'), friendshipController.unfriend);
router.put("/:id/block", requireJwtAuth, restrictTo('player'), friendshipController.blockFriend);
router.put("/:id/unblock", requireJwtAuth, restrictTo('player'), friendshipController.unblockFriend);

module.exports = router;
