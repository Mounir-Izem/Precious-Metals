import prisma from '../db.js';

const getHealth = (_req, res) => {
    res.status(200).json({'status': 'succes'})
}

const checkHealth = async (_req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`
        res.status(200).json({'status': 'succes'})
    } catch (error) {
        res.status(500).json({'status': 'Internal error'})
    }
}

export {getHealth, checkHealth};