import { useEffect, useState } from "react";
import {
  createFile,
  getFileInfo,
  putFileChunk,
  putFilePic,
} from "./canister";
import { FileInfo, FileInit } from "./canister/typings";
import { MAX_CHUNK_SIZE, encodeArrayBuffer, hashtagRegExp } from "./index";

export function getFileInit(
  userId: string,
  file: File,
  caption: string
): FileInit {
  const chunkCount = Number(Math.ceil(file.size / MAX_CHUNK_SIZE));
  return {
    caption,
    // @ts-ignore
    chunkCount,
    // @ts-ignore
    createdAt: Number(Date.now() * 1000), // motoko is using nanoseconds
    name: file.name.replace(/\.[^/.]+$/, ""),
    tags: caption.match(hashtagRegExp) || [],
    userId,
    mimeType: file.type,
    description: "" + file.name,
  };
}
export interface UploadFileInit {
  name: string;
  caption: string;
  chunkCount: number;
  userId: string;
}
// Divides the file into chunks and uploads them to the canister in sequence
async function processAndUploadChunk(
  fileBuffer: ArrayBuffer,
  byteStart: number,
  fileSize: number,
  fileId: string,
  chunk: number
) {
  const fileSlice = fileBuffer.slice(
    byteStart,
    Math.min(fileSize, byteStart + MAX_CHUNK_SIZE)
  );
  const sliceToNat = encodeArrayBuffer(fileSlice);
  return putFileChunk(fileId, chunk, sliceToNat);
}

// Stores the filePic on the canister
async function uploadFilePic(fileId: string, file: number[]) {
  console.log("Storing file thumbnail...");
  try {
    await putFilePic(fileId, file);
    console.log(`File thumbnail stored for ${fileId}`);
  } catch (error) {
    console.error("Unable to store file thumbnail:", error);
  }
}


async function uploadFile(userId: string, file: File, caption: string): Promise<FileInfo> {
    const fileBuffer = (await file?.arrayBuffer()) || new ArrayBuffer(0);
    
    const fileInit = getFileInit(userId, file, caption);
    const fileId = await createFile(fileInit);
    
    let chunk = 1;
    const fileSize = fileBuffer.byteLength;
   
    const putChunkPromises: Promise<[]|[null]>[] = [];

    for (
        let byteStart = 0;
        byteStart < file.size;
        byteStart += MAX_CHUNK_SIZE, chunk++
      ) {
        putChunkPromises.push(
            processAndUploadChunk(fileBuffer, byteStart, fileSize, fileId, chunk)
            );
        }
    await Promise.all(putChunkPromises);
    return await checkFileFromIC(fileId,userId);
}

async function checkFileFromIC(fileId: string, userId: string) {
    const fileInfo = await getFileInfo(userId, fileId);
    if (
        !fileInfo ||
        typeof fileInfo !== "object" ||
        !("userId" in fileInfo) ||
        fileInfo.userId !== userId
    ) {
        throw new Error("File upload failed or user mismatch");
    }
    return fileInfo as FileInfo;
}

export function useUploadFile({userId}: {userId: string}) {
    const [completedFile, setCompletedFile] = useState<FileInfo>();
    const [file, setFile] = useState<File>();
    const [caption, setCaption] = useState("");
    const [ready, setReady] = useState(false);
    const[mimeType, setMimeType] = useState<string>();
    
    
      async function handleUpload(fileToUpload) {
        console.info("Storing file...");
        try {
          console.time("Stored in");
          const myfile = await uploadFile(userId, fileToUpload, caption);
    
          setCompletedFile(myfile);
          setReady(false);
          setFile(undefined);
          setMimeType(myfile.mimeType);
          console.timeEnd("Stored in");
        } catch (error) {
          console.error("Failed to store file.", error);
        }
      }
    
      useEffect(() => {
        if (ready && file !== undefined) {
          handleUpload(file);
        }
      }, [ready]);
    
      return {
        completedFile,
        setCaption,
        setFile,
        setReady,
      };
    }