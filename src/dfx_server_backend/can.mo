import Types "./Types";
import State "./State";
import Param "./Param";
import Access "./Access";
import Nat "mo:base/Nat";

import Time "mo:base/Time";
import Int "mo:base/Int";

shared ({caller = initPrincipal}) actor class Driver() = this {

    public type VideoInfo = Types.VideoInfo;
    public type VideoInit = Types.VideoInit;
    public type VideoId = Types.VideoId;
    public type UserId = Types.UserId;
    public type ChunkId = Types.ChunkId;
    public type VideoPic = Types.VideoPic;
    
    // Initialize state inside the constructor body (legal use of initPrincipal)
    let state = State.empty({ admin = initPrincipal });

    // Determine time mode based on Param
    let timeMode : {#ic; #script} = switch (Param.timeMode) {
        case (#ic) #ic;
        case (#script _) #script;
    };

    // Script time, if in script mode
    var scriptTime : Int = 0;

    // Return current time depending on time mode
    func timeNow_() : Int {
        switch timeMode {
            case (#ic) Time.now();
            case (#script) scriptTime;
        }
    };

    // Log an event to the state
    func logEvent(ek : State.Event.EventKind) {
        state.eventLog.add({
            id = state.eventCount;
            time = timeNow_();
            kind = ek;
        });
        state.eventCount += 1;
    };
    func accessCheck(caller : Principal, action : Types.UserAction, target : Types.ActionTarget) : ?() {
    state.access.check(timeNow_(), caller, action, target)
    };

    // Internal function to create a video
    func createVideo_(i : VideoInit) : ?VideoId {
        let now = timeNow_();
        let videoId = i.userId # "-" # i.name # "-" # Int.toText(now);

        switch (state.videos.get(videoId)) {
            case (?_) null; // already exists
            case null {
                // create new entry
                state.videos.put(videoId, {
                    videoId = videoId;
                    userId = i.userId;
                    name = i.name;
                    createdAt = i.createdAt;
                    uploadedAt = now;
                    viralAt = null;
                    caption = i.caption;
                    chunkCount = i.chunkCount;
                    tags = i.tags;
                    viewCount = 0;
                });
                state.uploaded.put(i.userId, videoId);
                logEvent(#createVideo({ info = i }));
                ?videoId;
            };
        };
    };
     public shared(msg) func createVideo(i : VideoInit) : async ?VideoId {
    do ? {
      accessCheck(msg.caller, #update, #user(i.userId))!;
      createVideo_(i)!
    }
  };

  func getVideoInfo_ (caller : ?UserId, videoId : VideoId) : ?VideoInfo {
    do ? {
      let v = state.videos.get(videoId)!;
      {
        videoId = videoId;
        pic = state.videoPics.get(videoId);
        userId = v.userId ;
        createdAt = v.createdAt ;
        uploadedAt = v.uploadedAt ;
        viralAt = v.viralAt ;
        caption = v.caption ;
        tags = v.tags ;
        likes = state.likes.get1(videoId);
        superLikes = state.superLikes.get1(videoId);
        viewCount = v.viewCount ;
        name = v.name ;
        chunkCount = v.chunkCount ;
        // This implementation makes public all users who flagged every video,
        // but if that information should be kept private, get video info
        // could return just whether the calling user flagged it.
        viewerHasFlagged = do ? {
          state.abuseFlagVideos.isMember(caller!, videoId) ;
        };
        abuseFlagCount = state.abuseFlagVideos.get1Size(videoId);
      }
    }
  };

  public query(msg) func getVideoInfo (caller : ?UserId, target : VideoId) : async ?VideoInfo {
    do ? {
      accessCheck(msg.caller, #view, #video target)!;
      switch caller {
        case null { getVideoInfo_(null, target)! };
        case (?callerUserName) {
               // has private access to our caller view?
               accessCheck(msg.caller, #update, #user callerUserName)!;
               getVideoInfo_(?callerUserName, target)!
             };
      }
    }

  };

  public query(msg) func getVideoPic(videoId : VideoId) : async ?VideoPic {
    do ? {
      accessCheck(msg.caller, #view, #video videoId)!;
      state.videoPics.get(videoId)!
    }
  };

  public shared(msg) func putVideoInfo(videoId : VideoId, videoInit : VideoInit) : async ?() {
    do ? {
      accessCheck(msg.caller, #update, #video videoId)!;
      let i = videoInit ;
      let v = state.videos.get(videoId)!;
      state.videos.put(videoId,
                       {
                         // some fields are "immutable", regardless of caller data:
                         userId = v.userId ;
                         uploadedAt = v.uploadedAt ;
                         viewCount = v.viewCount ;
                         videoId = videoId ;
                         // -- above uses old data ; below is from caller --
                         createdAt = i.createdAt ;
                         viralAt = null;
                         caption = i.caption ;
                         tags = i.tags ;
                         name = i.name ;
                         chunkCount = i.chunkCount ;
                       })
    }
  };
  func chunkId(videoId : VideoId, chunkNum : Nat) : ChunkId {
    videoId # (Nat.toText(chunkNum))
  };

  public shared(msg) func putVideoChunk
    (videoId : VideoId, chunkNum : Nat, chunkData : [Nat8]) : async ?()
  {
    do ? {
      accessCheck(msg.caller, #update, #video videoId)!;
      state.chunks.put(chunkId(videoId, chunkNum), chunkData);
    }
  };

  public query(msg) func getVideoChunk(videoId : VideoId, chunkNum : Nat) : async ?[Nat8] {
    do ? {
      accessCheck(msg.caller, #view, #video videoId)!;
      state.chunks.get(chunkId(videoId, chunkNum))!
    }
  };

    // Public greet query
    public query func greet(name: Text) : async Text {
        return "Hello, " # name;
    };

    
};
