const userModel = require('../dao/models/userModel')
const logger = require('../config/logger')
const UserRepository = require('../services/repository/userRepository')
const UserDTO = require('../services/dto/userDTO')
const sendEmail = require('../config/sendEmail')

class UserController{
    static async updatePremiumStatus(req, res){
        const {uid} = req.params;
        
        try {
            const user = await userModel.findById(uid)

            if (user.role === 'user') {
                const requiredDocuments = ['identification', 'addressProof','accountStatement']
                const userDocuments = user.documents.map(doc => doc.name.split('_')[0])

                const hasAllDocuments = requiredDocuments.every(doc => userDocuments.includes(doc))

                if(hasAllDocuments){
                    return res.status(400).json({message: 'Debe cargar todos los documentos requeridos antes de actualizar su rol a premium'})
                }
            }

            const newRole = user.role === 'user' ? 'premium' : 'user'
            user.role = newRole

            await user.save()
            logger.info(`Se actualizó el rol del usuario ${uid} a ${user.role}`)
            res.status(200).json({message: 'Rol actualizado con éxito' });
        } catch (error) {
            logger.error('Error al actualizar el rol', error)
            res.status(500).json({error: error.message})
        }
    }

    static async uploadsDocuments(req, res){
        try {
            const {uid} = req.params;
            const documents = req.files

            const updateResult = await UserRepository.updateDocuments(uid, documents);

            if (!updateResult.success) {
                return res.status(404).json({message: updateResult.message});
            }
        
            res.status(200).json({message: 'Documentos subidos con éxito'});
        } catch (error) {
            logger.error('Error al subir documentos:', error);
            res.status(500).json({error: 'Error interno'});
        }
    }

    static async getAllUsers(req, res){
        try {
            const user = await userModel.find({}, 'username email role')
            const userDTO = user.map(u => new UserDTO(u.toObject()))
            res.status(200).json(userDTO)
        } catch (error) {
            logger.error('Error al obtener los usuarios', error)
            res.status(500).json({error: 'Error interno'})
        }
    }

    static async deleteInactiveUsers(req, res){
        try {
            const twoDaysAgo = new Date()
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

            const inactiveUsers = await userModel.find({
                $or: [
                    { last_connection: { $exists: true, $lt: twoDaysAgo } },
                    { last_connection: { $exists: false } }
                ]
            })

            if(inactiveUsers.length === 0){
                return res.status(200).json({message: 'No hay usuarios inactivos que eliminar'})
            }

            const emailsToDelete = inactiveUsers.map(u => u.email)
            for(const email of emailsToDelete){
                await sendEmail(email, 'Cuenta inactiva', 'Su cuenta se eliminó por inactividad')
            }
            await userModel.deleteMany({_id: {$in: inactiveUsers.map(u => u._id)}})

            logger.info(`Usuarios eliminados: ${inactiveUsers.length}`)
            res.status(500).json({message: `Se han eliminado ${inactiveUsers.length} usuarios inactivos`})
        } catch (error) {
            logger.error('Error al eliminar los usuarios inactivos', error)
            res.status(500).json({error: 'Error interno'})
        }
    }

    static async updateUserRole(req, res){
        const {uid} = req.params
        const {newRole} = req.body
    
        try {
            const user = await userModel.findById(uid);
    
            if (!user) {
                return res.status(404).send('Usuario no encontrado')
            }
    
            user.role = newRole;
            await user.save();
            logger.info(`Rol del usuario ${uid} actualizado a ${newRole}`);
            res.redirect("/adminusers");
        } catch (error) {
            logger.error('Error al actualizar el rol del usuario', error)
            res.status(500).send('Error interno')
        }
    };
    
    static async deleteUser(req, res){
        const {uid} = req.params
    
        try {
            const user = await userModel.findByIdAndDelete(uid);
            if (!user) {
                return res.status(404).send('Usuario no encontrado')
            }
    
            logger.info(`Usuario ${uid} eliminado`);
            res.redirect("/adminusers");
        } catch (error) {
            logger.error('Error al eliminar el usuario', error)
            res.status(500).send('Error interno')
        }
    }
}

module.exports = UserController