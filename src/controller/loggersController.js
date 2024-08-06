const loggers = async (req, res) => {
    try {
        req.logger.debug('Este es un mensaje de depuración');
        req.logger.http('Este es un mensaje HTTP');
        req.logger.info('Este es un mensaje de información');
        req.logger.warn('Este es un mensaje de advertencia');
        req.logger.error('Este es un mensaje de error');
        req.logger.fatal('Este es un mensaje fatal');
        res.status(200).json({ 
            status: 'success', 
            message: 'Logs de prueba ejecutados correctamente' 
        });
    } catch (error) {
        req.logger.error(`Error al ejecutar logs de prueba: ${error.message}`);
        res.status(500).json({ 
            status: 'error', 
            error: 'Error al ejecutar logs de prueba' 
        });
    }
};

module.exports = {loggers}