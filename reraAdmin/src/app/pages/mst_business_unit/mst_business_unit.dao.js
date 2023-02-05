const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');


module.exports.getList = async (data) => {
    try {
        const sql = "SELECT a.id,a.businessunittypeid,b.businessunittypecode,a.businessunittypename" +
            " from mst_business_unit a, mst_business_unit_type b  " +
            " WHERE a.reraid = ? AND b.id = a.businessunittypeid AND a.deleted='0'";
        const [result] = await readConn.query(sql, [data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.businesstypelist = async (data) => {
    try {
        const sql = "SELECT id,businessunittypecode FROM mst_business_unit_type"+
            " WHERE reraid = ? AND deleted='0'";
        const [result] = await readConn.query(sql, [data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.add = async (data) => {
    try {
        // let i = 0;
        // for (const obj of data.fieldList) {
        const sql = "INSERT INTO mst_business_unit (businessunittypeid,businessunittypename, reraid)" +
            " values (?,?,?)";

        data.businessunittypeid = data.businessunittypeid == 0 ? null : data.businessunittypeid;
        data.businessunittypename = data.businessunittypename == '' ? null : data.businessunittypename;
        const [result] = await writeConn.query(sql,
            [data.businessunittypeid, data.businessunittypename, data.reraid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.check = async (data) => {
    try {
        // let where = '';
        // if (data.id !== 0) {
        //     where += " AND id != " + data.id;
        // }
        const sql = "SELECT id  from mst_business_unit where deleted='0' AND reraid = ? AND businessunittypeid = ? AND businessunittypename = ? ";
        const [result] = await  readConn.query(sql,[data.reraid,data.businessunittypeid,data.businessunittypename ]);
        util.createLog(result.length);
        return result.length > 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
    
}

module.exports.update = async (data) => {
    try {
        util.createLog(data);
        const sql = "UPDATE mst_business_unit SET businessunittypeid = ?,businessunittypename = ?  WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.businessunittypeid, data.businessunittypename, data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.delete = async (data) => {
    try {
        const sql = "UPDATE mst_business_unit SET deleted = '1' WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}