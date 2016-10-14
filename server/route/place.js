module.exports = function(app,promise,redis_client,jwt){
//LIST PLACES
app.get('/place/detail/:place_id?', function(req,res){
    var get_detail = function(place_id){
        return new promise(function(resolve,reject){
            redis_client.hgetall('p:'+place_id,function(err,place){
                    resolve(place)
            });
        });
    };

    var place_id = req.params.place_id;
    
    get_detail(place_id)
    .then(function(place){
        //console.log(place)
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(place,null,3)); 
    });    
    //};    
}); 

         

    
app.get('/places/:type?/:lon?/:lat?/:range?', function(req,res){
var options = {
    place_type:req.params.type,
    lon:req.params.lon,
    lat:req.params.lat,
//    range:req.params.range,
    range:2000,
    unit:'km',    
};

var get_place_in_range = function(options){    
    return new promise(function(resolve,reject){
        redis_client.georadius(
            'p:'+options.place_type,
            options.lon,
            options.lat,
            options.range,
            options.unit,
            function(err,places_id){
                resolve({places_id:places_id,place_type:options.place_type})
                //console.log('get_place_in_range',places_id)
            });
    });    
};    
    
   

var get_place_information = function(place_id){    
    return new promise(function(resolve,reject){
        redis_client.hgetall(place_id,function(err,info){
            resolve(info);            
        });    
    })
};

var proc = function(params){
    var places_id = params.places_id;    
    var places = []
    //console.log('proc_places',places_id)
                
    return new promise(function(resolve,reject){
        if (places_id.length == 0){
            //console.log('no places to join')
            resolve (places);
        }
        places_id.forEach(function(place_id){
            get_place_information(place_id)
            .then(function(place_info){
                places.push(place_info)                
                resolve(places)
                //console.log('proc_places')
                
            })
        });
        
    })
};


        get_place_in_range(options)
        .then(function(places_id){
            proc(places_id)
            .then(function(places){
                console.log('return', places)
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(places,null,3));
                //res.send(places);
            })
//            .catch(function(err){
//                console.log('NO PLACES')
//                console.log(err)
//                res.setHeader('Content-Type', 'application/json');
//                res.send(JSON.stringify(err));
//            });
        })


});


    
app.get('/place/type', function(req,res){
var place_types = [];

var get_types = function(){
    return new promise(function(resolve,reject){
        redis_client.smembers('place:type',function(err,types){
            types.forEach(function(type){
                //console.log(type)
                place_types.push(get_translation(type));
                resolve(place_types)
            });
        });    
    });
};

    
  
get_types()
.then(function(result){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(result,null,1));
})    
    
    
    
    
    
    
var get_translation = function(type_id){
    switch (type_id){
        case 'book_store':
            return {type_id:type_id,trans:'Book store'};
            break;
        case 'health':
            return {type_id:type_id,trans:'Health center / hospital'};
            break;
        case 'meal_delivery':
            return {type_id:type_id,trans:'Meal delivery'};
            break;
        case 'convenience_store':
            return {type_id:type_id,trans:'Convenience store'};
            break;
        case 'food':
            return {type_id:type_id,trans:'Food / Restaurant'};
            break;
        case 'clothing_store':
            return {type_id:type_id,trans:'Clothing store'};
            break;
        case 'police':
            return {type_id:type_id,trans:'Police station'};
            break;
        case 'liquor_store':
            return {type_id:type_id,trans:'liquor store'};
            break;
        case 'univesity':
            return {type_id:type_id,trans:'univesity'};
            break;
        //case 'parada_colectivo':
        //    return {type_id:type_id,trans:'Paradade colectivo'};
        //    break;
        case 'gym':
            return {type_id:type_id,trans:'Gym'};
            break;
        case 'bakery':
            return {type_id:type_id,trans:'bakery'};
            break;
        case 'park':
            return {type_id:type_id,trans:'Park'};
            break;
        case 'church':
            return {type_id:type_id,trans:'Church'};
            break;
        case 'physiotherapist':
            return {type_id:type_id,trans:'Physiotherapist'};
            break;
        case 'cafe':
            return {type_id:type_id,trans:'Cafe store'};
            break;
        case 'varios':
            return {type_id:type_id,trans:'Miselaneous'};
            break;
        case 'beauty_salon':
            return {type_id:type_id,trans:'Beauty salon'};
            break;
        case 'post_office':
            return {type_id:type_id,trans:'Post office'};
            break;
        case 'restaurant':
            return {type_id:type_id,trans:'Restaurant'};
            break;
        case 'movie_theater':
            return {type_id:type_id,trans:'Movie theater'};
            break;
        case 'store':
            return {type_id:type_id,trans:'Store - type not available'};
            break;
        case 'school':
            return {type_id:type_id,trans:'School'};
            break;
        case 'campground':
            return {type_id:type_id,trans:'Campground'};
            break;
        case 'bar':
            return {type_id:type_id,trans:'Bar / Pub'};
            break;
        case 'bank':
            return {type_id:type_id,trans:'Bank'};
            break;
        case 'zoo':
            return {type_id:type_id,trans:'Zoo'};
            break;
        case 'meal_takeaway':
            return {type_id:type_id,trans:'Meal takeaway'};
            break;
        case 'atm':
            return {type_id:type_id,trans:'ATM'};
            break;
        case 'hospital':
            return {type_id:type_id,trans:'Hospital'};
            break;
        case 'night_club':
            return {type_id:type_id,trans:'Night club'};
            break;
        case 'dentist':
            return {type_id:type_id,trans:'Denstist'};
            break;
        case 'shoe_store':
            return {type_id:type_id,trans:'Show store'};
            break;
        default:
            return {type_id:type_id,trans:type_id};
            break;
        }    
        
        
};
  

        //res.setHeader('Content-Type', 'application/json');
        //res.send(JSON.stringify(place,null,3)); 
//res.end();        
    //};    
});    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
};
    