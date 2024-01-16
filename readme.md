# Voice Call Simulator

## Description:
This is a simple voice call application in JavaScript. The application allows user to registers with a simple Id and call each others with a Node JS server in the middle of them.

## Algorithm
the algorithm is very simple:
1) 
    - Clients connect to the node server with his Id
    - the server register his *Id* attached to his *socket.id* in a *database(JS object)*
    - on new client connection, the server send his *Id* and his *socket.id* to the other connected clients.
    - on a client disconnect, he became inavailable to the other clients

2) client_1 calls client2
    - *client_1* send *client2_socket_id* to the server with a *Calling* message and the server redirect the message to the *client_2*
    - {
        if(client_2 accepts the call): they all create offers and answer and send them to each other via the server

        else if(client_2 refuse the call): he send a *refuse* message the client_1 via the server and they end the connection
        
        else if(client_2 is already called by another client_3?) : the server send a *occupied* messsage to client_1.
    }

*NOTE:* this is a simple description of the application but you need to handle all *Events* on the clients's side and the server's side as well. (ALL of the possible events).

## Technologies

1) Languages:
    - HTML
    - CSS
    - JavaScript

2) Frameworks and libraries:
    - Node JS
    - ExpressJS
    - Socket.io

3) Web APIs
    - RTCPeersConnection()                                  // This one is really something else
    - windows.navigator.mediaDevices.getUserMedia()         // To capture webCams/ microphones
    - windows.navigator.mediaDevices.getDisplayMedia()      // To capture the screen/ windows/ Tabs
    - Audio()

