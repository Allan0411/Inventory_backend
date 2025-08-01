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

        return result?result.affectedRows:0;
    };
    //delete
    
    delete=async(product_id,region_id)=>{

        const sql=`DELETE FROM ${this.tableName} WHERE product_id=? and region_id=?`;
        const result= await query(sql,[product_id,region_id]);
        return result?result.affectedRows:0;
    };



};


module.exports=new CurrentStockModel();