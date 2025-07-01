const Group = require('../models/groupmodel');
const code = require('../utils/statuscodemessage');

exports.getJoinedGroups = async (req, res) => {
  try {
    const userId = req.userId; // this is set by your auth middleware
    const groups = await Group.find({ 'members.userId': userId });
    // console.log(groups);

    res.status(200).json({ success: true, groups });
  } catch (err) {
    console.error("❌ Failed to fetch groups:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const messageModel = require('../models/messagemodel');

exports.getGroupMessages = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    const messages = await messageModel.find({
      receiver: groupId,
      isGroup: true
    }).sort({ createdAt: 1 });

    return res.status(200).json({ success: true, data: messages });
  } catch (err) {
    console.error("Error fetching group messages:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
// GET /api/group/user/:userid
exports.getUserGroups = async (req, res) => {
  try {
    const userId = req.params.userid;
    const groups = await Group.find({ 'members.userId': userId });
    res.status(200).json({ groups });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user groups' });
  }
};

exports.deletegroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.userId;

    const groupdata = await Group.findById(groupId);

    if (String(userId) !== String(groupdata.createdBy)) {
      return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "only admin can delete group" })
    }
    const deletegroup = await Group.findByIdAndDelete(groupId);
    if (!deletegroup) {
      return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "group not delete" });
    }
    return res.status(code.OK).json({ sucess: true, status: code.OK, message: "group delete sucessfully" });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch user groups' });
  }
}