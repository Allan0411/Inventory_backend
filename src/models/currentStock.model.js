const query=require('../db/db-connection');
const {multipleColumnSet}=require('../utils/common.utils');

class CurrentStockModel{
    tableName='current_stock';

    //find 
    find=async (params={})=>{
        let sql=`SELECT * FROM ${this.tableName}`;

        if(!Object.keys(params).length){
            return await query(sql);
        }

        const {columnSet,values}=multipleColumnSet(params,'AND');

        sql+=` WHERE ${columnSet}`;

        return await query(sql,values);

    };

    //find one
    findOne=async(params)=>{
        const {columnSet,values}=multipleColumnSet(params,'AND');

        const sql=`SELECT * FROM ${this.tableName} WHERE ${columnSet} LIMIT 1`;

        const result = await query(sql,values);
        return result;
    };

    //create

    create = async ({
        product_id,
        region_id,
        quantity
    }) => {
        const sql = `INSERT INTO ${this.tableName} (product_id, region_id, quantity) VALUES (?, ?, ?)`;
        const result = await query(sql, [product_id, region_id, quantity]);
        console.log("affected rows:", result?.affectedRows);
        return result ? result.affectedRows : 0;
    };

    //update
    update = async (params, product_id, region_id) => {
        const { columnSet, values } = multipleColumnSet(params,' , ');

        // There is a typo in the original SQL: "region id" should be "region_id"
        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE product_id = ? AND region_id = ?`;

        const result = await query(sql, [...values, product_id, region_id]);
        console.log(result.affectedRows);
        return result ? { affectedRows: result.affectedRows, changedRows: result.changedRows } : { affectedRows: 0, changedRows: 0 };
    };
    //delete
    
    delete=async(product_id,region_id)=>{

        const sql=`DELETE FROM ${this.tableName} WHERE product_id=? and region_id=?`;
        const result= await query(sql,[product_id,region_id]);
        return result?result.affectedRows:0;
    };

    findLowStock = async (threshold = 10) => {
        const sql = `SELECT * FROM ${this.tableName} WHERE quantity < ?`;
        const result = await query(sql, [threshold]);
        return result;
      }

    getRegionCapacityInUse= async(region_id)=>{

        const sql=`SELECT IFNULL(SUM(quantity),0) AS capacity_in_use FROM Current_Stock WHERE region_id=?`;
        const result = await query(sql,[region_id]);

        return result[0].capacity_in_use;
    };


    //analytics
    getTotalStockValue = async () => {
        const sql = `
            SELECT
                SUM(cs.quantity * p.price) AS total_value
            FROM current_stock cs
            JOIN product p ON p.product_id = cs.product_id
        `;
        const result = await query(sql);
        return result[0]?.total_value || 0;
    };
    
    

};


module.exports=new CurrentStockModel();