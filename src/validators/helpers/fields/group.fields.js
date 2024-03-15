const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const {groupNameMessages,
    membersMessages,
    descriptionMessages,
    avatarMessages,
    chatBackgroundImageMessages,
    userMessages,
memberStatusMessages,
    statusMessages} = require("../messags/course.messages");

const groupName = Joi.string()
    .messages(groupNameMessages)
    .label("Group Name");
const memberStatus = Joi.string()
    .valid('pending', 'approved', 'removed')
    .messages(memberStatusMessages)
    .label("Member Status");
const members = Joi.array()
    .items(Joi.object().keys({
        user: Joi.string()
            .messages(userMessages)
            .label("User"),
        status: memberStatus
    }))
    .messages(membersMessages)
    .label("Members");
const description = Joi.string()
    .messages(descriptionMessages)
    .label("Description");
const avatar = Joi.string()
    .messages(avatarMessages)
    .label("Avatar");
const chatBackgroundImage = Joi.string()
    .messages(chatBackgroundImageMessages)
    .label("Chat Background Image");
const status = Joi.string()
    .valid("available", "not available", "delete", "violated terms")
    .messages(statusMessages)
    .label("Status");

module.exports = {
    groupName,
    members,
    description,
    avatar,
    chatBackgroundImage,
    status,
    memberStatus
};