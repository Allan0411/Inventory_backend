const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');

class BarcodeModel {
    tableName = 'barcode';

    // Get all or filter
    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;
        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params);
        sql += ` WHERE ${columnSet}`;
        return await query(sql, [...values]);
    };

    // Get one barcode
    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params);
        const sql = `SELECT * FROM ${this.tableName} WHERE ${columnSet}`;
        const result = await query(sql, [...values]);
        return result[0];
    };

    // Create barcode
    create = async ({ barcode, product_id }) => {
        const sql = `INSERT INTO ${this.tableName} (barcode, product_id) VALUES (?, ?)`;
        const result = await query(sql, [barcode, product_id]);
        return result?.affectedRows || 0;
    };

    // Update barcode entry
    update = async (params, barcode) => {
        const { columnSet, values } = multipleColumnSet(params);
        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE barcode = ?`;
        const result = await query(sql, [...values, barcode]);
        return result;
    };

    // Delete barcode entry
    delete = async (barcode) => {
        const sql = `DELETE FROM ${this.tableName} WHERE barcode = ?`;
        const result = await query(sql, [barcode]);
        return result?.affectedRows || 0;
    };
}

module.exports = new BarcodeModel();
