// backend/controllers/resourceController.js
const db = require('../config/db');

// Get All Resources (with potential filtering)
exports.getAllResources = async (req, res, next) => {
    try {
        // Basic query - adjust column names if needed
        let query = 'SELECT * FROM "Resource" ORDER BY "UploadedDate" DESC'; // Assuming UploadedDate column exists
        // TODO: Add filtering based on req.query (e.g., ?subject=Physics&type=Notes) later

        const { rows } = await db.query(query);
        res.status(200).json({
            status: 'success',
            results: rows.length,
            data: {
                resources: rows,
            },
        });
    } catch (err) {
        console.error('Error fetching resources:', err);
        next(err);
    }
};

// Get Single Resource by ID
exports.getResourceById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM "Resource" WHERE "ResourceID" = $1';
        const { rows } = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                resource: rows[0],
            },
        });
    } catch (err) {
        console.error(`Error fetching resource ${id}:`, err);
        next(err);
    }
};

// Create New Resource
exports.createResource = async (req, res, next) => {
    // Ensure column names match your schema
    const { title, type, subject, year, fileURL, description } = req.body;

    // Basic validation
    if (!title || !type || !subject || !fileURL) {
        return res.status(400).json({ message: 'Missing required fields: title, type, subject, fileURL' });
    }

    try {
        // Assuming UploadedDate defaults to NOW() or is handled by DB trigger
        // Or set it here: const uploadedDate = new Date();
        const query = `
            INSERT INTO "Resource" ("Title", "Type", "Subject", "Year", "FileURL", "Description", "UploadedDate")
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING *;
        `;
        const values = [title, type, subject, year || null, fileURL, description || null]; // Use null for optional fields if not provided

        const { rows } = await db.query(query, values);

        res.status(201).json({
            status: 'success',
            data: {
                resource: rows[0],
            },
        });
    } catch (err) {
        console.error('Error creating resource:', err);
        next(err);
    }
};

// Update Resource
exports.updateResource = async (req, res, next) => {
    const { id } = req.params;
    const { title, type, subject, year, fileURL, description } = req.body;

    // Basic validation - Ensure at least something is being updated
    if (!title && !type && !subject && !year && !fileURL && !description) {
         return res.status(400).json({ message: 'No update data provided.' });
    }
    // You might want more specific validation here

    try {
        // Construct SET clause dynamically based on provided fields (more robust)
        // For simplicity here, we assume all editable fields might be sent
        // Ensure we don't try to update the primary key 'ResourceID'
         const query = `
            UPDATE "Resource"
            SET "Title" = $1, "Type" = $2, "Subject" = $3, "Year" = $4, "FileURL" = $5, "Description" = $6
            WHERE "ResourceID" = $7
            RETURNING *;
        `;
         // Fetch current data first to fill in missing values if needed, or handle partial updates
         // For now, we require frontend to send all editable fields or handle nulls carefully
         const values = [title, type, subject, year || null, fileURL, description || null, id];

        const { rows } = await db.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Resource not found or no changes made' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                resource: rows[0],
            },
        });
    } catch (err) {
        console.error(`Error updating resource ${id}:`, err);
        next(err);
    }
};

// Delete Resource
exports.deleteResource = async (req, res, next) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM "Resource" WHERE "ResourceID" = $1 RETURNING *;'; // RETURNING helps confirm deletion
        const { rows } = await db.query(query, [id]);

        if (rows.length === 0) {
             // It might have already been deleted, or never existed
             return res.status(404).json({ message: 'Resource not found' });
        }

        // Send 204 No Content status for successful deletion
        res.status(204).json({
            status: 'success',
            data: null, // No body content for 204
        });
    } catch (err) {
        console.error(`Error deleting resource ${id}:`, err);
        next(err);
    }
};