class Peers{
    constructor(){
        this.peer = new RTCPeerConnection();
        this.on_ice = ()=>{};
        this.on_add_str = ()=>{};
    }

    create_stream_peers(stream, offer_handler = (offer)=>{}){
        
        this.peer.addStream(stream);

        this.peer.createOffer().then(offer => {
            this.peer.setLocalDescription(offer);
            offer_handler(offer);
        });
    }
    peer_event_handlers(on_ice_candidate = (candidate)=>{}, on_add_stream = (str)=>{}){
        
        this.peer.onicecandidate = this.on_ice = (event) => {
            on_ice_candidate(event.candidate);
        };

        this.peer.onaddstream = this.on_add_str = (event) => {
            on_add_stream(event.stream);
        };
    }

    async peer_socket_events(){
        return this.peer;
    }

    peer_close(){
        this.peer.removeEventListener("icecandidate", this.on_ice);
        this.peer.removeEventListener("addstream", this.on_add_str);
        
        this.peer.close();
    }

}

async function prepare_call(soc, client_id){

    // ---------------> Create Offers and Answers en send them to the client
    const peer = User.peer = new Peers();
    const audio = User.audio = new Audio();
    audio.volume = 1;
    audio.autoplay = true;

    peer.peer_event_handlers(

        (candidate) => {soc.emit("ice-candidate", candidate, client_id)},
        (str) => {

            // ----------------> Went receiving the call stream

            User.new_stream = str;
            audio.srcObject = new MediaStream(str);
            
            let s = 0;
            let m = 0;
            let h = 0;
            User.interval = setInterval(()=>{
                
                const ss = (s < 10) ?  `0${s}` : s;
                const mm = (m < 10) ?  `0${m}` : m;
                const hh = (h < 10) ?  `0${h}` : h;
                if(s == 60) {
                    s = 0;
                    m++;
                }
                if(m == 60){
                    m = 0;
                    h++;
                }

                timing.innerText = `${hh}: ${mm}: ${ss}`;
                s++;
            }, 1000)
        }
    );

    const p = await peer.peer_socket_events();
    
    // -----------------> On Offer
    soc.on("offer", User["offer_handler"] = async (offer) => {
        await p.setRemoteDescription(offer);
        const answer = await p.createAnswer();
        p.setLocalDescription(answer);
        
        soc.emit("answer", answer, client_id); // answer emitter
    });

    // -----------------> On Answer
    soc.on("answer", User["answer_handler"] = async (answer) => {
        await p.setRemoteDescription(answer);
        // await p.setLocalDescription(answer)
    });

    // -----------------> On Candidate
    soc.on("ice-candidate", User["candidate_handler"] = async (candidate) => {
        await p.addIceCandidate(candidate);
    });

};

async function stop_peer(socket){

    setTimeout(()=>{
        call_box.style.height = "0%";
        delete User.timer;
    }, 2000);

    if(Object.keys(User).includes("stream")){
        User.stream.getTracks().forEach(track => track.stop());
    }
    if(Object.keys(User).includes("new_stream")){
        User.new_stream.getTracks().forEach(track => track.stop());
    };
    
    socket.off("offer", User["offer_handler"]);
    socket.off("answer", User["answer_handler"]);
    socket.off("ice-candidate", User["candidate_handler"]);
    
    User.peer.peer_close();

    User.audio.pause();
    delete User.peer;
    delete User.audio;

    if(Object.keys(User).includes("interval")){
        clearInterval(User.interval);
        delete User.interval;
    }
}
