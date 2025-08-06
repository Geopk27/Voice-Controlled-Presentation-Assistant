import React, { useState, useRef } from 'react';
import { Upload, Trash2, Play, FileText, Image, FileSpreadsheet } from 'lucide-react';
import { formatFileSize, getFileIcon } from './utils/fileManager.js';
import PdfPreview from './components/PdfPreview.jsx';
import './index.css';

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    const newFiles = uploadedFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  const deleteFile = (idToDelete, event) => {
    event.stopPropagation(); // 防止点击删除时触发查看文件
    setFiles(prev => prev.filter(file => {
      if (file.id === idToDelete) {
        URL.revokeObjectURL(file.url); // 清理内存
        return false;
      }
      return true;
    }));
    if (selectedFile && selectedFile.id === idToDelete) {
      setSelectedFile(null); // 如果删除的是正在预览的文件，则关闭预览
    }
  };

  const viewFile = (file) => {
    setSelectedFile(file);
  };

  const renderFilePreview = () => {
    if (!selectedFile) return null;

    if (selectedFile.type.startsWith('image/')) {
      return <img src={selectedFile.url} alt={selectedFile.name} className="max-w-full max-h-[80vh] rounded-lg" />;
    }

    if (selectedFile.type.includes('pdf')) {
      return <PdfPreview fileUrl={selectedFile.url} />;
    }
    
    // 对于PPT等其他文件，提供下载链接
    return (
        <div className="text-center p-10 bg-gray-100 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Preview not available for this file type.</h3>
            <a
                href={selectedFile.url}
                download={selectedFile.name}
                className="inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
                Download {selectedFile.name}
            </a>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-gray-800">AI Presentation Assistant</h1>
          <p className="text-gray-600">Upload your files and control them with your voice.</p>
        </div>
      </header>

      <main className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* File Management Column */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg">
          <button
            onClick={triggerFileUpload}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md mb-6"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Files</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*,.pdf,.ppt,.pptx"
            className="hidden"
          />

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Your Files ({files.length})</h2>
            {files.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No files uploaded yet.</p>
            ) : (
              <ul className="max-h-[60vh] overflow-y-auto pr-2">
                {files.map(file => (
                  <li
                    key={file.id}
                    onClick={() => viewFile(file)}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    {getFileIcon(file.type, { FileText, Image, FileSpreadsheet })}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    <button onClick={(e) => deleteFile(file.id, e)} className="text-gray-400 hover:text-red-500 p-1 rounded-full">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* File Preview Column */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg flex items-center justify-center min-h-[70vh]">
          {selectedFile ? (
            <div className="w-full">
               <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700 truncate">{selectedFile.name}</h2>
                    <button onClick={() => setSelectedFile(null)} className="text-gray-600 font-bold py-1 px-3 rounded-lg hover:bg-gray-200">Close</button>
               </div>
               {renderFilePreview()}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <Image size={64} className="mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-semibold">Select a file to preview</h2>
              <p>Click on a file from the list on the left.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
