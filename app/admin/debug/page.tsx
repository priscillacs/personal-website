"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DebugPage() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testImage, setTestImage] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);

  useEffect(() => {
    // Simulate getting all uploaded images
    // In a real implementation, you would fetch this from an API
    fetch("/api/debug/images")
      .catch(() => {
        // This will fail since we don't have the API, but that's okay
        // In a real implementation, you would create this API endpoint
        const mockImages = [
          "/uploads/someimage1.jpg",
          "/uploads/someimage2.png",
        ];
        return { json: () => Promise.resolve({ images: mockImages }) };
      })
      .then((res) => res.json())
      .then((data) => {
        setUploadedImages(data.images || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching images:", err);
        setError("Failed to fetch images");
        setIsLoading(false);
      });
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setTestImage(file);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setUploadResult(result);

      if (response.ok) {
        setUploadedImages([...uploadedImages, result.url]);
      }
    } catch (err: any) {
      console.error("Error uploading image:", err);
      setUploadResult({ error: err.message });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Image Upload Debugging</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Test Image Upload</h2>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="border p-2 rounded"
          />
        </div>

        {uploadResult && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h3 className="font-medium mb-2">Upload Result:</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
              {JSON.stringify(uploadResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Test Image Rendering</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Normal Image Tag:</h3>
            <div className="p-4 bg-gray-50 rounded">
              {testImage ? (
                <div>
                  <p className="mb-2 text-sm">File: {testImage.name}</p>
                  {uploadResult?.url ? (
                    <img
                      src={uploadResult.url}
                      alt="Test upload"
                      className="max-w-full h-auto border"
                    />
                  ) : (
                    <p>Upload an image to test rendering</p>
                  )}
                </div>
              ) : (
                <p>Upload an image to test rendering</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Next.js Image Component:</h3>
            <div className="p-4 bg-gray-50 rounded">
              {testImage && uploadResult?.url ? (
                <div>
                  <p className="mb-2 text-sm">Path: {uploadResult.url}</p>
                  <div className="relative h-48 border">
                    {/* Use Next.js Image in a real implementation */}
                    <img
                      src={uploadResult.url}
                      alt="Test with Next.js Image"
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
              ) : (
                <p>Upload an image to test Next.js Image component</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">
          Previously Uploaded Images
        </h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : uploadedImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedImages.map((image, index) => (
              <div key={index} className="border rounded overflow-hidden">
                <img
                  src={image}
                  alt={`Uploaded image ${index}`}
                  className="w-full h-40 object-cover"
                />
                <div className="p-2 text-sm truncate">{image}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>No images found</p>
        )}
      </div>

      <div className="mt-8">
        <Link href="/admin" className="text-blue-600 hover:underline">
          Back to Admin
        </Link>
      </div>
    </div>
  );
}
