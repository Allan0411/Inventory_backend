const query = require('../db/db-connection.js');
const { multipleColumnSet } = require('../utils/common.utils');

class StockMovementModel {
    tableName = 'stockmovement';

    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;
        if (!Object.keys(params).length) {
            return await query(sql);
        }
        const { columnSet, values } = multipleColumnSet(params, ' AND ');
        sql += ` WHERE ${columnSet}`;
        return await query(sql, values);
    }

    create = async ({
        id,
        product_id,
        region_id,
        user_id,
        change_in_stock,
        type,
        status = 'pending',
        tracking_url = null,
        note
    }) => {
        const sql = `
          INSERT INTO ${this.tableName}
          (id, product_id, region_id, user_id, change_in_stock, type, status, tracking_url, note)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await query(sql, [
            id,
            product_id,
            region_id,
            user_id,
            change_in_stock,
            type,
            status,
            tracking_url,
            note
        ]);
        return result ? result.affectedRows : 0;
    }

    updateStatus = async (id, status) => {
        const sql = `
          UPDATE ${this.tableName}
          SET status = ?
          WHERE id = ?
        `;
        const result = await query(sql, [status, id]);
        return result ? result.affectedRows : 0;
    }

    updateTrackingUrl = async (id, tracking_url) => {
        const sql = `
            UPDATE ${this.tableName}
            SET tracking_url = ?
            WHERE id = ?
        `;
        const result = await query(sql, [tracking_url, id]);
        return result ? result.affectedRows : 0;
    }
}

module.exports = new StockMovementModel();
