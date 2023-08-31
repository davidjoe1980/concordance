require('dotenv').config()

module.exports = {
    user          : process.env.NODE_ORACLEDB_USERNAME || 'concordance',
    password      : process.env.NODE_ORACLEDB_PASSWORD || 'concordance',
    connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || 'localhost/XE',
};