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
          SET status = ?, delivery_time = CURRENT_TIMESTAMP
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

getStatusReport = async (params = {}) => {
    // If you want to filter by product, region, etc, use params
    let whereClause = '';
    let values = [];
    if (Object.keys(params).length) {
        const { columnSet, values: vals } = multipleColumnSet(params, ' AND ');
        whereClause = `WHERE ${columnSet}`;
        values = vals;
    }
  
    const sql = `
        SELECT 
            product_id,
            status,
            SUM(CASE WHEN change_in_stock > 0 THEN change_in_stock ELSE 0 END) AS total_in,
            SUM(CASE WHEN change_in_stock < 0 THEN ABS(change_in_stock) ELSE 0 END) AS total_out,
            COUNT(*) AS transactions,
            SUM(COUNT(*)) OVER (PARTITION BY product_id) AS total_transactions
        FROM ${this.tableName}
        ${whereClause}
        GROUP BY product_id, status
        ORDER BY product_id, status
    `;
    return await query(sql, values);
};


getAverageDeliveryTime = async (params = {}) => {
    let whereClause = 'WHERE status = "Delivered" AND delivery_time IS NOT NULL';
    let values = [];
    if (params.product_id) {
        whereClause += ' AND product_id = ?';
        values.push(params.product_id);
    }

    const sql = `
        SELECT 
            product_id,
            AVG(TIMESTAMPDIFF(HOUR, timestamp, delivery_time)) AS avg_delivery_time_hours,
            COUNT(*) AS delivered_count
        FROM ${this.tableName}
        ${whereClause}
        GROUP BY product_id
    `;
    return await query(sql, values);
};

getTotalMovedByProduct = async (params = {}) => {
    let whereClause = '';
    let values = [];
    if (Object.keys(params).length) {
        const { columnSet, values: vals } = multipleColumnSet(params, ' AND ');
        whereClause = `WHERE ${columnSet}`;
        values = vals;
    }
    const sql = `
        SELECT 
            product_id,
            SUM(CASE WHEN change_in_stock > 0 THEN change_in_stock ELSE 0 END) AS total_in,
            SUM(CASE WHEN change_in_stock < 0 THEN ABS(change_in_stock) ELSE 0 END) AS total_out
        FROM ${this.tableName}
        ${whereClause}
        GROUP BY product_id
        ORDER BY product_id
    `;
    return await query(sql, values);
};


getMostActiveRegions = async (limit = 5) => {
    const sql = `
        SELECT 
            region_id,
            COUNT(*) AS movement_count
        FROM ${this.tableName}
        GROUP BY region_id
        ORDER BY movement_count DESC
        LIMIT ?
    `;
    return await query(sql, [limit]);
};

/**
 * Get the top N products with the highest number of delivered movements.
 * Returns: [{ product_id, delivered_count }]
 */
getTopDeliveredProducts = async (limit = 5) => {
    const sql = `
        SELECT 
            product_id,
            COUNT(*) AS delivered_count
        FROM ${this.tableName}
        WHERE status = 'delivered'
        GROUP BY product_id
        ORDER BY delivered_count DESC
        LIMIT ?
    `;
    return await query(sql, [limit]);
};

/**
 * Get monthly movement summary for a given year.
 * Returns: [{ month, total_in, total_out, transactions }]
 */
getMonthlyMovementSummary = async (year) => {
    const sql = `
        SELECT 
            MONTH(timestamp) AS month,
            SUM(CASE WHEN change_in_stock > 0 THEN change_in_stock ELSE 0 END) AS total_in,
            SUM(CASE WHEN change_in_stock < 0 THEN ABS(change_in_stock) ELSE 0 END) AS total_out,
            COUNT(*) AS transactions
        FROM ${this.tableName}
        WHERE YEAR(timestamp) = ?
        GROUP BY month
        ORDER BY month
    `;
    return await query(sql, [year]);
};


}

module.exports = new StockMovementModel();
