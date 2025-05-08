import React,{use, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";

import {ProfilePic}from "./ProfilePic";
import {getProfilePic,getFileChunks} from "src/utils";
import { FILE } from "dns";

import "./File.scss";
const FILE_BLUR_MIN = 1;

interface FileProps {
    fileInfo: any;
    userId: string;
    isPreview?: boolean;
    onRefreshUser?: any;
    onClose?: () => void;
}

export function File(props: FileProps) {
    const {isPreview = false, 
        userId, 
        fileInfo, 
        onRefreshUser,
        onClose = () => {}
    } = props;
    return isPreview ? (
        <div className="preview-container">
            <FileBase
             isPreview
             userId={userId} 
             fileInfo={fileInfo} 
            onRefreshUser={onRefreshUser}
             onClose={onClose}
             />
        </div>
    ) : (
        <FileBase 
        userId={userId}
        fileInfo={fileInfo}
        onRefreshUser={onRefreshUser}
        onClose={onClose}/>
    );
}
function FileBase(props: FileProps) {
    const {isPreview = false, 
        userId, 
        fileInfo, 
        onRefreshUser,
        onClose = () => {}
    } = props;
    const[play,setPlay] = useState(false);
    const[fileSourceUrl,setFileURL] = useState<string>();
    const[userPic,setUserPic] = useState<string>();


    const fileisFlagged = fileInfo?.flags >= FILE_BLUR_MIN;

    const openFile = () => {
        setPlay(!play);
    };
    
    getFileChunks(fileInfo).then((fileURL) => {
        setFileURL(fileURL);
    });


    useEffect(() => {
        if (!fileInfo) {
            return;
        }


    const fileRef = useRef<HTMLVideoElement>(null);

    getProfilePic(fileInfo.userId).then((bytes) => {
         if (!bytes) {
           return;
         }
         const picBlob = new Blob([Buffer.from(new Uint8Array(bytes))], {
           type: "image/jpeg",
         });
         const pic = URL.createObjectURL(picBlob);
         setUserPic(pic);
       });

       return()=>{fileRef.current?.pause()};
    },[fileInfo?.fileId]);
   
    const isCurrentUser = userId === fileInfo.userId;
    const fileblurStyle = fileisFlagged ? {filter: "blur(20px)"} : {};

    return (
        <div className="file-container">
            <div className="file-header">
                <ProfilePic
                    name={fileInfo.userId}
                    profilePic={userPic}
                />
                <Link to={`/profile/${fileInfo.userId}`}>
                    {fileInfo.userId}
                </Link>
            </div>
             <div className="user-details">
                    <ProfilePic name={fileInfo.userId} profilePic={userPic} />
                    <div style={{ position: "relative" }}>
                      <div className="uploader-info">
                        <span className="userId">
                          <Link
                            to={
                              isCurrentUser ? `/profile` : `/profiles/${fileInfo.userId}`
                            }
                          >
                            @{fileInfo.userId}
                          </Link>
                        </span>
                        <p className="caption">{fileInfo.caption}</p>
                      </div>
                    </div>
                  </div>
            
        </div>
    );
}