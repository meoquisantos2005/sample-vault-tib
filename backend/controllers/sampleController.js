/**
* Project     : Sample Vault
* Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
* License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
* Date        : Marzo 2026
*/

const fileHelper = require('../utils/fileHelper');
const sampleRepo = require('../repositories/sampleRepo');

class SampleController 
{
    // =========================
    // UPLOAD SAMPLE
    // =========================
    async uploadSample(req, res) 
    {
        try
        {
            if (!req.file)
            {
                return res.status(400).json({ message: "No se subió ningún archivo." });
            }

            const { display_name, category, bpm } = req.body;

            if (!display_name || !category)
            {
                fileHelper.deleteFile(`/uploads/${req.file.filename}`);
                return res.status(400).json({ message: "Nombre y categoría son obligatorios." });
            }

            const userId = req.userId;
            const filename = req.file.filename;
            const filePath = `/uploads/${filename}`;

            const insertId = await sampleRepo.create({
                user_id: userId,
                filename,
                display_name,
                category,
                bpm: parseInt(bpm) || 0,
                file_path: filePath
            });

            // ⭐ IMPORTANTE: devolvemos el sample completo
            res.status(201).json({
                message: "Sample cargado exitosamente.",
                sample: {
                    id: insertId,
                    display_name,
                    category,
                    bpm: parseInt(bpm) || 0,
                    file_path: filePath
                }
            });
        }
        catch (error)
        {
            if (req.file) {
                fileHelper.deleteFile(`/uploads/${req.file.filename}`);
            }

            res.status(500).json({
                message: "Error durante la carga del sample.",
                error: error.message
            });
        }
    }

    // =========================
    // LISTAR SAMPLES
    // =========================
    async getMySamples(req, res)
    {
        try
        {
            const samples = await sampleRepo.findByUserId(req.userId);
            res.json(samples);
        }
        catch (error)
        {
            res.status(500).json({
                message: "Error al recuperar samples.",
                error: error.message
            });
        }
    }

    // =========================
    // DELETE SAMPLE
    // =========================
    async deleteSample(req, res) 
    {
        try 
        {
            const { id } = req.params;
            const userId = req.userId;

            const sample = await sampleRepo.findById(id, userId);

            if (!sample) {
                return res.status(404).json({
                    message: "Sample no encontrado o sin permisos."
                });
            }

            await sampleRepo.delete(id, userId);

            fileHelper.deleteFile(sample.file_path);

            res.json({
                message: "Sample eliminado correctamente."
            });
        }
        catch (error)
        {
            res.status(500).json({
                message: "Error al eliminar sample.",
                error: error.message
            });
        }
    }
}

module.exports = new SampleController();