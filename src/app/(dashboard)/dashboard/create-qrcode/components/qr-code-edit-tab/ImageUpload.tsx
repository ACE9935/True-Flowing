"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { storage } from "@/firebase/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Edit } from "@mui/icons-material";

function ImageUpload({
  setUrl,
  url,
  setImage,
}: {
  setUrl: (url: string) => void;
  url: string;
  setImage: any;
}) {
  const [image, setImagex] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      const imageUrl = URL.createObjectURL(selectedImage);
      setUrl(imageUrl);
    }
  };

  const handleUpload = () => {
    if (!image) return;

    const storageRef = ref(storage, `logos/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },
      (error) => {
        console.error("Upload error:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUrl(downloadURL);
        });
      }
    );
  };

  useEffect(() => {
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [url]);

  return (
    <div className="flex flex-col items-center justify-center p-2">
      {/* Image Preview */}

      {/* Hidden Input and Button */}
      <input
        onChange={handleChange}
        type="file"
        id="logoInput"
        className="opacity-0 absolute w-0 h-0"
      />
      <label
        htmlFor="logoInput"
        className="rounded-full flex items-center justify-center hover:bg-primary-color hover:text-white transition-all bg-slate-200 p-3 cursor-pointer"
      >
        <Edit fontSize="small" />
        
      </label>
    </div>
  );
}

export default ImageUpload;


