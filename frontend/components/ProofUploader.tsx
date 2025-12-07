"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";

export default function ProofUploader({ taskId, userId }: { taskId: string; userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  function handleFileSelect(f: File) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleUpload() {
    if (!file) return;

    setUploading(true);
    setProgress(10);

    const { url } = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/blob/upload",
      onUploadProgress: (p) => setProgress(Math.round(p * 100)),
    });

    setProgress(90);

    await fetch(`http://localhost:3001/tasks/${taskId}/proof`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        proofUrl: url,
        proofType: file.type.startsWith("video") ? "VIDEO" : "IMAGE",
      }),
    });

    setProgress(100);
    setUploading(false);

    alert("Proof uploaded successfully");
  }

  return (
    <div className="w-full max-w-xl mx-auto mt-10">
      <div
        className="border-2 border-dashed border-gray-500 rounded-xl p-8 text-center cursor-pointer hover:border-gray-300 transition"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const dropped = e.dataTransfer.files?.[0];
          if (dropped) handleFileSelect(dropped);
        }}
      >
        {!preview && (
          <div>
            <p className="text-gray-300 text-lg">Drag & drop proof here</p>
            <p className="text-gray-500 text-sm mt-2">or click to select a file</p>

            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              id="fileInput"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileSelect(f);
              }}
            />

            <button
              onClick={() => document.getElementById("fileInput")?.click()}
              className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Choose File
            </button>
          </div>
        )}

        {preview && (
          <div className="mt-4">
            {file?.type.startsWith("image") && (
              <img
                src={preview}
                alt="Preview"
                className="rounded-lg max-h-64 mx-auto shadow-lg"
              />
            )}

            {file?.type.startsWith("video") && (
              <video
                src={preview}
                controls
                className="rounded-lg max-h-64 mx-auto shadow-lg"
              />
            )}

            <p className="text-gray-400 mt-3">{file?.name}</p>
          </div>
        )}
      </div>

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition disabled:bg-gray-600"
        >
          {uploading ? "Uploading..." : "Upload Proof"}
        </button>
      )}

      {uploading && (
        <div className="mt-4 w-full bg-gray-800 rounded-full h-3 overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
