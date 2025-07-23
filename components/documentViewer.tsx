// import React, { useState, useEffect } from 'react';
// import { X, File, Download, ChevronLeft, ChevronRight } from 'lucide-react';

// interface Document {
//   id: string;
//   name: string;
//   content: string | ArrayBuffer | null;
//   type: string;
// }

// interface DocumentViewerProps {
//   documents: Document[];
//   onClose: () => void;
// }

// const FileViewer = ({ file }: { file: Document }) => {
//   const [parsedContent, setParsedContent] = useState<string>('');

//   useEffect(() => {
//     if (file.content) {
//       if (typeof file.content === 'string') {
//         setParsedContent(file.content);
//       } else {
//         // Handle ArrayBuffer content
//         const decoder = new TextDecoder();
//         setParsedContent(decoder.decode(file.content));
//       }
//     }
//   }, [file]);

//   const getFileExtension = (filename: string) => {
//     return filename.split('.').pop()?.toLowerCase();
//   };

//   const renderCSVContent = (content: string) => {
//     const rows = content.split('\n');
//     return (
//       <div className="overflow-x-auto">
//         <table className="min-w-full border-collapse">
//           <tbody>
//             {rows.map((row, i) => (
//               <tr key={i} className={i === 0 ? 'bg-gray-100' : 'hover:bg-gray-50'}>
//                 {row.split(',').map((cell, j) => (
//                   <td key={j} className="border px-4 py-2 text-sm">
//                     {cell.trim()}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   const renderTextContent = (content: string) => {
//     return (
//       <div className="whitespace-pre-wrap font-mono text-sm p-4 bg-gray-50 rounded">
//         {content}
//       </div>
//     );
//   };

//   const renderContent = () => {
//     const extension = getFileExtension(file.name);

//     switch (extension) {
//       case 'csv':
//         return renderCSVContent(parsedContent);
//       case 'txt':
//       case 'json':
//       case 'js':
//       case 'ts':
//         return renderTextContent(parsedContent);
//       default:
//         if (file.type.startsWith('text/')) {
//           return renderTextContent(parsedContent);
//         }
//         return (
//           <div className="flex flex-col items-center justify-center h-full p-8 text-gray-500">
//             <File size={48} className="mb-4" />
//             <p>Preview not available for this file type</p>
//             <p className="text-sm mt-2">File type: {file.type}</p>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="h-full overflow-auto">
//       <div className="sticky top-0 bg-white border-b p-2 flex items-center justify-between">
//         <span className="font-medium">{file.name}</span>
//         <button 
//           className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-2"
//           onClick={() => {
//             // Create blob and download
//             const blob = new Blob([parsedContent], { type: 'text/plain' });
//             const url = URL.createObjectURL(blob);
//             const a = document.createElement('a');
//             a.href = url;
//             a.download = file.name;
//             a.click();
//             URL.revokeObjectURL(url);
//           }}
//         >
//           <Download size={14} />
//           Download
//         </button>
//       </div>
//       <div className="p-4">
//         {renderContent()}
//       </div>
//     </div>
//   );
// };

// const DocumentViewer: React.FC<DocumentViewerProps> = ({ documents, onClose }) => {
//   const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
//   const [isDragging, setIsDragging] = useState(false);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div 
//         className={`bg-white rounded-lg w-4/5 h-4/5 flex flex-col p-4 ${
//           isDragging ? 'cursor-grabbing' : 'cursor-default'
//         }`}
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Document Viewer</h2>
//           <button 
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <X size={20} />
//           </button>
//         </div>
        
//         <div className="flex h-full gap-4">
//           <div className="w-1/4 border-r pr-4 overflow-y-auto">
//             {documents.map((doc) => (
//               <div
//                 key={doc.id}
//                 onClick={() => setSelectedDoc(doc)}
//                 className={`p-2 cursor-pointer hover:bg-gray-100 rounded flex items-center gap-2 transition-colors ${
//                   selectedDoc?.id === doc.id ? 'bg-gray-100' : ''
//                 }`}
//               >
//                 <File size={16} />
//                 <span className="flex-1 truncate text-sm">{doc.name}</span>
//               </div>
//             ))}
//           </div>
          
//           <div className="flex-1 overflow-hidden border rounded-lg">
//             {selectedDoc ? (
//               <FileViewer file={selectedDoc} />
//             ) : (
//               <div className="flex flex-col items-center justify-center h-full text-gray-500">
//                 <File size={48} className="mb-4" />
//                 <p>Select a document to view</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default DocumentViewer;

// import React, { useState, useEffect } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import { X, File as FileIcon, ChevronLeft, ChevronRight } from "lucide-react";

// // Set up PDF.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";


// interface DocumentData {
//   id: string;
//   name: string;
//   content: ArrayBuffer | null;
// }

// const DocumentViewer: React.FC<{ documents: DocumentData[]; onClose: () => void }> = ({ documents, onClose }) => {
//   const [selectedDoc, setSelectedDoc] = useState<DocumentData | null>(documents[0] || null);
//   const [numPages, setNumPages] = useState<number | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [scale, setScale] = useState(1.0);
//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);

//   useEffect(() => {
//     if (selectedDoc?.content) {
//       const blob = new Blob([new Uint8Array(selectedDoc.content)], { type: "application/pdf" });
//       const url = URL.createObjectURL(blob);
//       setPdfUrl(url);

//       return () => {
//         URL.revokeObjectURL(url);
//       };
//     }
//   }, [selectedDoc]);

//   const nextPage = () => {
//     if (numPages && currentPage < numPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.0));
//   const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg w-11/12 h-5/6 flex flex-col p-4">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Document Viewer</h2>
//           <div className="flex items-center gap-4">
//             <button onClick={handleZoomOut} className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">-</button>
//             <span>{Math.round(scale * 100)}%</span>
//             <button onClick={handleZoomIn} className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">+</button>
//             <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
//               <X size={20} />
//             </button>
//           </div>
//         </div>

//         <div className="flex h-full">
//           {/* Sidebar - List of Documents */}
//           <div className="w-1/5 border-r pr-4 overflow-y-auto">
//             {documents.map((doc) => (
//               <div
//                 key={doc.id}
//                 onClick={() => {
//                   setSelectedDoc(doc);
//                   setCurrentPage(1);
//                 }}
//                 className={`p-2 cursor-pointer hover:bg-gray-100 rounded flex items-center ${
//                   selectedDoc?.id === doc.id ? "bg-gray-100" : ""
//                 }`}
//               >
//                 <FileIcon size={16} className="mr-2" />
//                 <span className="truncate">{doc.name}</span>
//               </div>
//             ))}
//           </div>

//           {/* Main Viewer */}
//           <div className="flex-1 pl-4 flex flex-col">
//             <div className="flex-1 overflow-auto flex justify-center">
//               {pdfUrl ? (
//                 <Document
//                   file={pdfUrl}
//                   onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//                   className="flex flex-col items-center"
//                 >
//                   <Page
//                     pageNumber={currentPage}
//                     scale={scale}
//                     className="shadow-lg"
//                   />
//                 </Document>
//               ) : (
//                 <div className="flex items-center justify-center text-gray-500">
//                   Select a document to view
//                 </div>
//               )}
//             </div>

//             {/* Pagination Controls */}
//             {numPages && numPages > 1 && (
//               <div className="flex items-center justify-center gap-4 mt-4 p-2 border-t">
//                 <button
//                   onClick={prevPage}
//                   disabled={currentPage <= 1}
//                   className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
//                 >
//                   <ChevronLeft size={20} />
//                 </button>
//                 <span>
//                   Page {currentPage} of {numPages}
//                 </span>
//                 <button
//                   onClick={nextPage}
//                   disabled={currentPage >= numPages}
//                   className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
//                 >
//                   <ChevronRight size={20} />
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DocumentViewer;




import React, { useState, useEffect } from "react";
import { FileText, X } from "lucide-react";

interface DocumentData {
  id: string;
  name: string;
  content: ArrayBuffer | null;
}

const DocumentViewer: React.FC<{ 
  documents?: DocumentData[]; 
  onClose: () => void 
}> = ({ 
  documents = [], // Provide default empty array
  onClose 
}) => {
  const [selectedDoc, setSelectedDoc] = useState<DocumentData | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize selected document when documents prop changes
  useEffect(() => {
    if (documents.length > 0 && !selectedDoc) {
      setSelectedDoc(documents[0]);
    }
  }, [documents,selectedDoc]);

  useEffect(() => {
    if (selectedDoc?.content) {
      setLoading(true);
      setError(null);
      try {
        // Clean up previous object URL
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }

        // Create new blob and object URL
        const blob = new Blob([selectedDoc.content], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setObjectUrl(url);
      } catch (err) {
        setError("Failed to load document");
        console.error("Error loading document:", err);
      } finally {
        setLoading(false);
      }
    }

    // Cleanup function
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [selectedDoc,objectUrl]);

  // If no documents are provided, show a message
  if (!documents.length) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Document Viewer</h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-gray-500">No documents available to view</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 h-5/6 flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Document Viewer</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex h-full">
          {/* Sidebar - List of Documents */}
          <div className="w-1/5 border-r pr-4 overflow-y-auto">
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`p-2 cursor-pointer hover:bg-gray-100 rounded flex items-center ${
                  selectedDoc?.id === doc.id ? "bg-gray-100" : ""
                }`}
              >
                <FileText size={16} className="mr-2" />
                <span className="truncate">{doc.name}</span>
              </div>
            ))}
          </div>

          {/* Main Viewer */}
          <div className="flex-1 pl-4 flex flex-col">
            <div className="flex-1 overflow-hidden bg-gray-50 rounded">
              {loading ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Loading document...
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full text-red-500">
                  {error}
                </div>
              ) : objectUrl ? (
                <iframe
                  src={`${objectUrl}#toolbar=0`}
                  className="w-full h-full border-0"
                  title="PDF document viewer"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a document to view
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;