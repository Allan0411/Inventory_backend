const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');

class CategoryModel {
    tableName = 'category';

    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;
        if (!Object.keys(params).length) {
            return await query(sql);
        }
        const { columnSet, values } = multipleColumnSet(params, 'AND');
        sql += ` WHERE ${columnSet}`;
        return await query(sql, [...values]);
    }

    create = async ({ category_id, name, description }) => {
        const sql = `INSERT INTO ${this.tableName} (category_id, name, description) VALUES (?, ?, ?)`;
        const result = await query(sql, [category_id, name, description]);
        return result ? result.affectedRows : 0;
    }

    update = async (params, category_id) => {
        const { columnSet, values } = multipleColumnSet(params, ', ');
        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE category_id = ?`;
        const result = await query(sql, [...values, category_id]);
        return result;
    }

    delete = async (id) => {
        const sql = `DELETE FROM ${this.tableName} WHERE category_id = ?`;
        const result = await query(sql, [id]);
        return result ? result.affectedRows : 0;
    }

    update = async ({ name, description }, category_id) => {
        // Build fields and values arrays dynamically
        const fields = [];
        const values = [];
    
        if (name !== undefined) {
            fields.push('name = ?');
            values.push(name);
        }
        if (description !== undefined) {
            fields.push('description = ?');
            values.push(description);
        }
    
        // Guard: if nothing to update, don't run a broken SQL
        if (!fields.length) {
            throw new Error('No fields to update');
        }
    
        const sql = `UPDATE ${this.tableName} SET ${fields.join(', ')} WHERE category_id = ?`;
        values.push(category_id);
    
        const result = await query(sql, values);
        return result ? result.affectedRows : 0;
    };
    
}

module.exports = new CategoryModel();
