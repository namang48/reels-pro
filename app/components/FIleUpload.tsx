"use client";
import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import {Loader2} from "lucide-react"
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";


interface FileUploadProps{
    onSuccess : (res: IKUploadResponse) => void
    onProgress : (progress : number) => void
    fileType : "image" | "video"
}




export default function FileUpload({
    onSuccess,
    onProgress,
    fileType = "image"
} : FileUploadProps) {

    const [uploading, setUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null >(null);

  const onError = (err : {message : string}) => {
    console.log("Error", err);
    setError(err.message);
    setUploading(false);
  };
  
  const handleSuccess = (response : IKUploadResponse) => {
    console.log("Success", response);
    setUploading(false);
    setError(null);
    onSuccess(response);
  };
  
  const handleProgress = (evt : ProgressEvent) => {
    if(evt.lengthComputable && onProgress){
        const percentComplete = (evt.loaded/evt.total)/100;
        onProgress(Math.round(percentComplete));
    }
  };
  
  const handleStartUpload = () => {
    setUploading(true);
    setError(null);
  };

  const validateFile = (file : File) => {
    if(file.type === "video"){
        if(!file.type.startsWith("video/")){
            setError("Please Upload a video File");
            return false;
        }
        if(file.size>100*1024*1024){
            setError("Video must be less thn 100 MB")
            return false;
        }
    }else{
        const validType = ["image/jpeg","image/jpg","image/png","image/webp"]
        if(!validType.includes(file.type)){
            setError("Please upload a valid file (JPEG,JPG,PNG,WEBP)");
            return false;
        }
        if(file.size>5*1024*1024){
            setError("Image must be less thn 5 MB")
            return false;
        }
    }
    return false;    
  }


  return (
    <div className="space-y-2">
      <IKUpload
          fileName={fileType === "video" ? "video" : "image"}
          onError={onError}
          onUploadStart={handleStartUpload}
          onUploadProgress={handleProgress}
          onSuccess={handleSuccess}
          useUniqueFileName={true}
          validateFile={validateFile}
          className="file-input file-input-border w-full"
          folder={fileType === "video" ? "/videos" : "/images"}
        />
        {
            uploading && (
                <div className="flex items-center gap-2 text-sm text-primary">
                    <Loader2 className="animate-spin"/>
                    <span>Uploading ....</span>
                </div>
            )
        }
        {
            error && (
                <div className="flex items-center gap-2 text-sm text-error text-red-600">
                    <span>{error}</span>
                </div>
            )
        }
    </div>
  );
}
