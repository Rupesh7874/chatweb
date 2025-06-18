const usermodel = require('../models/usermodel');
const bcrypt = require('bcrypt');
const code = require('../utils/statuscodemessage');
const { isvalidemail, validpassword } = require('../confige/validation');
const jwt = require('jsonwebtoken');
const Group = require('../models/groupmodel');
const group = require('../models/groupmodel');

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
                return res.status(400).json({ msg: "user not create with image", status: 0 })
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
                return res.status(400).json({ msg: "user not ragister", status: 0 })
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
        const cheakmail = await usermodel.findOne({ email: email });

        if (!cheakmail) {
            return res.status(code.NOT_FOUND).json({ sucess: false, status: code.NOT_FOUND, message: "user not found" })
        }
        const cheackpass = await bcrypt.compare(password, cheakmail.password);
        if (!cheackpass) {
            return res.status(code.BAD_REQUEST).json({ sucess: false, status: code.BAD_REQUEST, message: "password is not valid" })
        }
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
        res.status(500).json({ message: "Failed to approve join request", error: err.message });
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
        const currentUserId = req.query.userId; // passed from frontend
        const users = await usermodel.find({ _id: { $ne: currentUserId } });
        console.log(users);
        
        res.status(200).json(users);
    }
    catch (error) {
        console.log(err);
        res.status(500).json({ message: "Failed viewalluser", error: err.message });
    }
}