const query=require('../db/db-connection.js');
const {multipleColumnSet}=require('../utils/common.utils');

class StockMovementModel{
    tableName='stockmovement';

    
    //find
    find=async (params={})=>{
        let sql=`SELECT * FROM ${this.tableName}`;
        if (!Object.keys(params).length){
            return await query(sql);
        }

        const {columnSet,values}=multipleColumnSet(params,' AND ');
        sql+=` Where ${columnSet}`;

        return await query(sql,values);
       
    }

    

    //create
    create = async ({
        id,
        product_id,
        region_id,
        user_id,
        change_in_stock,
        type,
        note
      }) => {
        const sql = `
          INSERT INTO ${this.tableName}
          (id, product_id, region_id, user_id, change_in_stock, type, note)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
    
        const result = await query(sql, [
          id,
          product_id,
          region_id,
          user_id,
          change_in_stock,
          type,
          note
        ]);
    
        return result ? result.affectedRows : 0;
      };

}



module.exports= new StockMovementModel();