//bug - users plural pero en server.js singular
module.exports = function(app,promise,redis_client,Place,Users){
app.get('/migrate', function(req,res){
var places = [];
var users = [];


    
redis_client.flushall();

Place.find({}, function(err, places) {
places.forEach(function(place) {
    var oPlace = JSON.parse(JSON.stringify(place));
    JSON.stringify(oPlace).replace(/null/i, "\"\""); 
    var o  = {
        id:oPlace._id,
        google_id:oPlace.place_id,
        type:oPlace.place_type,
        name:oPlace.place_name,
        address:oPlace.place_address,
        phone:oPlace.place_phone,
        lat:oPlace.coordinates[0],
        lon:oPlace.coordinates[1]
    };
    //console.log(o)
    
    //GEO-DATA - //LON - //LAT
    //redis_client.geoadd('places',o.lon,o.lat,'p:'+ o.id,function(error,reply){
    //
    //});
    
    redis_client.geoadd('p:'+ o.type,o.lon,o.lat,'p:'+ o.id,function(error,reply){
        
    });
    
    
    
    
    //PLACE-DATA
    var phone = function(phone){
        if (phone === null){
            //console.log('NULL');
            return '-';    
        }else{
            return phone;
        }
    };
    redis_client.hmset(
        'p:'+ o.id,
        'id', o.id,
        'google_id',o.id,
        'type',o.type,
        'name',o.name,
        'address',o.address,
        'phone',phone(o.phone),
        'lat',o.lat,
        'lon',o.lon
    ,function(error,reply){
        
    });
    //PLACE-TYPE
    redis_client.sadd('place:type',o.type);
});//FOREACH
})
    
Users.find({}, function(error, data) {
var users = JSON.parse(JSON.stringify(data))    
users.forEach(function(user) {
    
    ///console.log(user.username)
    redis_client.hmset(
        'user:'+user.username,
        'id',user._id,
        'username',user.username,
        'password',user.password,
        'firstname',user.firstname,
        'lastname',user.lastname,
        'is_admin',user.is_admin
    ,function(error,reply){
       //console.log(reply) 
    });
});
});

    
    //redis_client.hgetall('user:acanessa', function (err, obj) {
    //    console.dir(obj);
    //});
    
res.send('Migrado!')
    
});    
}