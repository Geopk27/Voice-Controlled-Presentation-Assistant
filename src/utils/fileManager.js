// 文件大小格式化
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// 获取文件图标
export const getFileIcon = (type, IconComponents) => {
  const { FileText, Image, FileSpreadsheet } = IconComponents;
  if (type.startsWith('image/')) return <Image className="w-8 h-8 text-blue-500" />;
  if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
  if (type.includes('presentation') || type.includes('powerpoint')) return <FileSpreadsheet className="w-8 h-8 text-orange-500" />;
  return <FileText className="w-8 h-8 text-gray-500" />;
};
