import peerConfiguration from './stunServers'
import socketConnection from "./socketConnection";

const createPeerConnection = (userName,typeOfCall)=>{
    //token for example
    const token = 123
    //init socket connection
    const socket = socketConnection(token) 
    try{
        const peerConnection = new RTCPeerConnection(peerConfiguration);
        //RTCPeerConnection is how WebRTC connects to another browser (peer).
        //It takes a config object, which (here) is just stun servers
        //STUN servers get our ICE candidates
        const remoteStream = new MediaStream();

        //peerConnection listeners
        peerConnection.addEventListener('signalingstatechange',(e)=>{
            console.log("Signaling Event Change!")
            console.log(e)
            console.log(peerConnection.signalingState)
        })

        peerConnection.addEventListener('icecandidate',(e)=>{
            console.log("Found an ICEcandidate!")
            if(e.candidate){
                //emit the new ice cand to the signaling server
                socket.emit('sendIceCandidateToSignalingServer',{
                    iceCandidate: e.candidate,
                    iceUserName: userName,
                    didIOffer : typeOfCall === "offer",
                })
            }
        })

        peerConnection.addEventListener('track',e=>{
            // the remote has sent us a track so let us add it
            e.streams[0].getTracks().forEach(track => {
                remoteStream.addTrack(track,remoteStream)
                console.log("this should add some video to the feed")
            });
        })

        return({
            peerConnection,
            remoteStream,
        })
    }catch(err){
        console.log(err)
    }
}

export default createPeerConnection
