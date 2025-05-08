import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AbuseFlag {
  'flag' : boolean,
  'target' : { 'video' : VideoId__1 } |
    { 'user' : UserId },
  'reporter' : UserId,
}
export type ActionTarget = { 'all' : null } |
  { 'video' : VideoId__1 } |
  { 'file' : FileId__1 } |
  { 'user' : UserId } |
  { 'pubView' : null };
export type AllowanceBalance = { 'zeroUntil' : Timestamp } |
  { 'zeroForever' : null } |
  { 'nonZero' : bigint };
export interface Check {
  'userAction' : UserAction,
  'caller' : Principal,
  'actionTarget' : ActionTarget,
}
export type Command = {
    'assertVideoVirality' : { 'isViral' : boolean, 'videoId' : VideoId__2 }
  } |
  {
    'putProfileFollow' : {
      'toFollow' : UserId__2,
      'userId' : UserId__2,
      'follows' : boolean,
    }
  } |
  {
    'createTestData' : {
      'users' : Array<UserId__2>,
      'videos' : Array<[UserId__2, VideoId__2]>,
    }
  } |
  {
    'putSuperLike' : {
      'userId' : UserId__2,
      'superLikes' : boolean,
      'videoId' : VideoId__2,
    }
  } |
  {
    'assertVideoFeed' : {
      'userId' : UserId__2,
      'limit' : [] | [bigint],
      'videosPred' : VideosPred,
    }
  } |
  {
    'putRewardTransfer' : {
      'sender' : UserId__2,
      'amount' : bigint,
      'receiver' : UserId__2,
    }
  } |
  { 'reset' : TimeMode };
export interface CreateFile { 'fileId' : FileId__1 }
export interface CreateProfile {
  'pic' : [] | [ProfilePic__1],
  'userName' : string,
}
export interface CreateVideo { 'info' : VideoInit__1 }
export type Event = {
    'uploadReward' : { 'rewards' : bigint, 'videoId' : VideoId__1 }
  } |
  { 'superlikerReward' : { 'rewards' : bigint, 'videoId' : VideoId__1 } } |
  { 'transferReward' : { 'rewards' : bigint } };
export type EventKind = { 'likeVideo' : LikeVideo } |
  { 'abuseFlag' : AbuseFlag } |
  { 'superLikeVideoFail' : SuperLikeVideoFail } |
  { 'superLikeVideo' : SuperLikeVideo } |
  { 'rewardPointTransfer' : RewardPointTransfer } |
  { 'createFile' : CreateFile } |
  { 'createVideo' : CreateVideo } |
  { 'createProfile' : CreateProfile } |
  { 'emitSignal' : Signal } |
  { 'reset' : TimeMode };
export interface Event__1 { 'id' : bigint, 'kind' : EventKind, 'time' : bigint }
export interface Event__2 { 'check' : Check, 'isOk' : boolean, 'time' : bigint }
export type FileId = string;
export type FileId__1 = string;
export interface FileInfo {
  'userId' : UserId,
  'name' : string,
  'createdAt' : Timestamp,
  'tags' : Array<string>,
  'mimeType' : MimeType,
  'description' : string,
  'fileId' : FileId__1,
  'chunkCount' : bigint,
  'viewerHasFlagged' : [] | [boolean],
  'uploadedAt' : Timestamp,
}
export interface FileInfo__1 {
  'userId' : UserId,
  'name' : string,
  'createdAt' : Timestamp,
  'tags' : Array<string>,
  'mimeType' : MimeType,
  'description' : string,
  'fileId' : FileId__1,
  'chunkCount' : bigint,
  'viewerHasFlagged' : [] | [boolean],
  'uploadedAt' : Timestamp,
}
export interface FileInit {
  'userId' : UserId,
  'name' : string,
  'createdAt' : Timestamp,
  'tags' : Array<string>,
  'mimeType' : MimeType,
  'description' : string,
  'chunkCount' : bigint,
}
export type FilePic = Uint8Array | number[];
export type FilePic__1 = Uint8Array | number[];
export type FileResult = [FileInfo, [] | [FilePic__1]];
export type FileResults = Array<FileResult>;
export interface LikeVideo {
  'source' : UserId,
  'likes' : boolean,
  'target' : VideoId__1,
}
export interface Message { 'id' : bigint, 'time' : Timestamp, 'event' : Event }
export type MimeType = string;
export interface ProfileInfo {
  'userName' : string,
  'uploadedVideos' : Array<VideoId__1>,
  'likedVideos' : Array<VideoId__1>,
  'rewards' : bigint,
  'hasPic' : boolean,
  'followers' : Array<UserId>,
  'following' : Array<UserId>,
  'abuseFlagCount' : bigint,
}
export interface ProfileInfoPlus {
  'userName' : string,
  'uploadedVideos' : Array<VideoInfo__1>,
  'likedVideos' : Array<VideoInfo__1>,
  'likedFiles' : Array<FileInfo>,
  'uploadedFiles' : Array<FileInfo>,
  'rewards' : bigint,
  'allowances' : [] | [UserAllowances],
  'hasPic' : boolean,
  'followers' : Array<ProfileInfo__1>,
  'following' : Array<ProfileInfo__1>,
  'viewerHasFlagged' : [] | [boolean],
  'abuseFlagCount' : bigint,
}
export interface ProfileInfo__1 {
  'userName' : string,
  'uploadedVideos' : Array<VideoId__1>,
  'likedVideos' : Array<VideoId__1>,
  'rewards' : bigint,
  'hasPic' : boolean,
  'followers' : Array<UserId>,
  'following' : Array<UserId>,
  'abuseFlagCount' : bigint,
}
export type ProfilePic = Uint8Array | number[];
export type ProfilePic__1 = Uint8Array | number[];
export type Result = { 'ok' : null } |
  { 'err' : string };
export interface RewardPointTransfer {
  'sender' : UserId,
  'amount' : bigint,
  'receiver' : UserId,
}
export interface Server {
  'checkUsernameAvailable' : ActorMethod<[string], boolean>,
  'createFile' : ActorMethod<[FileInit], [] | [FileId]>,
  'createProfile' : ActorMethod<
    [string, [] | [ProfilePic]],
    [] | [ProfileInfoPlus]
  >,
  'createTestData' : ActorMethod<
    [Array<UserId__1>, Array<[UserId__1, VideoId]>],
    [] | [null]
  >,
  'createVideo' : ActorMethod<[VideoInit], [] | [VideoId]>,
  'doDemo' : ActorMethod<[Array<Command>], [] | [Trace]>,
  'getAccessLog' : ActorMethod<[], [] | [Array<Event__2>]>,
  'getEventLog' : ActorMethod<[], [] | [Array<Event__1>]>,
  'getFeedFiles' : ActorMethod<[UserId__1, [] | [bigint]], [] | [FileResults]>,
  'getFeedVideos' : ActorMethod<
    [UserId__1, [] | [bigint]],
    [] | [VideoResults]
  >,
  'getFileChunk' : ActorMethod<[FileId, bigint], [] | [Uint8Array | number[]]>,
  'getFileInfo' : ActorMethod<[[] | [UserId__1], FileId], [] | [FileInfo__1]>,
  'getFilePic' : ActorMethod<[FileId], [] | [FilePic]>,
  'getFiles' : ActorMethod<[], [] | [Array<FileInfo__1>]>,
  'getIsSuperLiker' : ActorMethod<[UserId__1, VideoId], [] | [boolean]>,
  'getMessages' : ActorMethod<[UserId__1], [] | [Array<Message>]>,
  'getProfileInfo' : ActorMethod<[UserId__1], [] | [ProfileInfo]>,
  'getProfilePic' : ActorMethod<[UserId__1], [] | [ProfilePic]>,
  'getProfilePlus' : ActorMethod<
    [[] | [UserId__1], UserId__1],
    [] | [ProfileInfoPlus]
  >,
  'getProfileVideos' : ActorMethod<
    [UserId__1, [] | [bigint]],
    [] | [VideoResults]
  >,
  'getProfiles' : ActorMethod<[], [] | [Array<ProfileInfo>]>,
  'getSearchVideos' : ActorMethod<
    [UserId__1, Array<string>, [] | [bigint]],
    [] | [VideoResults]
  >,
  'getSuperLikeValidNow' : ActorMethod<[UserId__1, VideoId], [] | [boolean]>,
  'getUserNameByPrincipal' : ActorMethod<[Principal], [] | [Array<string>]>,
  'getVideoChunk' : ActorMethod<
    [VideoId, bigint],
    [] | [Uint8Array | number[]]
  >,
  'getVideoInfo' : ActorMethod<[[] | [UserId__1], VideoId], [] | [VideoInfo]>,
  'getVideoPic' : ActorMethod<[VideoId], [] | [VideoPic]>,
  'getVideos' : ActorMethod<[], [] | [Array<VideoInfo>]>,
  'isDropDay' : ActorMethod<[], [] | [boolean]>,
  'putAbuseFlagUser' : ActorMethod<
    [UserId__1, UserId__1, boolean],
    [] | [null]
  >,
  'putAbuseFlagVideo' : ActorMethod<[UserId__1, VideoId, boolean], [] | [null]>,
  'putFileChunk' : ActorMethod<
    [FileId, bigint, Uint8Array | number[]],
    [] | [null]
  >,
  'putFileInfo' : ActorMethod<[FileId, FileInit], [] | [null]>,
  'putProfileFollow' : ActorMethod<
    [UserId__1, UserId__1, boolean],
    [] | [null]
  >,
  'putProfilePic' : ActorMethod<[UserId__1, [] | [ProfilePic]], [] | [null]>,
  'putProfileVideoLike' : ActorMethod<
    [UserId__1, VideoId, boolean],
    [] | [null]
  >,
  'putRewardTransfer' : ActorMethod<
    [UserId__1, UserId__1, bigint],
    [] | [null]
  >,
  'putRewards' : ActorMethod<[UserId__1, bigint], [] | [null]>,
  'putSuperLike' : ActorMethod<[UserId__1, VideoId, boolean], [] | [null]>,
  'putTestFollows' : ActorMethod<[Array<[UserId__1, UserId__1]>], [] | [null]>,
  'putVideoChunk' : ActorMethod<
    [VideoId, bigint, Uint8Array | number[]],
    [] | [null]
  >,
  'putVideoInfo' : ActorMethod<[VideoId, VideoInit], [] | [null]>,
  'putVideoPic' : ActorMethod<[VideoId, [] | [VideoPic]], [] | [null]>,
  'reset' : ActorMethod<[{ 'ic' : null } | { 'script' : bigint }], [] | [null]>,
  'scriptTimeTick' : ActorMethod<[], [] | [null]>,
  'setTimeMode' : ActorMethod<
    [{ 'ic' : null } | { 'script' : bigint }],
    [] | [null]
  >,
}
export type Signal = { 'viralVideo' : ViralVideo };
export interface SuperLikeVideo {
  'source' : UserId,
  'target' : VideoId__1,
  'superLikes' : boolean,
}
export interface SuperLikeVideoFail { 'source' : UserId, 'target' : VideoId__1 }
export type TimeMode = { 'ic' : null } |
  { 'script' : bigint };
export type Timestamp = bigint;
export interface Trace {
  'status' : { 'ok' : null } |
    { 'err' : null },
  'trace' : Array<TraceCommand>,
}
export interface TraceCommand { 'result' : Result, 'command' : Command }
export type UserAction = { 'admin' : null } |
  { 'view' : null } |
  { 'create' : null } |
  { 'update' : null };
export interface UserAllowances {
  'abuseFlags' : AllowanceBalance,
  'superLikes' : AllowanceBalance,
}
export type UserId = string;
export type UserId__1 = string;
export type UserId__2 = string;
export type VideoId = string;
export type VideoId__1 = string;
export type VideoId__2 = string;
export interface VideoInfo {
  'pic' : [] | [VideoPic__1],
  'viralAt' : [] | [Timestamp],
  'userId' : UserId,
  'name' : string,
  'createdAt' : Timestamp,
  'tags' : Array<string>,
  'likes' : Array<UserId>,
  'viewCount' : bigint,
  'caption' : string,
  'chunkCount' : bigint,
  'superLikes' : Array<UserId>,
  'viewerHasFlagged' : [] | [boolean],
  'abuseFlagCount' : bigint,
  'uploadedAt' : Timestamp,
  'videoId' : VideoId__1,
}
export interface VideoInfo__1 {
  'pic' : [] | [VideoPic__1],
  'viralAt' : [] | [Timestamp],
  'userId' : UserId,
  'name' : string,
  'createdAt' : Timestamp,
  'tags' : Array<string>,
  'likes' : Array<UserId>,
  'viewCount' : bigint,
  'caption' : string,
  'chunkCount' : bigint,
  'superLikes' : Array<UserId>,
  'viewerHasFlagged' : [] | [boolean],
  'abuseFlagCount' : bigint,
  'uploadedAt' : Timestamp,
  'videoId' : VideoId__1,
}
export interface VideoInit {
  'userId' : UserId,
  'name' : string,
  'createdAt' : Timestamp,
  'tags' : Array<string>,
  'caption' : string,
  'chunkCount' : bigint,
}
export interface VideoInit__1 {
  'userId' : UserId,
  'name' : string,
  'createdAt' : Timestamp,
  'tags' : Array<string>,
  'caption' : string,
  'chunkCount' : bigint,
}
export type VideoPic = Uint8Array | number[];
export type VideoPic__1 = Uint8Array | number[];
export type VideoResult = [VideoInfo__1, [] | [VideoPic__1]];
export type VideoResults = Array<VideoResult>;
export type VideosPred = { 'containsAll' : Array<VideoId__2> } |
  { 'equals' : Array<VideoId__2> };
export interface ViralVideo {
  'video' : VideoId__1,
  'superLikers' : Array<ViralVideoSuperLiker>,
  'uploader' : UserId,
}
export interface ViralVideoSuperLiker { 'time' : bigint, 'user' : UserId }
export interface _SERVICE extends Server {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
