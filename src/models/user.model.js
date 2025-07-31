const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');

class UserModel {
    tableName = 'user';

    // Get all users or filter by fields
    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;
        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params);
        sql += ` WHERE ${columnSet}`;
        return await query(sql, [...values]);
    };

    // Get one user
    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params);
        const sql = `SELECT * FROM ${this.tableName} WHERE ${columnSet}`;
        const result = await query(sql, [...values]);
        return result[0]; // return first match
    };

    // Create a user
    create = async ({ user_id, name, email, role, contact }) => {
        const sql = `INSERT INTO ${this.tableName}
        (user_id, name, email, role, contact)
        VALUES (?, ?, ?, ?, ?)`;

        const result = await query(sql, [user_id, name, email, role, contact]);
        return result?.affectedRows || 0;
    };

    // Update user by ID
    update = async (params, user_id) => {
        const { columnSet, values } = multipleColumnSet(params);
        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE user_id = ?`;
        const result = await query(sql, [...values, user_id]);
        return result;
    };

    // Delete user by ID
    delete = async (user_id) => {
        const sql = `DELETE FROM ${this.tableName} WHERE user_id = ?`;
        const result = await query(sql, [user_id]);
        return result?.affectedRows || 0;
    };
}

module.exports = new UserModel();
