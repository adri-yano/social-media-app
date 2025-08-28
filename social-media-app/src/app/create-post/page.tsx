"use client";

import { useState, useRef } from "react";
import { AiOutlineCamera, AiOutlineFileImage, AiOutlineClose } from "react-icons/ai";
import { BASE_URL } from "../../config"; // your backend base URL

const parseHashtags = (text: string) =>
  text.split(" ").filter((word) => word.startsWith("#"));

export default function CreatePostPage() {
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addImages(Array.from(e.target.files));
  };

  const addImages = (filesArray: File[]) => {
    setImages((prev) => [...prev, ...filesArray]);
    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setPreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) addImages(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCaption(e.target.value);
    setTags(parseHashtags(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) return alert("Please select at least one image.");

    try {
      // Step 1: Upload images to a free image host (example uses imgbb)
      const uploadedUrls: string[] = [];
      for (let img of images) {
        const formData = new FormData();
        formData.append("image", img);
        const res = await fetch("https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        uploadedUrls.push(data.data.url);
      }

      // Step 2: Send to your backend (one post per image, or array depending on backend)
      for (let url of uploadedUrls) {
        const response = await fetch(`${BASE_URL}/api/posts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: url,
            caption,
            tags,
          }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Post creation failed");
      }

      alert("Post(s) created successfully!");
      setCaption("");
      setImages([]);
      setPreviews([]);
      setTags([]);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Create a Post</h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Drag & Drop */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="flex flex-col items-center justify-center border-2 border-dashed border-purple-400 rounded-lg p-4 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <p className="text-gray-500 mb-2">Drag & drop images here or click to select</p>
            <div className="flex gap-4">
              <AiOutlineCamera size={24} className="text-purple-600" />
              <AiOutlineFileImage size={24} className="text-purple-600" />
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Previews */}
          {previews.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {previews.map((src, idx) => (
                <div key={idx} className="relative">
                  <img src={src} alt={`preview-${idx}`} className="w-20 h-20 object-cover rounded-lg border border-gray-300" />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    onClick={() => removeImage(idx)}
                  >
                    <AiOutlineClose size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Caption + Hashtags */}
          <div>
            <textarea
              placeholder="Write a caption... (#hashtags, @tags)"
              value={caption}
              onChange={handleCaptionChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 resize-none"
              rows={3}
            ></textarea>
            {tags.length > 0 && <p className="text-gray-600 mt-2 text-sm">Hashtags: {tags.join(", ")}</p>}
          </div>

          <button type="submit" className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition">Post</button>
        </form>
      </div>
    </div>
  );
}
