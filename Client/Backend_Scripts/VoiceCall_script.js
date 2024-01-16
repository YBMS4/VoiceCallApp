async function connection(your_name){
    const socket = io("http://localhost:8080/calling",{
        transports: ['websocket'],   
    });


    const clients_main = document.querySelector("#Clients"); // Contenair for new clients

    const name_contenaire = document.querySelector("#Me > span");
    
    name_contenaire.innerHTML = your_name;
    
    socket.emit("User_Connected", your_name);

    socket.on("Success", (my_id, message) => {
        User.id = my_id;
        log_msg(message, "lime");
    });

    // -------------------> New Users Connection --------------------------------
    socket.on("new_Client", (client_id, client_name) => {
        
        User[client_id] = {};
        User[client_id].id = client_id;
        User[client_id].nom = client_name;
        log_msg(`<b>${client_name}</b> is connected`, "white");
        
        // Add Clients to the liste
        const div = document.createElement("div");
        div.id = client_id;
        div.translate = "no";

        const div2 = document.createElement("div");
        div2.innerHTML = user_solid_svg;
        
        const span = document.createElement("span");
        span.innerText = client_name;
        span.translate = "no";

        const btn = document.createElement("button");
        btn.innerHTML = phone_svg;

        div.appendChild(div2);
        div.appendChild(span);
        div.appendChild(btn);

        btn.onclick = ()=>{
            calling(socket, client_id)
        }; // Set button to be able to Call anyone 
        
        div.style.scale = 0;
        clients_main.appendChild(div);

        setTimeout(() => {
            div.style.scale = 1;
        }, 100);

    });

    
    // -------------------> On Someone Calling --------------------------------
    
    socket.on("calling", async (client_id)=>{
        
        const Calling_audio = User.calling_audio = new Audio("../song/Farmer.mp3");
        Calling_audio.autoplay = true;
        Calling_audio.volume = 0;
        caller_name.style.color = "lime";
        caller_name.innerText = User[client_id].nom;
        
        timing.innerText = "Incomming Call";
        timing.style.color = "lime";
        
        let i = 0;
        let j = 0;
        let dot = ".";
        let timer = User.timer = setInterval(() => {
            if(i <= 3){
                timing.innerText = "Incomming Call" + dot;
                dot += ".";
                i++; 
            }else{
                timing.innerText = "Incomming Call";
                dot = ".";
                i = 0;
            };

            if(j < 1){
                j += 0.1;
                Calling_audio.volume = j > 0.8 ? 1 : j.toPrecision(1);
                console.log(j);
            }
        }, 500);

        call_box.style.height = "100%";


        //################## Accept the in comming call
        accept_btn_text.innerText = "Pick-Up";
        accept_btn.onclick = () => {

            clearInterval(timer);
            accept_btn_text.innerText = "Picked-Up";

            socket.emit("call_OK", client_id);
            accepte_call(socket, client_id);
            
            Calling_audio.pause();
            delete Calling_audio;
            
            accept_btn.onclick = () => {
                log_msg("Already Calling", "cyan");

            };

            //################### End the InCame call
            
            refuse_btn_text.innerText = "Hang-Up";
            refuse_btn.onclick = () => {
                
                socket.emit("hang_InCame", client_id);
                stop_peer(socket);

                timing.innerText = "Call Ended";
                timing.style.color = "red";

                setTimeout(()=>{
                    call_box.style.height = "0%";
                }, 1000)


                add_history(User[client_id].nom, "in", "ok");
                console.log("hang");
            };
        
        };

        // ################## Refuse the incoming call
        refuse_btn_text.innerText = "Refuse";
        refuse_btn.onclick = () => {
            console.log("hang");
            
            clearInterval(timer);

            socket.emit("refuse_call", client_id);
            refuse_btn_text.innerText = "Refused";

            timing.innerText = "Call refused";
            timing.style.color = "red";

            stop_peer(socket);

            setTimeout(()=>{
                call_box.style.height = "0%";
            }, 1000);
            
            Calling_audio.pause();
            delete Calling_audio;

            add_history(User[client_id].nom, "in", "missed");
        
        };


        //----------------------> Prepare call

        prepare_call(socket, client_id);

    });

    
    // -------------------> On Someone Accepte Call --------------------------------
    socket.on("call_OK", async (client_id) => {
        
        
        clearInterval(User.timer);
        delete User.timer;
        accepte_call(socket, client_id);
        
        accept_btn_text.innerText = "Picked-Up";
        accept_btn.onclick = () => {
            log_msg("Already picked", "lime")
        };

        //################### End the InCame call
            
        refuse_btn_text.innerText = "Hang-Up";
        refuse_btn.onclick = () => {
            
            socket.emit("hang_OutGone", client_id);
            console.log("hang");
            
            timing.innerText = "Call Ended";
            timing.style.color = "red";

            setTimeout(()=>{
                call_box.style.height = "0%";
            }, 1000);

            stop_peer(socket);
            
            add_history(User[client_id].nom, "in", "ok");

        };

    });
    
    
    // -------------------> On Someone Refuse Call --------------------------------
    socket.on("refuse_call", (client_id) => {

        console.log("refuse_call")


        accept_btn.onclick = () => {};
        refuse_btn.onclick = () => {};
        
        timing.innerText = "Call Refused";
        timing.style.color = "red";
        

        setTimeout(()=>{
            call_box.style.height = "0%";
        }, 1000)

        
        clearInterval(User.timer);
        delete User.timer;

        stop_peer(socket);

        add_history(User[client_id].nom, "out", "missed");

    });


    // ------------------> if the call hang the call
    socket.on("hang_OutGone", (client_id) => {

        accept_btn.onclick = () => {};
        refuse_btn.onclick = () => {};
        
        timing.innerText = "Call Ended";
        timing.style.color = "red";

        setTimeout(()=>{
            call_box.style.height = "0%";
        }, 1000);
        
        
        clearInterval(User.interval);
        delete User.timer;
        
        stop_peer(socket);

        add_history(User[client_id].nom, "out", "ok");

        console.log("hang_OutGone"); // Test
    });

    // ------------------> if the call hang the call
    socket.on("hang_InCame", (client_id) => {
        
        console.log("hang_InCame"); // Test

        accept_btn.onclick = () => {};
        refuse_btn.onclick = () => {};
        
        timing.innerText = "Call Ended";
        timing.style.color = "red";

        setTimeout(()=>{
            call_box.style.height = "0%";
        }, 1000)

        stop_peer(socket);

        add_history(User[client_id].nom, "out", "ok");
    });


    socket.on("hang_OutGoing", (client_id) => {
        
        console.log("hang_OutGoing"); // Test
        
        add_history(User[client_id].nom, "in", "missed");
        
        User.calling_audio.autoplay = false;
        User.calling_audio.pause();
        stop_peer(socket);
        
        timing.innerText = "Call Hang Out";
        timing.style.color = "red";

        clearInterval(User.timer);
        delete User.timer;
        delete User.calling_audio;

        setTimeout(()=>{
            call_box.style.height = "0%";
        }, 1000);

    });

    // -----------------> When the one you are calling is already on the phone
    socket.on('Already called', async (client_id) => {
        
        timing.style.color = "lime";
        timing.innerText = "Occupied";

        accept_btn.onclick = () => {};
        refuse_btn.onclick = () => {};

        clearInterval(User.timer);
        delete User.timer;
        setTimeout(()=>{
            call_box.style.height = "0%";
        }, 2000);

        stop_peer(socket);
        add_history(User[client_id].nom, "out", "Occupied_out");

    });

    // -----------------------> When you are occupied and someone Called

    socket.on('Occupied', async (client_id) => {
        add_history(User[client_id].nom, "in", "Occupied_in");
    });

    // ------------------------> if a client disconnected
    socket.on("Client_Disconnected", (client_id) => {

        log_msg(`<b>${User[client_id].nom}</b> is disconnected`);
        clients_main.querySelectorAll(`div`).forEach(div => {
            if(div.id == client_id){
                div.style.scale = 0;
                setTimeout(() => {
                    div.remove();
                }, 500);
            };
        });

        delete User[client_id];

    });

    
};

// --------------------> Functions

// -------> Calling accepted

async function accepte_call(soc, client_id) {
    
    // -----------------> UserMedia to get the microphone stream
    const stream = User.stream = await navigator.mediaDevices.getUserMedia({"audio": {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
    }});
    
    // ------------------> The media display to put in video tags
    // const stream = User.stream = await navigator.mediaDevices.getDisplayMedia({"video": true ,"audio": {
    //     echoCancellation: true,
    //     noiseSuppression: true,
    //     sampleRate: 44100
    // }});

    User.peer.create_stream_peers(stream, (offer)=>{
        soc.emit("offer", offer, client_id)
    });

};


// -------> Adding Histories of calls
async function calling(soc, client_id){
    
    soc.emit("calling", client_id);

    prepare_call(soc, client_id);

    caller_name.innerText = User[client_id].nom;
    timing.innerText = "OutGoing Call";
    timing.style.color = "lime";

    let i = 0;
    let dot = ".";
    let timer = User.timer = setInterval(() => {
        if(i <= 3){
            timing.innerText = "OutGoing Call" + dot;
            dot += ".";
            i++; 
        }else{
            timing.innerText = "OutGoing Call";
            dot = ".";
            i = 0;
        };
        console.log("calling... " + i);
    }, 500);

    call_box.style.height = "100%";

    accept_btn_text.innerText = "Calling";
    accept_btn.onclick = () => {
        log_msg("Already calling");
    };

    refuse_btn_text.innerText = "Hang-Up";

    refuse_btn.onclick = () => {

        soc.emit("hang_OutGoing", client_id);
        console.log("hang");
        stop_peer(soc);

        timing.style.color = "red";
        timing.innerText = "Call End";

        clearInterval(timer);

        setTimeout(() => {
            call_box.style.height = "0px";
            add_history(User[client_id].nom, "out", "missed");
        }, 1000);

    };



};


// -------> Adding Histories of calls
async function add_history(client_name, call_direction, call_status){
    const history_box = document.querySelector("#History > main");
    const div = document.createElement("div");
    const div2 = document.createElement("div");
    const clt_name = document.createElement("span");
    const direction = document.createElement("span");
    const date = new Date().toISOString().split(".")[0].replace("T","_");


    if(call_direction === "out" || call_direction === "Out" || call_direction == "OUT"){
        direction.innerText = `OutGone(${date})`
    }else if(call_direction === "in" || call_direction === "In" || call_direction == "IN" || call_direction == "iN"){
        direction.innerText = `InCame(${date})`
    }else{

    }

    if(call_status === "OK" || call_status === "ok" || call_status === "Ok" || call_status === "ok"){
        div.className = "OK";
        div.title = "Call Went OK";
        console.log("OK")
    }else if(call_status === "Missed" || call_status === "missed"){
        div.className = "Missed";
        div.title = "Call Missed";
        console.log("missed")
    }else if(call_status === "Occupied_in" || call_status === "occupied_in"){
        div.className = "Occupied";
        div.title = "You were occupied when called";
        console.log("Occupied in")
    }else if(call_status === "Occupied_out" || call_status === "Occupied_out"){
        div.className = "Occupied";
        div.title = "He's occupied call later";
        console.log("Occupied Out")
    }
    

    clt_name.innerText = client_name;
    div2.innerHTML = user_solid_svg;
    
    div.appendChild(div2);
    div.appendChild(clt_name);
    div.appendChild(direction);
    history_box.appendChild(div);
};