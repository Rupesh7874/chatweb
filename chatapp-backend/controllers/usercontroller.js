const usermodel = require('../models/usermodel');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const code = require('../utils/statuscodemessage');
const { isvalidemail, validpassword } = require('../confige/validation');
const jwt = require('jsonwebtoken');
const cron = require("node-cron");
const Group = require('../models/groupmodel');
const group = require('../models/groupmodel');
const messagemodel = require('../models/messagemodel');
const sendmail = require('../confige/sendmail');
const otpModel = require('../models/otpModel');


exports.userragister = async (req, res) => {
    try {
        console.log(req.body);

        const { name, email, password, confirmpassword, age, gender } = req.body;
        const cheakmail = await usermodel.findOne({ email });
        if (cheakmail) {
            return res.status(400).json({ msg: "user alredy ragister", status: 0 })
        }
        if (!name) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "name is require" })
        }
        if (!email) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "email is require" })
        }
        if (!isvalidemail(email)) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "invalid email" })
        }
        if (!password) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "password is require" })
        }
        if (!confirmpassword) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "confirmpassword is require" })
        }
        if (!validpassword(password)) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "minimum password length is 5" })
        }
        if (password !== confirmpassword) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "password and confirmpassword are not same" })
        }
        if (!age) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "age is require" })
        }
        if (!gender) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "gender is require" })
        }
        if (req.file) {
            const userimagedata = usermodel.useruploadpth + '/' + req.file.filename;
            const hashpass = await bcrypt.hash(password, 10);

            const User = new usermodel({
                name,
                email,
                password: hashpass,
                age,
                gender,
                profileimage: userimagedata
            })

            const Userdata = await User.save();
            if (Userdata) {
                return res.status(code.CREATED).json({ sucess: true, message: "user create with image sucessfully", Userdata: Userdata })
            }
            else {
                return res.status(code.SERVER_ERROR).json({ sucess: false, status: code.SERVER_ERROR, message: "server error" })
            }
        }
        else {
            const hashpass = await bcrypt.hash(password, 10);
            const User = new usermodel({
                name,
                email,
                password: hashpass,
                age,
                gender
            })

            const Userdata = await User.save();
            if (Userdata) {
                return res.status(code.CREATED).json({ sucess: true, message: "user create sucessfully", Userdata: Userdata })
            }
            else {
                return res.status(code.SERVER_ERROR).json({ sucess: false, status: code.SERVER_ERROR, message: "server error" })
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(code.SERVER_ERROR).json({ sucess: false, status: code.SERVER_ERROR, message: "internal server error" })
    }
}

exports.userlogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const cheakmail = await usermodel.findOne({ email: email })

        if (!cheakmail) {
            return res.status(code.NOT_FOUND).json({ sucess: false, status: code.NOT_FOUND, message: "user not found" })
        }
        const cheackpass = await bcrypt.compare(password, cheakmail.password);
        if (!cheackpass) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "password is not valid" })
        }
        // const datawithoutpass = cheakmail.toObject();
        // delete datawithoutpass.password;
        const token = jwt.sign({ userId: cheakmail._id, email: cheakmail.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ msg: "user login sucessfully", cheakmail: cheakmail, token: token });
    }
    catch (error) {
        console.log(error);
        return res.status(code.SERVER_ERROR).json({ sucess: false, status: code.SERVER_ERROR, message: "internal server error" })
    }
}

exports.creategroup = async (req, res) => {
    try {
        const { groupname, role } = req.body;
        const userId = req.userId;

        if (role !== 'admin') {
            return res.status(code.Forbidden).json({ sucess: false, status: code.Forbidden, message: "Only admins can create groups" })
        }

        const newGroup = await Group.create({
            groupname,
            createdBy: userId,
            members: [
                {
                    userId,
                    role: role || 'admin'
                }
            ]
        });

        return res.status(code.CREATED).json({ sucess: true, message: "Group created successfully", group: newGroup })
    } catch (err) {
        console.log(err);
        return res.status(code.SERVER_ERROR).json({ sucess: false, status: code.SERVER_ERROR, message: "internal server error" })
    }
}

exports.request_join = async (req, res) => {
    try {
        const { groupid } = req.body
        const userId = req.userId;

        const checkgroup = await group.findById(groupid);
        if (!checkgroup) {
            return res.status(code.NOT_FOUND).json({ sucess: false, status: code.NOT_FOUND, message: "group not found" })
        }
        if (checkgroup.members.some(m => m.userId === userId)) {
            return res.status(400).json({ message: 'Already a member' });
        }
        if (!checkgroup.joinRequests.includes(userId)) {
            checkgroup.joinRequests.push(userId);
            await checkgroup.save()
        }
        res.json({ message: 'Join request sent' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to join request', error: err.message });
    }
}
exports.approve_request = async (req, res) => {
    try {
        const { groupid, userid } = req.body;
        const adminId = req.userId;

        const checkGroup = await group.findById(groupid);
        if (!checkGroup) {
            return res.status(404).json({ message: "Group not found", status: 0 });
        }

        const adminMember = checkGroup.members.find(m => m.userId.toString() === adminId.toString());
        if (!adminMember || adminMember.role !== 'admin') {
            return res.status(403).json({ message: "Only admins can approve join requests" });
        }

        if (!checkGroup.joinRequests.includes(userid.toString())) {
            return res.status(400).json({ message: "User did not request to join" });
        }

        checkGroup.joinRequests = checkGroup.joinRequests.filter(id => id.toString() !== userid.toString());

        checkGroup.members.push({
            userId: userid,
            role: 'member'
        });

        await checkGroup.save();

        res.status(200).json({ message: "User added to group successfully" });
    } catch (err) {
        console.log(err);
        return res.status(code.SERVER_ERROR).json({ sucess: false, status: code.SERVER_ERROR, message: "internal server error" })
    }
}

exports.getallgroupmember = async (req, res) => {
    try {
        const { id } = req.params;

        const groupmemdata = await group.findById(id);
        if (!groupmemdata) {
            res.status(404).json({ msg: "group not found", status: 0 })
        }
        res.status(200).json({ msg: "group's member found sucessfully", status: 1, groupmemdata: groupmemdata.members })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed getallgroupmember", error: err.message });
    }
}

exports.allusers = async (req, res) => {
    try {
        const currentUserId = req.query.userId;

        if (!currentUserId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const users = await usermodel.find({ _id: { $ne: currentUserId } }).select("-password")


        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users, // ✅ Frontend expects `res.data.data`
        });
    } catch (error) {
        console.error("Error in allusers:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
    }
};

exports.conversation = async (req, res) => {
    const { user1, user2 } = req.query;
    if (!user1 || !user2) return res.status(400).json({ message: 'Missing user IDs' });

    try {
        const messages = await messagemodel.find({
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 },
            ],
        }).sort({ timestamp: 1 });

        res.json({ success: true, data: messages });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to load messages" });
    }
}

exports.userupdate = async (req, res) => {
    try {
        const { name, email, password, confirmpassword, age, gender } = req.body;
        const { id } = req.params
        const cheakmail = await usermodel.findById(id);

        if (!cheakmail) {
            return res.status(400).json({ msg: "user not found", status: 0 })
        }
        if (!name) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "name is require" })
        }
        if (!email) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "email is require" })
        }
        if (!isvalidemail(email)) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "invalid email" })
        }
        if (!password) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "password is require" })
        }
        if (!confirmpassword) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "confirmpassword is require" })
        }
        if (!validpassword(password)) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "minimum password length is 5" })
        }
        if (password !== confirmpassword) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "password and confirmpassword are not same" })
        }
        if (!age) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "age is require" })
        }
        if (!gender) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "gender is require" })
        }
        let oldimgpath = cheakmail.profileimage;
        let newimgpath = "";

        if (req.file) {
            // Delete old image if exists
            if (cheakmail.profileimage) {
                const oldpath = path.join(__dirname, '..', cheakmail.profileimage);
                if (fs.existsSync(oldpath)) {
                    fs.unlinkSync(oldpath);
                }
            }
            newimgpath = usermodel.useruploadpth + '/' + req.file.filename;
        }

        const hashpass = await bcrypt.hash(password, 10);
        const updateuser = {
            name,
            email,
            password: hashpass,
            age,
            gender,
            profileimage: req.file ? newimgpath : oldimgpath
        }
        const newuser = await usermodel.findByIdAndUpdate(id, updateuser, { new: true });
        if (!newuser) {
            res.status(400).json({ msg: "user not update", status: 0 })
        }
        return res.status(code.OK).json({ sucess: true, message: "user update with image sucessfully", newuser: newuser })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "server error" });
    }
}

exports.userdelete = async (req, res) => {
    try {
        const id = req.query.userId;
        if (!id) {
            return res.status(code.NOT_FOUND).json({ sucess: false, message: "userId is required" });
        }
        const deleteuser = await usermodel.findByIdAndDelete(id, { new: true });
        if (!deleteuser) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "user not delete" });
        }
        return res.status(code.OK).json({ sucess: true, status: code.OK, message: "user delete sucessfully", deleteuser: deleteuser });

    } catch (error) {
        return res.status(code.SERVER_ERROR).json({ sucess: false, status: code.SERVER_ERROR, message: "internal server error" })
    }
}

exports.forgatepassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "email is required" });
        }
        const checkmail = await usermodel.findOne({ email }).select("-password");

        if (!checkmail) {
            return res.status(code.NOT_FOUND).json({ sucess: false, status: code.NOT_FOUND, message: "user not found" });
        }
        const OTP = Math.floor(Math.random() * 900000) + 100000;
        console.log(OTP);

        const expire = Date.now() + 5 * 60 * 100;
        await otpModel.deleteMany({ email });

        await otpModel.create({ email, otp: OTP, expire });

        sendmail(
            email,
            "otp valid for 5 minit",
            `otp ${OTP} for password`
        )
        console.log("otp send sucessfully on email");
        return res.status(code.OK).json({ sucess: true, status: code.OK, message: "otp send sucessfully on email" })
    } catch (error) {
        console.log(error);
        return res.status(code.SERVER_ERROR).json({ sucess: false, status: code.SERVER_ERROR, message: "internal server error" })
    }
}

exports.resetpassword = async (req, res) => {
    try {
        const { email, otp, newpassword, confirmpassword } = req.body;
        if (!email) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "email is required" })
        }
        if (!otp) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "otp is required" })
        }
        if (!newpassword) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "newpassword is required" })
        }
        if (!confirmpassword) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "confirmpassword is required" })
        }
        if (password !== confirmpassword) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "password and confirmpassword are not same" })
        }
        const cheakmail = await usermodel.findOne({ email }).select("-password");
        if (!cheakmail) {
            return res.status(code.NOT_FOUND).json({ sucess: false, status: code.NOT_FOUND, message: "user not found" })
        }
        const otpdata = await otpModel.findOne({ email });
        if (!otpdata) {
            return res.status(code.NOT_FOUND).json({ sucess: false, status: code.NOT_FOUND, message: "email not found" })
        }
        if (otpdata.otp !== otp) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "INVALID OTP" })
        }
        if (otpdata.expire < new Date()) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "OTP EXPIRE" })
        }
        const hashedpass = await bcrypt.hash(password, 10);
        const updatepass = await usermodel.findByIdAndUpdate({ email }, { password: hashedpass }, { new: true });
        if (!updatepass) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "new password not set" })
        }
        return res.status(code.OK).json({ sucess: false, status: code.OK, message: "new password set sucessfully" })
    } catch (error) {
        console.log(error);
        return res.status(code.SERVER_ERROR).json({ sucess: false, status: code.SERVER_ERROR, message: "internal server error" })
    }
}


exports.deletemessage = async (req, res) => {
    try {
        const id = req.query.messageId;
        console.log(id);
        
        const messagedata = await messagemodel.findById(id);
        if (!messagedata) {
            return res.status(code.NOT_FOUND).json({ sucess: false, status: code.NOT_FOUND, message: "message not found" })
        }
        if (messagedata.fileUrl) {
            const oldimgpath = path.join(__dirname, '..', messagedata.fileUrl);
            fs.unlinkSync(oldimgpath);
        }
        const deletemessge = await messagemodel.findByIdAndDelete(id, { new: true });
        if(!deletemessge){
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "message not delete" });
        }
        req.io?.emit("messageDeleted", { messageId: id });
        return res.status(code.OK).json({ sucess: true, status: code.OK, message: "message delete sucessfully", deletemessge:deletemessge });
    }
    catch (error) {
        console.log(error);
        return res.status(code.SERVER_ERROR).json({ sucess: false, status: code.SERVER_ERROR, message: "internal server error" })
    }
}