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

    create = async ({ category_id,name, description }) => {
        const sql = `INSERT INTO ${this.tableName} (category_id,name, description) VALUES (?,?, ?)`;
        const result = await query(sql, [,category_id,name, description]);
        return result ? result.affectedRows : 0;
    }

    delete = async (id) => {
        const sql = `DELETE FROM ${this.tableName} WHERE category_id = ?`;
        const result = await query(sql, [id]);
        return result ? result.affectedRows : 0;
    }
}

module.exports = new CategoryModel;
