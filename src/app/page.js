"use client";
import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages, faTrashAlt, faUpload, faSearchPlus, faFilePdf, faFileWord, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import LoadingOverlay from "@/components/LoadingOverlay";
import Footer from "@/components/Footer";
import 'react-toastify/dist/ReactToastify.css';

const LoginButton = ({ onClick, href, children }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 mx-2 w-28 bg-blue-500 text-white rounded"
  >
    {children}
  </button>
);

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedFilesNum, setUploadedFilesNum] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [IP, setIP] = useState("");
  const [Total, setTotal] = useState("?");
  const [selectedOption, setSelectedOption] = useState("tgchannel");
  const [isAuthapi, setisAuthapi] = useState(false);
  const [Loginuser, setLoginuser] = useState("");
  const [boxType, setBoxtype] = useState("img");
  const [dragging, setDragging] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null); // file pdf xem trước

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const parentRef = useRef(null);
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    const filteredFiles = newFiles.filter(
      (file) => !selectedFiles.find((selFile) => selFile.name === file.name)
    );
    setSelectedFiles([...selectedFiles, ...filteredFiles]);
  };

  const handleClear = () => {
    setSelectedFiles([]);
    setUploadedImages([]);
    setUploadedFilesNum(0);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const filteredFiles = files.filter(
      (file) => !selectedFiles.find((selFile) => selFile.name === file.name)
    );
    setSelectedFiles([...selectedFiles, ...filteredFiles]);
    setDragging(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handlePaste = (event) => {
    const clipboardItems = event.clipboardData.items;
    for (let i = 0; i < clipboardItems.length; i++) {
      const item = clipboardItems[i];
      if (item.kind === "file" && item.type.includes("image")) {
        const file = item.getAsFile();
        setSelectedFiles([...selectedFiles, file]);
        break;
      }
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    const filesToUpload = selectedFiles;
    if (filesToUpload.length === 0) {
      toast.error("Vui lòng chọn file trước khi tải lên");
      setUploading(false);
      return;
    }

    let successCount = 0;

    try {
      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`/api/upload`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          file.url = result.url;

          setUploadedImages((prevImages) => [...prevImages, file]);
          setSelectedFiles((prevFiles) => prevFiles.filter((f) => f !== file));
          successCount++;
        } else {
          toast.error(`Lỗi upload file ${file.name}`);
        }
      }

      setUploadedFilesNum(uploadedFilesNum + successCount);
      toast.success(`Đã upload thành công ${successCount} file`);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi upload");
    } finally {
      setUploading(false);
    }
  };
  const handleImageClick = (file) => {
    if (file.type.startsWith("application/pdf")) {
      setSelectedPdf(URL.createObjectURL(file));
    } else if (file.type.startsWith("image/")) {
      setBoxType("img");
      setSelectedImage(URL.createObjectURL(file));
    } else if (file.type.startsWith("video/")) {
      setBoxType("video");
      setSelectedImage(URL.createObjectURL(file));
    } else {
      setBoxType("other");
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
    setSelectedPdf(null);
  };

  const renderFilePreview = (file, index) => {
    const fileType = file.type;

    if (fileType.startsWith("image/")) {
      return (
        <img
          key={index}
          src={URL.createObjectURL(file)}
          alt="preview"
          className="object-cover w-36 h-40 m-2 rounded-md cursor-pointer"
          onClick={() => handleImageClick(file)}
        />
      );
    } else if (fileType.startsWith("video/")) {
      return (
        <video
          key={index}
          src={URL.createObjectURL(file)}
          className="object-cover w-36 h-40 m-2 rounded-md cursor-pointer"
          controls
          onClick={() => handleImageClick(file)}
        />
      );
    } else if (fileType === "application/pdf") {
      return (
        <div
          key={index}
          className="w-36 h-40 m-2 bg-gray-200 flex items-center justify-center rounded-md cursor-pointer"
          onClick={() => handleImageClick(file)}
        >
          <FontAwesomeIcon icon={faFilePdf} size="2x" />
        </div>
      );
    } else if (fileType.includes("word")) {
      return (
        <div
          key={index}
          className="w-36 h-40 m-2 bg-gray-200 flex items-center justify-center rounded-md cursor-pointer"
        >
          <FontAwesomeIcon icon={faFileWord} size="2x" />
        </div>
      );
    } else if (fileType.includes("excel")) {
      return (
        <div
          key={index}
          className="w-36 h-40 m-2 bg-gray-200 flex items-center justify-center rounded-md cursor-pointer"
        >
          <FontAwesomeIcon icon={faFileExcel} size="2x" />
        </div>
      );
    } else {
      return (
        <div
          key={index}
          className="w-36 h-40 m-2 bg-gray-200 flex items-center justify-center rounded-md"
        >
          <span>File</span>
        </div>
      );
    }
  };
  return (
    <main className="overflow-auto h-full flex w-full min-h-screen flex-col items-center justify-between">
      {/* Header */}
      <header className="fixed top-0 h-[50px] left-0 w-full border-b bg-white flex z-50 justify-center items-center">
        <nav className="flex justify-between items-center w-full max-w-4xl px-4">
          HOME
        </nav>
      </header>

      {/* Main Content */}
      <div className="mt-[60px] w-full max-w-5xl px-4">
        {/* Drag & Drop Area */}
        <div
          className={`border-2 ${
            dragging ? "border-blue-500 bg-blue-50" : "border-dashed border-gray-400"
          } rounded-md p-6 mb-4`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onPaste={handlePaste}
        >
          <div className="flex flex-wrap justify-center gap-4">
            {selectedFiles.length > 0 ? (
              selectedFiles.map((file, index) => renderFilePreview(file, index))
            ) : (
              <div className="text-gray-400">
                Kéo và thả file vào đây hoặc click để chọn file
              </div>
            )}
          </div>
        </div>

        {/* Upload Buttons */}
        <div className="flex justify-center gap-4 mb-4">
          <label
            htmlFor="file-upload"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
          >
            <FontAwesomeIcon icon={faImages} className="mr-2" />
            Chọn file
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            onClick={handleClear}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
            Xóa
          </button>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`${
              uploading ? "bg-green-300" : "bg-green-500 hover:bg-green-600"
            } text-white px-4 py-2 rounded`}
          >
            <FontAwesomeIcon icon={faUpload} className="mr-2" />
            {uploading ? "Đang tải..." : "Tải lên"}
          </button>
        </div>

        {/* Tabs lọc file */}
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setActiveTab("all")} className={`px-4 py-2 rounded ${activeTab === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
            Tất cả
          </button>
          <button onClick={() => setActiveTab("image")} className={`px-4 py-2 rounded ${activeTab === "image" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
            Ảnh
          </button>
          <button onClick={() => setActiveTab("video")} className={`px-4 py-2 rounded ${activeTab === "video" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
            Video
          </button>
          <button onClick={() => setActiveTab("doc")} className={`px-4 py-2 rounded ${activeTab === "doc" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
            Tài liệu
          </button>
        </div>

        {/* Modal PDF Preview */}
        {selectedPdf && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg w-11/12 md:w-2/3 lg:w-1/2 relative">
              <button
                onClick={handleCloseImage}
                className="absolute top-2 right-2 text-red-500"
              >
                ✖
              </button>
              <iframe src={selectedPdf} className="w-full h-[80vh]" />
            </div>
          </div>
        )}

        {/* Modal Image/Video */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCloseImage}>
            <div className="relative flex flex-col items-center justify-center">
              {boxType === "img" && (
                <img src={selectedImage} alt="Selected" className="object-contain max-w-full max-h-screen" />
              )}
              {boxType === "video" && (
                <video src={selectedImage} controls className="object-contain max-w-full max-h-screen" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed inset-x-0 bottom-0 h-[50px] bg-gray-200 flex justify-center items-center">
        <Footer />
      </div>

      <ToastContainer />
    </main>
  );
}
