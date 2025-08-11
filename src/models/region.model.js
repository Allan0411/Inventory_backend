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

    //analytics
    getRegionCapacityUtilization = async () => {
        const sql = `
            SELECT
                r.region_id,
                r.name,
                r.capacity,
                COALESCE(SUM(cs.quantity), 0) AS total_stock,
                ROUND(100 * COALESCE(SUM(cs.quantity), 0) / r.capacity, 2) AS utilization_percent
            FROM region r
            LEFT JOIN current_stock cs ON cs.region_id = r.region_id
            GROUP BY r.region_id, r.name, r.capacity
            ORDER BY utilization_percent DESC
        `;
        return await query(sql);
    };
    
    getRegionMovementSummary = async () => {
        const sql = `
            SELECT
                r.region_id,
                r.name,
                COUNT(sm.id) AS transaction_count,
                SUM(sm.change_in_stock > 0) AS inbound_count,
                SUM(sm.change_in_stock < 0) AS outbound_count
            FROM region r
            LEFT JOIN stockmovement sm ON sm.region_id = r.region_id
            GROUP BY r.region_id, r.name
            ORDER BY transaction_count DESC
        `;
        return await query(sql);
    };
    
    
}

module.exports = new RegionModel();
