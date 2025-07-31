const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');

class ProductModel {
    tableName = 'product';

    find = async (params = {}) => {
        let sql = `SELECT p.*, c.name as category_name, c.description as category_description, c.is_clearance
                   FROM ${this.tableName} p
                   JOIN category c ON p.category_id = c.category_id`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params);
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params);

        const sql = `SELECT p.*, c.name as category_name
                     FROM ${this.tableName} p
                     JOIN category c ON p.category_id = c.category_id
                     WHERE ${columnSet}`;

        const result = await query(sql, [...values]);
        return result[0];
    }

    create = async ({ name, category_id, description, price, life_time }) => {
        const sql = `INSERT INTO ${this.tableName}
                     (name, category_id, description, price, life_time) 
                     VALUES (?, ?, ?, ?, ?)`;

        const result = await query(sql, [name, category_id, description, price, life_time]);
        return result ? result.affectedRows : 0;
    }

    update = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params);

        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE product_id = ?`;

        const result = await query(sql, [...values, id]);
        return result;
    }

    delete = async (id) => {
        const sql = `DELETE FROM ${this.tableName} WHERE product_id = ?`;
        const result = await query(sql, [id]);
        return result ? result.affectedRows : 0;
    }
}

module.exports = new ProductModel;
