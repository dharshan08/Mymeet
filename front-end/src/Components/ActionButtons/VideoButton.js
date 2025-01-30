
const VideoButton = ({localFeedEl,callStatus,localStream,updateCallStatus,peerConnection})=>{

    //handle user clicking on video button
    const startStopVideo = ()=>{
        const copyCallStatus = {...callStatus}
        //useCases:
        // 1.video is enabled, so we need to disable
        if(copyCallStatus.videoEnabled){
            copyCallStatus.videoEnabled = false
            updateCallStatus(copyCallStatus)
            const tracks= localStream.getVideoTracks()
            tracks.forEach( track=> track.enabled = false)
        }
        // 2.video is disabled, so we need to enable
        else if(copyCallStatus.videoEnabled === false){
            copyCallStatus.videoEnabled = true;
            updateCallStatus(copyCallStatus)
            const tracks = localStream.getVideoTracks()
            tracks.forEach(track=> track.enabled = true)
        }
        // 3. video is null, we need to init
        else if(copyCallStatus.videoEnabled === null){
            console.log("Init video!")
            copyCallStatus.videoEnabled = true;
            updateCallStatus(copyCallStatus)
            // we are not adding tracks so they are visible in video tag, we adding them to the PC, so that they can be sent
            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track,localStream)
            })
        }
    }

    return(
        <div className="button-wrapper video-button d-inline-block">
            <i className="fa fa-caret-up choose-video"></i>
            <div className="button camera" onClick={startStopVideo}>
                <i className="fa fa-video"></i>
                <div className="btn-text">{callStatus.video === "enabled" ? "Stop" : "Start"} Video</div>
            </div>
        </div>
    )
}
export default VideoButton;