const http = require('http');
const express = require('express');
const socket_io = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socket_io(server);
const clients = {};

io.of("/calling").on("connection", (soc) => {
    const client = clients[soc.id] = {};
    client.id = soc.id;
    client.soc = soc;
    client.calling = false;
    client.Duo = {};

    soc.on("User_Connected", (client_name)=>{
        
        client.nom = client_name;

        console.log(`${client_name} is connected`);
        
        
        soc.emit("Success", soc.id, "You are successfully connected Buddy");

        if(Object.keys(clients).length > 1){
            for(x in clients){
                if(Object.keys(clients[x]).includes("nom") && clients[x].id != soc.id){
                    clients[x].soc.emit("new_Client", clients[soc.id].id ,clients[soc.id].nom);
                    soc.timeout(500).emit("new_Client", clients[x].id ,clients[x].nom);
                    console.log("soc.id = " + clients[soc.id].nom);
                    console.log("x = " + clients[x].nom);
                }
            };
        };
        
    });

    // --------------------> Call 

    soc.on("calling", (client_id) => {
        if(!clients[client_id].calling){
            
            clients[client_id].soc.emit("calling", soc.id);

        }else{
            soc.emit("Already called", client_id);
            clients[client_id].soc.emit("Occupied", soc.id);
        }
    });
    

    soc.on("call_OK", (client_id) => {
        clients[client_id].soc.emit("call_OK", soc.id);
        clients[client_id].calling = true;
        clients[soc.id].calling = true;
        
        client.Duo.a = soc.id;
        client.Duo.b = client_id;
    });

    soc.on("refuse_call", (client_id) => {
        clients[client_id].soc.emit("refuse_call", soc.id);
    });

    soc.on("hang_OutGone", (client_id) => {
        clients[client_id].soc.emit("hang_OutGone", soc.id);

        clients[client_id].calling = false;
        clients[soc.id].calling = false;

        delete client.Duo.a;
        delete client.Duo.b;
    });

    soc.on("hang_OutGoing", (client_id) => {
        clients[client_id].soc.emit("hang_OutGoing", soc.id);
    });

    soc.on("hang_InCame", (client_id) => {
        clients[client_id].soc.emit("hang_InCame", soc.id);
        
        clients[client_id].calling = false;
        clients[soc.id].calling = false;
        
        delete client.Duo.a;
        delete client.Duo.b;
    });

    // --------------------> RTC connection Management 

    soc.on("offer",(offer, client_id)=>{
        clients[client_id].soc.timeout(500).emit("offer",offer);
    });

    soc.on("answer",(answer, client_id)=>{
        clients[client_id].soc.timeout(500).emit("answer", answer);
    });
    
    soc.on("ice-candidate",(candidate, client_id)=>{
        clients[client_id].soc.timeout(500).emit("ice-candidate", candidate);
    });

    // ----------------------------------------------------------->

    // -----------------------> Disconnection Management
    soc.on("disconnect", async ()=>{

        if(Object.keys(clients).length > 0){
            for(x in clients){
                if(Object.keys(clients[x]).includes("nom") && clients[x].id != soc.id){
                    clients[x].soc.emit("Client_Disconnected", soc.id);
                };
            };
        };
        console.log(`${clients[soc.id].nom} disconnected`);
        
        for(x in clients.duo){
            if(clients.duo[x] == soc.io){
                clients[clients.duo["a"]].calling = false;
                clients[clients.duo["b"]].calling = false;

                console.log(`${clients[clients.duo["a"]].nom} calling_Stat = ${clients[clients.duo["a"]].calling}`)
                console.log(`${clients[clients.duo["b"]].nom} calling_Stat = ${clients[clients.duo["b"]].calling}`)
            }
        }

        delete clients[soc.id];
    });

});

server.listen(8080,"localhost",()=>{
    console.log("Serveur Connecter et a l'ecoute");
});
