module.exports = function socket(io){
//var promise      = require("bluebird");
//var python = require('python-shell');    
//var qr_decode = function(data){
//    return new promise(function(resolve,reject){
//        var options = {
//          mode: 'text',
//          //pythonPath: 'path/to/python',
//          //pythonOptions: ['-u'],
//          //scriptPath: 'path/to/my/scripts',
//          args: [data]
//        };
//
//        python.run('qr.py', options, function (err, results) {
//          if (err) throw err;
//            resolve(results);        
//          console.log('results: %j', results);
//        if (users['55becc235e6caea69358e153']){
//            users['55becc235e6caea69358e153'].emit('qr_response',results) 
//            console.log('QR DECODED');     
//            
//        } 
//        });    
//    });  
//}


    
    
    
    
    
    
    
var users = {};    
var geo = io
  .of('/geo')
  .on('connection', function (socket) {
    socket.on('cli_con',function(data,callback){
        var user = JSON.parse(JSON.stringify(data));
        var username = user.username;
        var user_id = user.id;
        console.log('user_id:' + user_id)
        console.log('username:' + username)
        
       if (user_id in users){
           callback(false);
           console.log('User [' + user_id + '] is already connected');
           return;
       }else{
           callback(true);
           socket.user_id = user_id;
           socket.username = username;
           
           users[user_id] = socket;
           console.log('User Connected: ' + username);
           console.log(Object.keys(users));
           //console.log(socket.)
           //updateUsers();
       }
    });
      
    socket.on('disconnect',function(data){
        if(!socket.user_id) return;
        delete users[socket.user_id];
        console.log('User disconnected: '+ socket.user_id);    
        if (socket.user_id != 1000){
            if (users[1000]){
                users[1000].emit('dis',socket.user_id);
            }    
        }    
        //updateUsers();
    }); 
      
    function updateUsers(){
        io.sockets.emit('usernames',Object.keys(users));    
    } 
      
    socket.on('point', function(data){
        var location = JSON.parse(data);
        //console.log (JSON.stringify(data));
        //log_user(location.id,location.id,location.lat,location.lon);
        //var p = JSON.stringify({id:location.id,lat:location.lat,lon:location.lon,acc:location.acc,speed:location.speed});
        var p = data;
        //socket.broadcast.emit('response', p);
        if (users[1000]){
            users[1000].emit('response',p) 
        };        
    });      
    socket.on('sos', function(data,callback){
        if (users[1000]){
            users[1000].emit('sos','Emergencia activada!') 
            console.log(socket.user_id);     
        }       
    }); 
      
    socket.on('pic', function(data,callback){
        if (users[1000]){
            users[1000].emit('pic',data) 
            console.log(data);     
        }       
    });
    
//    socket.on('qrcode', function(data,callback){
//    var data = 'iVBORw0KGgoAAAANSUhEUgAAAMYAAADGAgMAAAD09RfOAAAADFBMVEX///8AAAD///8AAAAIKWj8AAABSUlEQVR4nO2XO47GMAiEaXK/NNz/KqssZhgc76P5KwZFEbH5UozAYDOZ7PPmsNvsWs7j2/O5BwgxY+d53CNyx+3szERqK1RNB59vVghWls6kqpBfkJWTXWoh/6poz1r+K3IiQr3g/FCAkINRp/ghYjrCekYeNjZjts/RyPdx5zmzYTdE5l9xJk9Hspzb2EZh/BaytiApW7IRZiakzHkgsfKX+EI2JD83tbF46B2TERRvpmINvYGg0m8hXefL23GHP0BnISSy4dy7++JJ9uGIYyDBJdTpTRUNG44gvmLuiixnq/3BCMq24dxeadwVEmHIRigZbi0idYV0Q2uoA3C7IAghGauccS/Ibtv6iBB2cBfoJbxJLQS7qF+jJltFLeSFGFVxLWauCjmIzEccXT+3XSFvx2kgaeehkN4skIexXjpfPS1nIzLZJ+0LTqoL8IjhHsMAAAAASUVORK5CYII='    
        
        
//       console.log(data.pic)
//        qr_decode(data).then(function(decoded){
//            console.log(decoded)
//        })
               
   // })
  
      
      
      
    socket.on('pic_response', function(data,callback){
        if (users['55becc235e6caea69358e153']){
            users['55becc235e6caea69358e153'].emit('pic_response',data) 
            console.log('PIC');     
            
        } 
        console.log(data.info)   
        
    });  
      
    
    function sendpic(){
        console.log('SEND PIC')
    }  
      
    
});

};//exports