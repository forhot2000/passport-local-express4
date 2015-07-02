/**
 * start mongodb on c9.io
 * https://docs.c9.io/v1.0/docs/setting-up-mongodb
 * 
 * $ mkdir data
 * $ echo 'mongod --bind_ip=$IP --dbpath=data --nojournal --rest "$@"' > mongod
 * $ chmod a+x mongod
 */

var config = {
  host: "127.0.0.1"  
};

exports.connectString = "mongodb://" + config.host + "/passport_local_mongoose_express4";
