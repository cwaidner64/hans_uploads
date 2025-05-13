
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileInfoPlus } from "../utils/canister/typings";
import { useUploadVideo } from "../utils";
import { useUploadFile}  from "../utils";
import { LoadingIndicator } from "./LoadingIndicator";
import "./Upload.scss";
// import {useUploadFile} from "../utils/useUploadFile";
/*
 * Allows selection of a file followed by the option to add a caption before
 * uploading to the canister. Utility functions assist in the data translation.
 */
export function Upload({
  user,
  onUpload,
}: {
  user?: ProfileInfoPlus;
  onUpload: () => void;
}) {
  const navigate = useNavigate();
  const [file_upload, setFile] = useState<File>();
  const fileUploadController = useUploadFile({userId: user?.userName || ""});






  const [videoFile, setVideoFile] = useState<File>();
  const [videoPreviewURL, setVideoPreviewURL] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingClean, setUploadingClean] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const videoUploadController = useUploadVideo({
    userId: user?.userName || "",
  });

  useEffect(() => {
    inputRef.current?.click();
  }, []);

  useEffect(() => {
    if (uploading && uploadingClean) {
      setUploadingClean(false);
    }
  }, [uploading]);

  useEffect(() => {
    if (videoFile) {
      // Create video preview so the user can see what they've selected
      videoFile.arrayBuffer().then((buffer) => {
        const videoBlob = new Blob([buffer], {
          type: "video/mp4",
        });
        const vidURL = URL.createObjectURL(videoBlob);
        setVideoPreviewURL(vidURL);
      });
    }
  }, [videoFile]);

  function onChange(evt: ChangeEvent<HTMLInputElement>) {
    const { files } = evt.target;

    if (files && files.length === 1 && files.item(0)) {
      const file = files[0];
      const videoTypes = ["video/mp4"];
      const catchAllTypes = ["application/pdf", "text/plain", "image/jpeg", "image/png"];

      if (videoTypes.includes(file.type)) {
        // Handle video files
        setVideoFile(file);
        setUploading(true);
        setUploadingClean(true);
      } else if (catchAllTypes.includes(file.type)) {
        // Handle other files
        setFile(file);
        alert(`Selected file: ${file.name}`);
      } else {
        alert("Unsupported file type.");
      }
    }
  }

  function uploadVideo() {
    const caption = textAreaRef.current?.value;
    if (!videoFile || !caption) {
      return;
    }
    videoUploadController.setFile(videoFile);
    videoUploadController.setCaption(caption);
    videoUploadController.setReady(true);
    setUploading(true);
  }

  function uploadFile() {
    const caption = textAreaRef.current?.value;
    if (!file_upload) {
      alert("No file selected.");
      return;
    }
    // Implement logic to upload the file (e.g., using a file upload controller)
    alert(`Uploading file: ${file_upload.name}`);
    fileUploadController.setFile(file_upload);
    fileUploadController.setCaption("" + file_upload.name); // Assuming no caption for non-video files
    fileUploadController.setReady(true);
    setUploading(true);
  }

  useEffect(() => {
    if (videoUploadController.completedVideo !== undefined) {
      setUploading(false);
      onUpload();
      setTimeout(() => {
        navigate("/feed");
      }, 2000);
    }
  }, [videoUploadController.completedVideo]);

  useEffect(() => {
    if (fileUploadController.completedFile !== undefined) {
      setUploading(false);
      onUpload();
      setTimeout(() => {
        navigate("/profile?defaultSubView=1");
      }, 2000);
    }
  }, [fileUploadController.completedFile]);

  return (
    <main
      id="upload-container"
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <LoadingIndicator
        loadingMessage="Uploading..."
        completedMessage="Uploaded!"
        isLoading={uploading && !uploadingClean}
      />
      <input
        hidden
        id="file-upload"
        type="file"
        ref={inputRef}
        accept=".mp4, .jpeg, .png, .pdf, .txt"
        onChange={onChange}
      />
      {videoFile && (
        <div className="video-add-details">
          <video src={videoPreviewURL} muted autoPlay loop />
          <div className="details-entry">
            <textarea
              className="caption-content"
              ref={textAreaRef}
              placeholder="Add caption"
              rows={6}
            />
            <button className="medium primary" onClick={uploadVideo}>
              Post Video
            </button>
          </div>
        </div>
      )}
      {file_upload && !videoFile && (
        <div className="file-add-details">
          <p>Selected file: {file_upload.name}</p>
          <button className="medium primary" onClick={uploadFile}>
            Upload File
          </button>
        </div>
      )}
    </main>
  );
}