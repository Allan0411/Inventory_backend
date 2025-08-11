const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');

class ProductModel {
    tableName = 'product';

    // Find all products (with category info)
    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName} `;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params, 'AND');
        sql += ` WHERE ${columnSet}`;
        return await query(sql, [...values]);
    }

    // Find one product
    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params, 'AND');
        const sql = `SELECT * FROM ${this.tableName} WHERE ${columnSet}`;
        const result = await query(sql, [...values]);
        return result[0];
    }

    // Create a new product
    create = async ({
        name,
        category_id,
        description,
        price,
        life_time,
        additional_details = null, // should be an object or JSON
        is_clearance = false,
        product_id
    }) => {
        const sql = `INSERT INTO ${this.tableName} (product_id,name, category_id, description, price, life_time, additional_details, is_clearance) VALUES (?, ?, ?, ?, ?, ?,?, ?)`;
        const result = await query(sql, [product_id,
            name, category_id, description, price, life_time,
            additional_details ? JSON.stringify(additional_details) : null,
            is_clearance
        ]);
        return result ? result.affectedRows : 0;
    }

    // Update product
    update = async (params, product_id) => {
        // If additional_details is present, ensure it's stringified before updating
        if (params.hasOwnProperty('additional_details')) {
            params.additional_details = params.additional_details !== null && params.additional_details !== undefined
                ? JSON.stringify(params.additional_details)
                : null;
        }
        const { columnSet, values } = multipleColumnSet(params, ', ');
        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE product_id = ?`;
        const result = await query(sql, [...values, product_id]);
        return result;
    }

    // Delete product
    delete = async (id) => {
        const sql = `DELETE FROM ${this.tableName} WHERE product_id = ?`;
        const result = await query(sql, [id]);
        return result ? result.affectedRows : 0;
    }

    // Update only the is_clearance flag for a product
    /**
     * Set is_clearance to true for all products whose life_time (in days) has expired
     * (i.e., current_date - creation_date >= life_time).
     * If product_id is specified, only update that product.
     * Otherwise, update all eligible products.
     */
    updateIsClearance = async (product_id = null) => {
        let sql, values;
        if (product_id) {
            sql = `
                UPDATE ${this.tableName}
                SET is_clearance = 1
                WHERE product_id = ?
                  AND DATEDIFF(CURDATE(), creation_date) >= life_time
            `;
            values = [product_id];
        } else {
            sql = `
                UPDATE ${this.tableName}
                SET is_clearance = 1
                WHERE DATEDIFF(CURDATE(), creation_date) >= life_time
            `;
            values = [];
        }
        const result = await query(sql, values);
        return result ? result.affectedRows : 0;
    }
}


module.exports = new ProductModel();
