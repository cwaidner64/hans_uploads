import Types "../dfx_server_backend/Types";
import State "../dfx_server_backend/State";
import Param "../dfx_server_backend/Param";

import Time "mo:base/Time";
import Int "mo:base/Int";


shared ({caller = initPrincipal}) actor class Driver() /* : Types.Service */ {
    public type VideoInfo = Types.VideoInfo;
    public type VideoInit = Types.VideoInit;
    public type VideoId = Types.VideoId;


    var state = State.empty({ admin = initPrincipal });
    /// log the given event kind, with a unique ID and current time
    
    var timeMode : {#ic ; #script} =
    switch (Param.timeMode) {
     case (#ic) #ic;
     case (#script _) #script
    };

    var scriptTime : Int = 0;

    func timeNow_() : Int {
    switch timeMode {
      case (#ic) { Time.now() };
      case (#script) { scriptTime };
        }
        };


    func logEvent(ek : State.Event.EventKind) {
        state.eventLog.add({
                            id = state.eventCount ;
                            time = timeNow_() ;
                            kind = ek
                        });
        state.eventCount += 1;
    };

    func createVideo_(i : VideoInit) : ?VideoId {
        let now = timeNow_();
        let videoId = i.userId # "-" # i.name # "-" # (Int.toText(now));
        switch (state.videos.get(videoId)) {
        case (?_) { /* error -- ID already taken. */ null };
        case null { /* ok, not taken yet. */
            state.videos.put(videoId,
                                {
                                videoId = videoId;
                                userId = i.userId ;
                                name = i.name ;
                                createdAt = i.createdAt ;
                                uploadedAt = now ;
                                viralAt = null ;
                                caption =  i.caption ;
                                chunkCount = i.chunkCount ;
                                tags = i.tags ;
                                viewCount = 0 ;
                                });
            state.uploaded.put(i.userId, videoId);
            logEvent(#createVideo({info = i}));
            ?videoId
            };
        }
    };
}