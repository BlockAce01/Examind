const db = require('../config/db');

//get all resources 
exports.getAllResources = async (req, res, next) => {
    try {
        
        let query = 'SELECT * FROM "Resource" ORDER BY "UploadedDate" DESC'; 

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

//get single resource
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

//create new resource
exports.createResource = async (req, res, next) => {
    
    const { title, type, subject, year, fileURL, description } = req.body;

    //basic validation
    if (!title || !type || !subject || !fileURL) {
        return res.status(400).json({ message: 'Missing required fields: title, type, subject, fileURL' });
    }

    try {
        
        const query = `
            INSERT INTO "Resource" ("Title", "Type", "Subject", "Year", "FileURL", "Description", "UploadedDate")
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING *;
        `;
        const values = [title, type, subject, year || null, fileURL, description || null]; //Using null for optional fields

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

//update resource
exports.updateResource = async (req, res, next) => {
    const { id } = req.params;
    const { title, type, subject, year, fileURL, description } = req.body;

    //basic validation
    if (!title && !type && !subject && !year && !fileURL && !description) {
         return res.status(400).json({ message: 'No update data provided.' });
    }

    try {
                 const query = `
            UPDATE "Resource"
            SET "Title" = $1, "Type" = $2, "Subject" = $3, "Year" = $4, "FileURL" = $5, "Description" = $6
            WHERE "ResourceID" = $7
            RETURNING *;
        `;
         
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

//delete resource
exports.deleteResource = async (req, res, next) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM "Resource" WHERE "ResourceID" = $1 RETURNING *;'; 
        const { rows } = await db.query(query, [id]);

        if (rows.length === 0) {
             return res.status(404).json({ message: 'Resource not found' });
        }

        res.status(204).json({
        //for successful deletion
            status: 'success',
            data: null, 
        });
    } catch (err) {
        console.error(`Error deleting resource ${id}:`, err);
        next(err);
    }
};
