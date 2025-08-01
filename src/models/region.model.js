const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');

class RegionModel {
    tableName = 'region';

    // Get all or filter
    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;
        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params,'AND');
        sql += ` WHERE ${columnSet}`;
        return await query(sql, [...values]);
    };

    // Get one region
    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params);
        const sql = `SELECT * FROM ${this.tableName} WHERE ${columnSet}`;
        const result = await query(sql, [...values]);
        return result[0];
    };

    // Add region
    create = async ({ region_id, name, location, capacity }) => {
        const sql = `INSERT INTO ${this.tableName}
        (region_id, name, location, capacity)
        VALUES (?, ?, ?, ?)`;
        const result = await query(sql, [region_id, name, location, capacity]);
        return result?.affectedRows || 0;
    };

    // Update region
    update = async (params, region_id) => {
        const { columnSet, values } = multipleColumnSet(params,' , ');
        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE region_id = ?`;
        const result = await query(sql, [...values, region_id]);
        return result;
    };

    // Delete region
    delete = async (region_id) => {
        const sql = `DELETE FROM ${this.tableName} WHERE region_id = ?`;
        const result = await query(sql, [region_id]);
        return result?.affectedRows || 0;
    };
}

module.exports = new RegionModel();
