const Group = require('../models/groupmodel');

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
