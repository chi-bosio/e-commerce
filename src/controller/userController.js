const UserDao = require('../dao/userDao')
const UserRepository = require('../services/repository/userRepository')
const CustomError = require('../services/errors/customError')
const errorList = require('../services/errors/errorList')

const userDao = new UserDao()

class UserController{
    static addPropUsers = async (req, res) => {
        try {
            const {newProp, value} = req.body

            const users = await userDao.getAllUsers()

            const userWithProp = users.find(user => user.hasOwnProperty(newProp))
            if (userWithProp) {
                return res
                  .status(400)
                  .json({ message: `Propiedad ${newProp} existente` });
            }
        
            users.map(async user => {
                if (!user.hasOwnProperty(newProp)) {
                    user[newProp] = value;
                    await userDao.update(user._id, { [newProp]: value });
                    return user;
                }
            });
        
            res.status(200).json({ message: "Propiedad agregada exitosamente" });
        } catch (error) {
            res
                .status(500)
                .json({ message: "Error interno del servidor", error: error.message });
        }
    };
        
    static updateRole = async (req, res) => {
        const { uid } = req.params;
        const { role } = req.body;
        
        try {
            const user = await userDao.getById(uid);
            if (!user) {
                throw new CustomError({
                    name: "Not Found",
                    cause: "Invalid arguments",
                    message: "Not found",
                    code: ERRORS["NOT FOUND"],
                });
            }
        
            const requiredDocuments = [
                "identification",
                "addressProof",
                "accountStatement",
            ];
            const missingDocuments = requiredDocuments.filter(
                (doc) => !user.documents.some((d) => d.name === doc)
            );
    
            if (missingDocuments.length > 0) {
                return res.status(400).json({
                    message: `Missing required documents: ${missingDocuments.join(", ")}`,
                });
            }
    
            const updatedUser = await userDao.update(uid, { role: role });
            if (!updatedUser) {
                throw new CustomError({
                    name: "Internal server error",
                    cause: "Invalid arguments",
                    message: "Error updating user role",
                    code: ERRORS["INTERNAL SERVER ERROR"],
                });
            }
    
            res.json({ message: "Role updated successfully" });
        } catch (error) {
            throw new CustomError({
                name: "Internal server error",
                cause: "Internal server error",
                message: "unexpected server error",
                code: ERRORS["INTERNAL SERVER ERROR"],
            });
        }
    };
    static uploadsDocuments = async (req, res) => {
        try {
            const uid = req.user.user._id;
            const user = await userDao.getById(uid);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
        
            const files = req.files;
            if (!files || Object.keys(files).length === 0) {
                return res.status(400).json({ message: "No files uploaded." });
            }
        
            let allFiels = [];
            Object.keys(files).forEach((key) => {
                allFiels = allFiels.concat(files[key]);
            });
        
            const existingFileName = user.documents.map((doc) => doc.name);
        
            const newFiles = allFiels.filter(
                (file) => !existingFileName.includes(file.filename)
            );
            if (newFiles.length === 0) {
                return res.status(400).json({
                    message: `Files already exist`,
                });
            }
        
            user.documents = user.documents.concat(
                newFiles.map((file) => ({ name: file.filename, reference: file.path }))
            );
            await userDao.update(uid, { documents: user.documents });
        
            res
                .status(200)
                .json({ message: "Documents uploaded successfully", files });
        } catch (error) {
            res.status(500).json({ error: error.message });
            
        }
    }
}

module.exports = UserController