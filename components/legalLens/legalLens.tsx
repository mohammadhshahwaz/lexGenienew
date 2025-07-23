// "use client"


// import React, { useState, DragEvent, ChangeEvent } from "react";
// import {  X, Upload, File } from "lucide-react";
// import mammoth from "mammoth";
// import * as PDFJS from 'pdfjs-dist';
// import Returnpage from "./returnpage";

// // Initialize PDF.js worker
// PDFJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

// interface Issues {
//   grammar: number;
//   punctuation: number;
//   terminology: number;
//   citation: number;
// }

// interface Suggestion {
//   text: string;
//   replacement: string;
//   type: string;
//   index: number;
// }

// const LegalDocumentAnalyzer = () => {
//   const [content, setContent] = useState<string>("");
//   // const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
//   const [file, setFile] = useState<File | null>(null);
//   const [dragActive, setDragActive] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [issues, setIssues] = useState<Issues>({
//     grammar: 0,
//     punctuation: 0,
//     terminology: 0,
//     citation: 0,
//   });
//   const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
//   const [currentSuggestionIndex,] = useState<number>(0);

//   const handleDrag = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       const file = e.dataTransfer.files[0];
//       setFile(file);
//       await processFile(file);
//     }
//   };

//   const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setFile(file);
//       await processFile(file);
//     }
//   };

//   const processFile = async (file: File) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const text = await extractTextFromFile(file);
//       setContent(text);
//       analyzeDocument(text);
//     } catch (err) {
//       setError(`Error processing file: ${err instanceof Error ? err.message : 'Unknown error'}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const extractTextFromFile = async (file: File): Promise<string> => {
//     const fileType = file.name.split('.').pop()?.toLowerCase();

//     switch (fileType) {
//       case 'txt':
//         return await readTxtFile(file);

//       case 'docx':
//         return await readDocxFile(file);

//       case 'pdf':
//         return await readPdfFile(file);

//       case 'doc':
//         throw new Error('DOC format is not supported. Please convert to DOCX.');

//       default:
//         throw new Error('Unsupported file format. Please upload TXT, DOCX, or PDF files.');
//     }
//   };

//   const readTxtFile = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = (e) => resolve(e.target?.result as string);
//       reader.onerror = () => reject(new Error('Error reading text file'));
//       reader.readAsText(file);
//     });
//   };

//   const readDocxFile = async (file: File): Promise<string> => {
//     const arrayBuffer = await file.arrayBuffer();
//     const result = await mammoth.extractRawText({ arrayBuffer });
//     return result.value;
//   };

//   const readPdfFile = async (file: File): Promise<string> => {
//     const arrayBuffer = await file.arrayBuffer();
//     const pdf = await PDFJS.getDocument({ data: arrayBuffer }).promise;

//     let fullText = '';
//     for (let i = 1; i <= pdf.numPages; i++) {
//       const page = await pdf.getPage(i);
//       const textContent = await page.getTextContent();
//       const pageText = textContent.items.map((item: any) => item.str).join(' ');
//       fullText += pageText + '\n';
//     }

//     return fullText;
//   };

//   // Simple document analysis function
//   const analyzeDocument = (text: string) => {
//     setIsLoading(true);

//     // Simulate processing delay
//     setTimeout(() => {
//       const newSuggestions: Suggestion[] = [];
//       const newIssues = { grammar: 0, punctuation: 0, terminology: 0, citation: 0 };

//       // Simple grammar checks
//       const sentences = text.split(/[.!?]+/);
//       sentences.forEach((sentence, ) => {
//         // Double words
//         const words = sentence.trim().split(/\s+/);
//         words.forEach((word, wordIdx) => {
//           if (word === words[wordIdx - 1]) {
//             newSuggestions.push({
//               text: `${word} ${word}`,
//               replacement: word,
//               type: "grammar",
//               index: text.indexOf(`${word} ${word}`)
//             });
//             newIssues.grammar++;
//           }
//         });

//         // Missing capitalization
//         if (sentence.trim().length > 0 && sentence.trim()[0] !== sentence.trim()[0].toUpperCase()) {
//           newSuggestions.push({
//             text: sentence.trim(),
//             replacement: sentence.trim()[0].toUpperCase() + sentence.trim().slice(1),
//             type: "grammar",
//             index: text.indexOf(sentence.trim())
//           });
//           newIssues.grammar++;
//         }
//       });

//       // Simple punctuation checks
//       const matches = text.match(/\s+[,.!?]/g) || [];
//       matches.forEach(match => {
//         newSuggestions.push({
//           text: match,
//           replacement: match.trim(),
//           type: "punctuation",
//           index: text.indexOf(match)
//         });
//         newIssues.punctuation++;
//       });

//       // Legal terminology checks (simplified example)
//       const legalTerms = {
//         'due to': 'because of',
//         'prior to': 'before',
//         'subsequent to': 'after',
//         'in order to': 'to'
//       };

//       Object.entries(legalTerms).forEach(([term, suggestion]) => {
//         const regex = new RegExp(term, 'gi');
//         let match;
//         while ((match = regex.exec(text)) !== null) {
//           newSuggestions.push({
//             text: match[0],
//             replacement: suggestion,
//             type: "terminology",
//             index: match.index
//           });
//           newIssues.terminology++;
//         }
//       });

//       setIssues(newIssues);
//       setSuggestions(newSuggestions);
//       setIsLoading(false);
//     }, 1000);
//   };

//   const handleSuggestionAction = (action: 'accept' | 'reject' | 'edit', userEdit?: string) => {
//     const suggestion = suggestions[currentSuggestionIndex];
//     if (!suggestion) return;

//     let newContent = content;
//     if (action === 'accept') {
//       newContent = content.slice(0, suggestion.index) + 
//                   suggestion.replacement + 
//                   content.slice(suggestion.index + suggestion.text.length);
//     } else if (action === 'edit' && userEdit) {
//       newContent = content.slice(0, suggestion.index) + 
//                   userEdit + 
//                   content.slice(suggestion.index + suggestion.text.length);
//     }

//     setContent(newContent);

//     // Remove the current suggestion and move to the next one
//     const newSuggestions = suggestions.filter((_, idx) => idx !== currentSuggestionIndex);
//     setSuggestions(newSuggestions);

//     // Update issues count
//     setIssues(prev => ({
//       ...prev,
//       [suggestion.type]: Math.max(0, prev[suggestion.type as keyof Issues] - 1)
//     }));
//   };


//   return (
//    <div className="min-h-screen bg-gray-50 p-4">
//     <Returnpage/>
//     <div className="">
//     <h1 className="text-3xl my-4 text-bold">Legal Lens</h1>
//     </div>
//       {error && (
//         <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
//           {error}
//           <button onClick={() => setError(null)} className="float-right">
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
//         {/* Upload Section - 2 columns on large screens */}
//         <div className="lg:col-span-2">
//           <div
//             className={`p-6 border-2 border-dashed rounded-lg ${
//               dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
//             }`}
//             onDragEnter={handleDrag}
//             onDragLeave={handleDrag}
//             onDragOver={handleDrag}
//             onDrop={handleDrop}
//           >
//             <div className="flex flex-col items-center space-y-4 text-wrap">
//               <Upload className="w-12 h-12 text-gray-400" />
//               {file ? (
//                 <div className="flex items-center space-x-2">
//                   <File className="w-5 h-5 text-blue-500 shrink-0" />
//                   <span className="text-gray-700 text-sm truncate max-w-[150px] text-wrap">{file.name}</span>
//                   <button 
//                     onClick={() => setFile(null)} 
//                     className="p-1 hover:bg-gray-200 rounded-full"
//                   >
//                     <X className="w-4 h-4 text-gray-500" />
//                   </button>
//                 </div>
//               ) : (
//                 <div className="text-gray-600 text-center text-sm">
//                   <p>Drag and drop your document here</p>
//                   <p>or</p>
//                   <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
//                     browse
//                     <input 
//                       type="file" 
//                       className="hidden" 
//                       onChange={handleFileChange} 
//                       accept=".doc,.docx,.pdf,.txt" 
//                     />
//                   </label>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Text Area Section - 7 columns on large screens */}
//         <div className="lg:col-span-7">
//           <textarea
//             value={content}
//             onChange={(e) => {
//               setContent(e.target.value);
//               analyzeDocument(e.target.value);
//             }}
//             className="w-full h-[calc(100vh-120px)] p-4 border rounded-lg resize-none"
//             placeholder="Or type/paste your text here..."
//             disabled={isLoading}
//           />
//         </div>

//         {/* Issues and Suggestions Section - 3 columns on large screens */}
//         <div className="lg:col-span-3 space-y-4">
//           {/* Issues Summary */}
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="font-semibold mb-3 text-gray-700">Issues Summary</h3>
//             <div className="space-y-2">
//               <div className="flex justify-between items-center">
//                 <span className="text-blue-600">Grammar</span>
//                 <span className="font-semibold">{issues.grammar}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-green-600">Punctuation</span>
//                 <span className="font-semibold">{issues.punctuation}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-orange-600">Terminology</span>
//                 <span className="font-semibold">{issues.terminology}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-red-600">Citation</span>
//                 <span className="font-semibold">{issues.citation}</span>
//               </div>
//             </div>
//           </div>

//           {/* Current Suggestion */}
//           {suggestions[currentSuggestionIndex] && (
//             <div className="bg-white p-4 rounded-lg shadow">
//               <h3 className="font-semibold mb-3 text-gray-700">Current Suggestion</h3>
//               <div className="space-y-4">
//                 <div>
//                   <p className="text-sm text-gray-600">Replace:</p>
//                   <p className="text-red-500 line-through">
//                     {suggestions[currentSuggestionIndex].text}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">With:</p>
//                   <p className="text-green-500">
//                     {suggestions[currentSuggestionIndex].replacement}
//                   </p>
//                 </div>
//                 <div className="flex flex-col space-y-2">
//                   <button 
//                     onClick={() => handleSuggestionAction('accept')}
//                     className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//                   >
//                     Accept
//                   </button>
//                   <button 
//                     onClick={() => handleSuggestionAction('reject')}
//                     className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//                   >
//                     Reject
//                   </button>
//                   <button 
//                     onClick={() => {
//                       const userEdit = prompt("Enter your correction:");
//                       if (userEdit) handleSuggestionAction('edit', userEdit);
//                     }}
//                     className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
//                   >
//                     Edit
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LegalDocumentAnalyzer;




// "use client"

// import React, { useState, DragEvent, ChangeEvent, useRef, useEffect } from "react";
// import { X, Upload, File } from "lucide-react";
// import mammoth from "mammoth";
// import * as PDFJS from 'pdfjs-dist';
// import Returnpage from "../returnpage";
// import DOMPurify from "dompurify";
// // Initialize PDF.js worker
// PDFJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

// interface Issues {
//   grammar: number;
//   punctuation: number;
//   terminology: number;
//   citation: number;
// }

// interface Suggestion {
//   text: string;
//   replacement: string;
//   type: string;
//   index: number;
// }

// const LegalDocumentAnalyzer = () => {
//   const [content, setContent] = useState<string>("");
//   const [file, setFile] = useState<File | null>(null);
//   const [dragActive, setDragActive] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [issues, setIssues] = useState<Issues>({
//     grammar: 0,
//     punctuation: 0,
//     terminology: 0,
//     citation: 0,
//   });
//   const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
//   const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState<number>(0);
//   const [highlightedContent, setHighlightedContent] = useState<string>("");


//   const textAreaRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (content && suggestions.length > 0) {
//       generateHighlightedContent();
//     } else {
//       setHighlightedContent(content);
//     }
//   }, [content, suggestions, currentSuggestionIndex]);

//   const generateHighlightedContent = () => {
//     if (!content) return;

//     // Create a copy of the content for highlighting
//     let highlightedHTML = content;

//     // We'll process suggestions in reverse order (from end to start)
//     // to avoid index shifting issues when we insert HTML
//     const sortedSuggestions = [...suggestions].sort((a, b) => b.index - a.index);

//     sortedSuggestions.forEach((suggestion, idx) => {
//       const isCurrent = suggestions.indexOf(suggestion) === currentSuggestionIndex;
//       const start = suggestion.index;
//       const end = suggestion.index + suggestion.text.length;

//       // Get color based on issue type
//       let color = "red";
//       switch (suggestion.type) {
//         case "grammar":
//           color = "blue";
//           break;
//         case "punctuation":
//           color = "green";
//           break;
//         case "terminology":
//           color = "orange";
//           break;
//         case "citation":
//           color = "red";
//           break;
//       }

//       // Add highlight with appropriate color
//       // Make current suggestion more prominent
//       const highlightClass = isCurrent 
//         ? `background-color: ${color}; color: white; padding: 2px; border-radius: 2px;` 
//         : `border-bottom: 2px solid ${color};`;

//       const before = highlightedHTML.substring(0, start);
//       const target = highlightedHTML.substring(start, end);
//       const after = highlightedHTML.substring(end);

//       highlightedHTML = `${before}<span style="${highlightClass}" data-suggestion-index="${idx}">${target}</span>${after}`;
//     });

//     setHighlightedContent(highlightedHTML);
//   };

//   const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
//     // Get plain text from the contentEditable div
//     const newContent = e.currentTarget.innerText || "";
//     setContent(newContent);
//     analyzeDocument(newContent);
//   };

//   const handleDrag = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       const file = e.dataTransfer.files[0];
//       setFile(file);
//       await processFile(file);
//     }
//   };

//   const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setFile(file);
//       await processFile(file);
//     }
//   };

//   const processFile = async (file: File) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const text = await extractTextFromFile(file);
//       setContent(text);
//       analyzeDocument(text);
//     } catch (err) {
//       setError(`Error processing file: ${err instanceof Error ? err.message : 'Unknown error'}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const extractTextFromFile = async (file: File): Promise<string> => {
//     const fileType = file.name.split('.').pop()?.toLowerCase();

//     switch (fileType) {
//       case 'txt':
//         return await readTxtFile(file);

//       case 'docx':
//         return await readDocxFile(file);

//       case 'pdf':
//         return await readPdfFile(file);

//       case 'doc':
//         throw new Error('DOC format is not supported. Please convert to DOCX.');

//       default:
//         throw new Error('Unsupported file format. Please upload TXT, DOCX, or PDF files.');
//     }
//   };

//   const readTxtFile = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = (e) => resolve(e.target?.result as string);
//       reader.onerror = () => reject(new Error('Error reading text file'));
//       reader.readAsText(file);
//     });
//   };

//   const readDocxFile = async (file: File): Promise<string> => {
//     const arrayBuffer = await file.arrayBuffer();
//     const result = await mammoth.extractRawText({ arrayBuffer });
//     return result.value;
//   };

//   const readPdfFile = async (file: File): Promise<string> => {
//     const arrayBuffer = await file.arrayBuffer();
//     const pdf = await PDFJS.getDocument({ data: arrayBuffer }).promise;

//     let fullText = '';
//     for (let i = 1; i <= pdf.numPages; i++) {
//       const page = await pdf.getPage(i);
//       const textContent = await page.getTextContent();
//       const pageText = textContent.items.map((item: any) => item.str).join(' ');
//       fullText += pageText + '\n';
//     }

//     return fullText;
//   };

//   // Document analysis function
//   const analyzeDocument = (text: string) => {
//     setIsLoading(true);

//     // Simulate processing delay
//     setTimeout(() => {
//       const newSuggestions: Suggestion[] = [];
//       const newIssues = { grammar: 0, punctuation: 0, terminology: 0, citation: 0 };

//       // Simple grammar checks
//       const sentences = text.split(/[.!?]+/);
//       sentences.forEach((sentence) => {
//         // Double words
//         const words = sentence.trim().split(/\s+/);
//         words.forEach((word, wordIdx) => {
//           if (word === words[wordIdx - 1]) {
//             newSuggestions.push({
//               text: `${word} ${word}`,
//               replacement: word,
//               type: "grammar",
//               index: text.indexOf(`${word} ${word}`)
//             });
//             newIssues.grammar++;
//           }
//         });

//         // Missing capitalization
//         if (sentence.trim().length > 0 && sentence.trim()[0] !== sentence.trim()[0].toUpperCase()) {
//           newSuggestions.push({
//             text: sentence.trim(),
//             replacement: sentence.trim()[0].toUpperCase() + sentence.trim().slice(1),
//             type: "grammar",
//             index: text.indexOf(sentence.trim())
//           });
//           newIssues.grammar++;
//         }
//       });

//       // Simple punctuation checks
//       const matches = text.match(/\s+[,.!?]/g) || [];
//       matches.forEach(match => {
//         newSuggestions.push({
//           text: match,
//           replacement: match.trim(),
//           type: "punctuation",
//           index: text.indexOf(match)
//         });
//         newIssues.punctuation++;
//       });

//       // Legal terminology checks (simplified example)
//       const legalTerms = {
//         'due to': 'because of',
//         'prior to': 'before',
//         'subsequent to': 'after',
//         'in order to': 'to'
//       };

//       Object.entries(legalTerms).forEach(([term, suggestion]) => {
//         const regex = new RegExp(term, 'gi');
//         let match;
//         while ((match = regex.exec(text)) !== null) {
//           newSuggestions.push({
//             text: match[0],
//             replacement: suggestion,
//             type: "terminology",
//             index: match.index
//           });
//           newIssues.terminology++;
//         }
//       });

//       setIssues(newIssues);
//       setSuggestions(newSuggestions);
//       setCurrentSuggestionIndex(0);
//       setIsLoading(false);
//     }, 1000);
//   };

//   const handleSuggestionAction = (action: 'accept' | 'reject' | 'edit', userEdit?: string) => {
//     const suggestion = suggestions[currentSuggestionIndex];
//     if (!suggestion) return;

//     let newContent = content;
//     if (action === 'accept') {
//       newContent = content.slice(0, suggestion.index) + 
//                   suggestion.replacement + 
//                   content.slice(suggestion.index + suggestion.text.length);
//     } else if (action === 'edit' && userEdit) {
//       newContent = content.slice(0, suggestion.index) + 
//                   userEdit + 
//                   content.slice(suggestion.index + suggestion.text.length);
//     }

//     setContent(newContent);

//     // Remove the current suggestion
//     const newSuggestions = suggestions.filter((_, idx) => idx !== currentSuggestionIndex);
//     setSuggestions(newSuggestions);

//     // Move to the next suggestion or reset if there are no more
//     if (newSuggestions.length > 0) {
//       setCurrentSuggestionIndex(Math.min(currentSuggestionIndex, newSuggestions.length - 1));
//     } else {
//       setCurrentSuggestionIndex(0);
//     }

//     // Update issues count
//     setIssues(prev => ({
//       ...prev,
//       [suggestion.type]: Math.max(0, prev[suggestion.type as keyof Issues] - 1)
//     }));
//   };

//   const handleHighlightClick = (e: React.MouseEvent) => {
//     // Check if the click was on a suggestion highlight
//     const target = e.target as HTMLElement;
//     if (target.hasAttribute('data-suggestion-index')) {
//       const index = parseInt(target.getAttribute('data-suggestion-index') || "0", 10);
//       // Find the corresponding suggestion and set it as current
//       const suggestionIndex = suggestions.findIndex((_, idx) => idx === index);
//       if (suggestionIndex !== -1) {
//         setCurrentSuggestionIndex(suggestionIndex);
//       }
//     }
//   };

//   return (
//    <div className="min-h-screen bg-gray-50 p-4">
//     <Returnpage/>
//     <div className="">
//     <h1 className="text-3xl my-4 font-bold">Legal Lens</h1>
//     </div>
//       {error && (
//         <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
//           {error}
//           <button onClick={() => setError(null)} className="float-right">
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
//         {/* Upload Section - 2 columns on large screens */}
//         <div className="lg:col-span-2">
//           <div
//             className={`p-6 border-2 border-dashed rounded-lg ${
//               dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
//             }`}
//             onDragEnter={handleDrag}
//             onDragLeave={handleDrag}
//             onDragOver={handleDrag}
//             onDrop={handleDrop}
//           >
//             <div className="flex flex-col items-center space-y-4 text-wrap">
//               <Upload className="w-12 h-12 text-gray-400" />
//               {file ? (
//                 <div className="flex items-center space-x-2">
//                   <File className="w-5 h-5 text-blue-500 shrink-0" />
//                   <span className="text-gray-700 text-sm truncate max-w-[150px] text-wrap">{file.name}</span>
//                   <button 
//                     onClick={() => setFile(null)} 
//                     className="p-1 hover:bg-gray-200 rounded-full"
//                   >
//                     <X className="w-4 h-4 text-gray-500" />
//                   </button>
//                 </div>
//               ) : (
//                 <div className="text-gray-600 text-center text-sm">
//                   <p>Drag and drop your document here</p>
//                   <p>or</p>
//                   <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
//                     browse
//                     <input 
//                       type="file" 
//                       className="hidden" 
//                       onChange={handleFileChange} 
//                       accept=".doc,.docx,.pdf,.txt" 
//                     />
//                   </label>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Text Area Section - 7 columns on large screens */}
//         <div className="lg:col-span-7">
//           {/* Replace textarea with a contentEditable div for highlighting */}
//           <div 
//             ref={textAreaRef}
//             className="w-full h-[calc(100vh-120px)] p-4 border rounded-lg overflow-auto bg-white"
//             style={{ 
//               whiteSpace: 'pre-wrap', 
//               wordBreak: 'break-word',
//               lineHeight: '1.5'
//             }}
//           >
//             {suggestions.length > 0 ? (
//               <div
//               // contentEditable={!isLoading}
//               onInput={handleContentChange}
//               onClick={handleHighlightClick}
//               dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(highlightedContent) }}
//               className="outline-none min-h-full"
//             />

//             ) : (
//               <div 
//                 // contentEditable={!isLoading}
//                 onInput={handleContentChange}
//                 className="outline-none min-h-full"
//                 // placeholder="Or type/paste your text here..."
//               >
//                 {content}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Issues and Suggestions Section - 3 columns on large screens */}
//         <div className="lg:col-span-3 space-y-4">
//           {/* Issues Summary */}
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="font-semibold mb-3 text-gray-700">Issues Summary</h3>
//             <div className="space-y-2">
//               <div className="flex justify-between items-center">
//                 <span className="text-blue-600">Grammar</span>
//                 <span className="font-semibold">{issues.grammar}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-green-600">Punctuation</span>
//                 <span className="font-semibold">{issues.punctuation}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-orange-600">Terminology</span>
//                 <span className="font-semibold">{issues.terminology}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-red-600">Citation</span>
//                 <span className="font-semibold">{issues.citation}</span>
//               </div>
//             </div>
//           </div>

//           {/* Current Suggestion */}
//           {suggestions[currentSuggestionIndex] && (
//             <div className="bg-white p-4 rounded-lg shadow">
//               <h3 className="font-semibold mb-3 text-gray-700">Current Suggestion</h3>
//               <div className="space-y-4">
//                 <div>
//                   <p className="text-sm text-gray-600">Replace:</p>
//                   <p className="text-red-500 line-through">
//                     {suggestions[currentSuggestionIndex].text}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">With:</p>
//                   <p className="text-green-500">
//                     {suggestions[currentSuggestionIndex].replacement}
//                   </p>
//                 </div>
//                 <div className="flex flex-col space-y-2">
//                   <button 
//                     onClick={() => handleSuggestionAction('accept')}
//                     className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//                   >
//                     Accept
//                   </button>
//                   <button 
//                     onClick={() => handleSuggestionAction('reject')}
//                     className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//                   >
//                     Reject
//                   </button>
//                   <button 
//                     onClick={() => {
//                       const userEdit = prompt("Enter your correction:");
//                       if (userEdit) handleSuggestionAction('edit', userEdit);
//                     }}
//                     className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
//                   >
//                     Edit
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Navigation buttons for suggestions */}
//           {suggestions.length > 1 && (
//             <div className="bg-white p-4 rounded-lg shadow">
//               <div className="flex justify-between">
//                 <button 
//                   onClick={() => setCurrentSuggestionIndex(prev => Math.max(0, prev - 1))}
//                   className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
//                   disabled={currentSuggestionIndex === 0}
//                 >
//                   Previous
//                 </button>
//                 <span className="text-sm text-gray-600">
//                   {currentSuggestionIndex + 1} of {suggestions.length}
//                 </span>
//                 <button 
//                   onClick={() => setCurrentSuggestionIndex(prev => Math.min(suggestions.length - 1, prev + 1))}
//                   className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
//                   disabled={currentSuggestionIndex === suggestions.length - 1}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LegalDocumentAnalyzer;




// LegalDocumentAnalyzer.tsx


"use client"

// import React, { useState, useEffect } from "react";
// import PageHeader from "../legalLens/PageHeader";
// import ErrorMessage from "../legalLens/ErrorMessage";
// import UploadSection from "../legalLens/UploadSection";
// import DocumentEditor from "../legalLens/DocumentEditor";
// import SuggestionPanel from "../legalLens/SuggestionPanel";
// import { extractTextFromFile, analyzeText, generateHighlightedContent } from "../utils/documentUtils";
// import { Issues, Suggestion } from "./types";

// const LegalDocumentAnalyzer: React.FC = () => {
//   const [content, setContent] = useState<string>("");
//   const [file, setFile] = useState<File | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [issues, setIssues] = useState<Issues>({
//     grammar: 0,
//     punctuation: 0,
//     terminology: 0,
//     citation: 0,
//   });
//   const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
//   const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState<number>(0);
//   const [highlightedContent, setHighlightedContent] = useState<string>("");

//   useEffect(() => {
//     if (content && suggestions.length > 0) {
//       setHighlightedContent(generateHighlightedContent(content, suggestions, currentSuggestionIndex));
//     } else {
//       setHighlightedContent(content);
//     }
//   }, [content, suggestions, currentSuggestionIndex]);

//   const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
//     // Get plain text from the contentEditable div
//     const newContent = e.currentTarget.innerText || "";
//     setContent(newContent);
//     analyzeDocument(newContent);
//   };

//   const handleHighlightClick = (e: React.MouseEvent) => {
//     // Check if the click was on a suggestion highlight
//     const target = e.target as HTMLElement;
//     if (target.hasAttribute('data-suggestion-index')) {
//       const index = parseInt(target.getAttribute('data-suggestion-index') || "0", 10);
//       // Find the corresponding suggestion and set it as current
//       const suggestionIndex = suggestions.findIndex((_, idx) => idx === index);
//       if (suggestionIndex !== -1) {
//         setCurrentSuggestionIndex(suggestionIndex);
//       }
//     }
//   };

//   const processFile = async (file: File) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const text = await extractTextFromFile(file);
//       setContent(text);
//       analyzeDocument(text);
//     } catch (err) {
//       setError(`Error processing file: ${err instanceof Error ? err.message : 'Unknown error'}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const analyzeDocument = (text: string) => {
//     setIsLoading(true);

//     // Simulate processing delay
//     setTimeout(() => {
//       const { suggestions: newSuggestions, issues: newIssues } = analyzeText(text);

//       setIssues(newIssues);
//       setSuggestions(newSuggestions);
//       setCurrentSuggestionIndex(0);
//       setIsLoading(false);
//     }, 1000);
//   };

//   const handleSuggestionAction = (action: 'accept' | 'reject' | 'edit', userEdit?: string) => {
//     const suggestion = suggestions[currentSuggestionIndex];
//     if (!suggestion) return;

//     let newContent = content;
//     if (action === 'accept') {
//       newContent = content.slice(0, suggestion.index) + 
//                 suggestion.replacement + 
//                 content.slice(suggestion.index + suggestion.text.length);
//     } else if (action === 'edit' && userEdit) {
//       newContent = content.slice(0, suggestion.index) + 
//                 userEdit + 
//                 content.slice(suggestion.index + suggestion.text.length);
//     }

//     setContent(newContent);

//     // Remove the current suggestion
//     const newSuggestions = suggestions.filter((_, idx) => idx !== currentSuggestionIndex);
//     setSuggestions(newSuggestions);

//     // Move to the next suggestion or reset if there are no more
//     if (newSuggestions.length > 0) {
//       setCurrentSuggestionIndex(Math.min(currentSuggestionIndex, newSuggestions.length - 1));
//     } else {
//       setCurrentSuggestionIndex(0);
//     }

//     // Update issues count
//     setIssues(prev => ({
//       ...prev,
//       [suggestion.type]: Math.max(0, prev[suggestion.type as keyof Issues] - 1)
//     }));
//   };

//   const handleNavigatePrevious = () => {
//     setCurrentSuggestionIndex(prev => Math.max(0, prev - 1));
//   };

//   const handleNavigateNext = () => {
//     setCurrentSuggestionIndex(prev => Math.min(suggestions.length - 1, prev + 1));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <PageHeader />

//       <ErrorMessage 
//         error={error} 
//         onClear={() => setError(null)} 
//       />

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
//         {/* Upload Section - 2 columns on large screens */}
//         <div className="lg:col-span-2">
//           <UploadSection 
//             onFileProcess={processFile}
//             currentFile={file}
//             setFile={setFile}
//           />
//         </div>

//         {/* Text Area Section - 7 columns on large screens */}
//         <div className="lg:col-span-7">
//           <DocumentEditor 
//             content={content}
//             highlightedContent={highlightedContent}
//             suggestions={suggestions}
//             isLoading={isLoading}
//             onContentChange={handleContentChange}
//             onHighlightClick={handleHighlightClick}
//           />
//         </div>

//         {/* Issues and Suggestions Section - 3 columns on large screens */}
//         <SuggestionPanel 
//           issues={issues}
//           suggestions={suggestions}
//           currentSuggestionIndex={currentSuggestionIndex}
//           onSuggestionAction={handleSuggestionAction}
//           onNavigatePrevious={handleNavigatePrevious}
//           onNavigateNext={handleNavigateNext}
//         />
//       </div>
//     </div>
//   );
// };

// export default LegalDocumentAnalyzer;

// pages/index.tsx


// import { useState, useRef, JSX } from 'react';
// import { Upload, AlertCircle, Check, X, Edit } from 'lucide-react';
// import type { NextPage } from 'next';
// import * as Mammoth from "mammoth";

// import * as PDFJS from 'pdfjs-dist';
// PDFJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

// type Issue = {
//   id: string;
//   type: 'grammar' | 'punctuation' | 'terminology' | 'citation';
//   start: number;
//   end: number;
//   text: string;
//   suggestion: string;
// };

// const Home: NextPage = () => {
//   const [text, setText] = useState<string>('');
//   const [issues, setIssues] = useState<Issue[]>([]);
//   const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Mock function to analyze text and find issues
//   const MAX_TEXT_LENGTH = 30000; // LanguageTool limit

//   const analyzeText = async (content: string) => {
//     try {
//       if (content.length > MAX_TEXT_LENGTH) {
//         console.warn("Text is too long, truncating to 20,000 characters.");
//         content = content.substring(0, MAX_TEXT_LENGTH);
//       }

//       const response = await fetch("https://api.languagetool.org/v2/check", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: new URLSearchParams({
//           text: content,
//           language: "en-US",
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`API Error: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();

//       if (!data || !data.matches) {
//         throw new Error("Invalid response from API");
//       }

//       // Convert API response to Issue format
//       const newIssues = data.matches.map((match: any, index: number) => ({
//         id: `${match.rule.id}-${match.offset}-${index}`, // Ensure uniqueness
//         type: match.rule.category.id.toLowerCase(),
//         start: match.offset,
//         end: match.offset + match.length,
//         text: content.substring(match.offset, match.offset + match.length),
//         suggestion: match.replacements?.[0]?.value || "",
//       }));

//       setIssues(newIssues);
//     } catch (error) {
//       console.error("Error analyzing text:", error);
//     }
//   };




//   const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setText(e.target.value);
//     analyzeText(e.target.value);
//   };

//   // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   const file = e.target.files?.[0];
//   //   if (!file) return;

//   //   const reader = new FileReader();
//   //   reader.onload = (event) => {
//   //     const content = event.target?.result as string;
//   //     setText(content);
//   //     analyzeText(content);
//   //   };
//   //   reader.readAsText(file);
//   // };
//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const fileType = file.type;

//     if (fileType === "application/pdf") {
//       extractTextFromPDF(file);
//     } else if (
//       fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
//       file.name.endsWith(".docx")
//     ) {
//       extractTextFromDocx(file);
//     } else if (fileType === "text/plain") {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const content = event.target?.result as string;
//         setText(content);
//         analyzeText(content);
//       };
//       reader.readAsText(file);
//     } else {
//       alert("Unsupported file format. Please upload a PDF, DOCX, or TXT file.");
//     }
//   };

//   const extractTextFromDocx = async (file: File) => {
//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       const arrayBuffer = event.target?.result as ArrayBuffer;
//       const result = await Mammoth.extractRawText({ arrayBuffer });
//       setText(result.value);
//       analyzeText(result.value);
//     };
//     reader.readAsArrayBuffer(file);
//   };


//   const extractTextFromPDF = async (file: File) => {
//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       const arrayBuffer = event.target?.result as ArrayBuffer;
//       const pdf = await PDFJS.getDocument({ data: arrayBuffer }).promise;

//       let extractedText = "";
//       for (let i = 1; i <= pdf.numPages; i++) {
//         const page = await pdf.getPage(i);
//         const textContent = await page.getTextContent();
//         const pageText = textContent.items.map((item) => (item as any).str).join(" ");
//         extractedText += pageText + "\n\n";
//       }

//       setText(extractedText);
//       analyzeText(extractedText);
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const handleFileButtonClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleSuggestionAction = (action: 'accept' | 'ignore' | 'edit') => {
//     if (!selectedIssue) return;

//     if (action === 'accept') {
//       const beforeIssue = text.substring(0, selectedIssue.start);
//       const afterIssue = text.substring(selectedIssue.end);
//       setText(beforeIssue + selectedIssue.suggestion + afterIssue);

//       // Remove this issue and move to next
//       setIssues(issues.filter(issue => issue.id !== selectedIssue.id));
//       setSelectedIssue(null);
//     } else if (action === 'ignore') {
//       setIssues(issues.filter(issue => issue.id !== selectedIssue.id));
//       setSelectedIssue(null);
//     }
//     // For 'edit', we would open an edit dialog (not implemented in this example)
//   };

//   // Function to render text with highlighted issues
//   const renderTextWithHighlights = () => {
//     if (!text || issues.length === 0) return text;

//     let lastIndex = 0;
//     const elements: JSX.Element[] = [];

//     // Sort issues by start position
//     const sortedIssues = [...issues].sort((a, b) => a.start - b.start);

//     sortedIssues.forEach((issue, index) => {
//       // Add text before the issue
//       if (issue.start > lastIndex) {
//         elements.push(
//           <span key={`text-${index}`}>
//             {text.substring(lastIndex, issue.start)}
//           </span>
//         );
//       }

//       // Add the highlighted issue
//       const highlightColor = getIssueColor(issue.type);
//       elements.push(
//         <span 
//           key={`issue-${issue.id}`}
//           className={`${highlightColor} cursor-pointer`}
//           onClick={() => setSelectedIssue(issue)}
//         >
//           {text.substring(issue.start, issue.end)}
//         </span>
//       );

//       lastIndex = issue.end;
//     });

//     // Add any remaining text
//     if (lastIndex < text.length) {
//       elements.push(
//         <span key="text-end">{text.substring(lastIndex)}</span>
//       );
//     }

//     return <>{elements}</>;
//   };

//   const getIssueColor = (type: Issue['type']): string => {
//     switch (type) {
//       case 'grammar':
//         return 'bg-red-200';
//       case 'punctuation':
//         return 'bg-yellow-200';
//       case 'terminology':
//         return 'bg-blue-200';
//       case 'citation':
//         return 'bg-purple-200';
//       default:
//         return 'bg-gray-200';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto p-4">
//         <h1 className="text-2xl font-bold mb-6 text-center">Text Improvement Tool</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
//           {/* Document upload section */}
//           <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow">
//             <h2 className="text-lg font-semibold mb-4">Document</h2>
//             <button
//               className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
//               onClick={handleFileButtonClick}
//             >
//               <Upload size={18} />
//               Upload Document
//             </button>
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileUpload}
//               className="hidden"
//               accept=".txt,.doc,.docx,.pdf"
//             />
//           </div>

//           {/* Text area section */}
//           <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow">
//             <textarea
//               className="w-full h-64 p-4 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
//               placeholder="Type or paste your text here..."
//               value={text}
//               onChange={handleTextChange}
//             ></textarea>

//             <div className="mt-4 p-4 border rounded min-h-32 max-h-64 overflow-y-auto">
//               {renderTextWithHighlights()}
//             </div>
//           </div>

//           {/* Issues and suggestions section */}
//           <div className="lg:col-span-1 bg-white rounded-lg shadow">
//             {/* Issue summary */}
//             <div className="p-4 border-b">
//               <h2 className="text-lg font-semibold mb-4">Issue Summary</h2>
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full bg-red-200"></div>
//                   <span>Grammar ({issues.filter(i => i.type === 'grammar').length})</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full bg-yellow-200"></div>
//                   <span>Punctuation ({issues.filter(i => i.type === 'punctuation').length})</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full bg-blue-200"></div>
//                   <span>Terminology ({issues.filter(i => i.type === 'terminology').length})</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full bg-purple-200"></div>
//                   <span>Citation ({issues.filter(i => i.type === 'citation').length})</span>
//                 </div>
//               </div>
//             </div>

//             {/* Current suggestion */}
//             <div className="p-4">
//               <h2 className="text-lg font-semibold mb-4">Current Suggestion</h2>
//               {selectedIssue ? (
//                 <div>
//                   <div className="mb-4">
//                     <div className="text-sm text-gray-500">Original:</div>
//                     <div className="p-2 bg-gray-100 rounded">{selectedIssue.text}</div>
//                   </div>

//                   <div className="mb-4">
//                     <div className="text-sm text-gray-500">Suggestion:</div>
//                     <div className="p-2 bg-green-100 rounded">{selectedIssue.suggestion}</div>
//                   </div>

//                   <div className="flex gap-2">
//                     <button
//                       className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
//                       onClick={() => handleSuggestionAction('accept')}
//                     >
//                       <Check size={16} />
//                       Accept
//                     </button>
//                     <button
//                       className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded text-sm"
//                       onClick={() => handleSuggestionAction('ignore')}
//                     >
//                       <X size={16} />
//                       Ignore
//                     </button>
//                     <button
//                       className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
//                       onClick={() => handleSuggestionAction('edit')}
//                     >
//                       <Edit size={16} />
//                       Edit
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center h-32 text-gray-400">
//                   <div className="text-center">
//                     <AlertCircle size={24} className="mx-auto mb-2" />
//                     <p>Select an issue to see suggestions</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;


// import React, { useState, useRef, } from 'react';
// import { Upload, AlertCircle, Check, X, Edit } from 'lucide-react';
// import type { NextPage } from 'next';
// import * as Mammoth from "mammoth";
// import * as PDFJS from 'pdfjs-dist';

// // Import the types
// import {
//   Issue,
//   IssueType,
//   ProofreadReport,
//   UserActionPayload
// } from './types';

// // Configure PDF.js worker
// PDFJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

// const Home: NextPage = () => {
//   const [text, setText] = useState<string>('');
//   const [issues, setIssues] = useState<Issue[]>([]);
//   const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
//   const [documentId, setDocumentId] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [error, setError] = useState<string | null>(null);
//   // File extraction helper functions
//   const extractTextFromDocx = async (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = async (event) => {
//         try {
//           const arrayBuffer = event.target?.result as ArrayBuffer;
//           const result = await Mammoth.extractRawText({ arrayBuffer });
//           resolve(result.value);
//         } catch (error) {
//           reject(error);
//         }
//       };
//       reader.onerror = reject;
//       reader.readAsArrayBuffer(file);
//     });
//   };

//   const extractTextFromPDF = async (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = async (event) => {
//         try {
//           const arrayBuffer = event.target?.result as ArrayBuffer;
//           const pdf = await PDFJS.getDocument({ data: arrayBuffer }).promise;

//           let extractedText = "";
//           for (let i = 1; i <= pdf.numPages; i++) {
//             const page = await pdf.getPage(i);
//             const textContent = await page.getTextContent();
//             const pageText = textContent.items.map((item) => (item as any).str).join(" ");
//             extractedText += pageText + "\n\n";
//           }

//           resolve(extractedText);
//         } catch (error) {
//           reject(error);
//         }
//       };
//       reader.onerror = reject;
//       reader.readAsArrayBuffer(file);
//     });
//   };

//   // Handle file upload to backend
//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setIsLoading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await fetch('http://44.211.157.24:8000/legal-lens', {
//         method: 'POST',
//         body: formData
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data: ProofreadReport = await response.json();

//       setText(data.document_text);
//       setDocumentId(data.document_id);

//       // Modify issue extraction logic
//       const allIssues: Issue[] = [];

//       // Helper function to create issues from error lists
//       const createIssues = (errors: string[], type: IssueType) => {
//         return errors.map((error, index) => ({
//           id: `${type}-${index}`,
//           text: error,
//           suggestion: error,
//           type: type,
//           start: 0,  // You might want to calculate actual positions
//           end: error.length
//         }));
//       };

//       // Extract issues from different error categories
//       if (data.proofread_report) {
//         const report = data.proofread_report;

//         if (report.grammar_errors) {
//           allIssues.push(...createIssues(report.grammar_errors, 'grammar'));
//         }
//         if (report.punctuation_errors) {
//           allIssues.push(...createIssues(report.punctuation_errors, 'punctuation'));
//         }
//         if (report.legal_terminology_errors) {
//           allIssues.push(...createIssues(report.legal_terminology_errors, 'terminology'));
//         }
//         if (report.citation_formatting_errors) {
//           allIssues.push(...createIssues(report.citation_formatting_errors, 'citation'));
//         }
//       }

//       setIssues(allIssues);
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       setError(error instanceof Error ? error.message : 'An unknown error occurred');
//       setIssues([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

// const handleSuggestionAction = async (
//   action: 'accept' | 'ignore' | 'edit',
//   userEdit?: string
// ) => {
//   if (!selectedIssue || !documentId) return;

//   setIsLoading(true);
//   try {
//     const response = await fetch('http://44.211.157.24:8000/legal-lens/action', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         document_id: documentId,
//         suggestion: selectedIssue.text,
//         error_type: selectedIssue.type,
//         action: action,
//         user_edit: userEdit
//       })
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();

//     setText(data.updated_document);
//     setIssues(issues.filter(issue => issue.id !== selectedIssue.id));
//     setSelectedIssue(null);
//   } catch (error) {
//     console.error('Error applying suggestion:', error);
//     setError(error instanceof Error ? error.message : 'An unknown error occurred');
//   } finally {
//     setIsLoading(false);
//   }
// };

// // Color mapping for issue types
// const getIssueColor = (type: IssueType): string => {
//   const colorMap: Record<IssueType, string> = {
//     'grammar': 'bg-red-200',
//     'punctuation': 'bg-yellow-200',
//     'terminology': 'bg-blue-200',
//     'citation': 'bg-purple-200'
//   };
//   return colorMap[type] || 'bg-gray-200';
// };

// // Render text with highlighted issues
// const renderTextWithHighlights = () => {
//   if (!text || issues.length === 0) return text;

//   let lastIndex = 0;
//   const elements: React.ReactNode[] = [];

//   // Sort issues by start position
//   const sortedIssues = [...issues].sort((a, b) => a.start - b.start);

//   sortedIssues.forEach((issue, index) => {
//     // Add text before the issue
//     if (issue.start > lastIndex) {
//       elements.push(
//         <span key={`text-${index}`}>
//           {text.substring(lastIndex, issue.start)}
//         </span>
//       );
//     }

//     // Add the highlighted issue
//     const highlightColor = getIssueColor(issue.type);
//     elements.push(
//       <span
//         key={`issue-${issue.id}`}
//         className={`${highlightColor} cursor-pointer`}
//         onClick={() => setSelectedIssue(issue)}
//       >
//         {text.substring(issue.start, issue.end)}
//       </span>
//     );

//     lastIndex = issue.end;
//   });

//   // Add any remaining text
//   if (lastIndex < text.length) {
//     elements.push(
//       <span key="text-end">{text.substring(lastIndex)}</span>
//     );
//   }

//   return <>{elements}</>;
// };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto p-4">
//         <h1 className="text-2xl font-bold mb-6 text-center">Legal Lens Proofreading Tool</h1>
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//             <strong className="font-bold">Error: </strong>
//             <span className="block sm:inline">{error}</span>
//           </div>
//         )}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
//           {/* Document upload section */}
//           <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow">
//             <h2 className="text-lg font-semibold mb-4">Document</h2>
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileUpload}
//               className="hidden"
//               accept=".txt,.doc,.docx,.pdf"
//               disabled={isLoading}
//             />
//             <button
//               className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
//               onClick={() => fileInputRef.current?.click()}
//               disabled={isLoading}
//             >
//               <Upload size={18} />
//               {isLoading ? 'Processing...' : 'Upload Document'}
//             </button>
//           </div>

//           {/* Text area section */}
//           <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow">
//             <textarea
//               className="w-full h-64 p-4 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
//               placeholder="Type or paste your text here..."
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               disabled={isLoading}
//             ></textarea>

//             <div className="mt-4 p-4 border rounded min-h-32 max-h-64 overflow-y-auto">
//               {renderTextWithHighlights()}
//             </div>
//           </div>

//           {/* Issues and suggestions section */}

//           <div className="lg:col-span-1 bg-white rounded-lg shadow">
//             {/* Issue summary */}
//             <div className="p-4 border-b">
//               <h2 className="text-lg font-semibold mb-4">Issue Summary</h2>
//               <div className="space-y-2">
//                 {(['grammar', 'punctuation', 'terminology', 'citation'] as IssueType[]).map(type => (
//                   <div key={type} className="flex items-center gap-2">
//                     <div className={`w-3 h-3 rounded-full ${getIssueColor(type)}`}></div>
//                     <span>
//                       {type.charAt(0).toUpperCase() + type.slice(1)}
//                       ({issues.filter(i => i.type === type).length})
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Current suggestion */}
//   <div className="p-4">
//     <h2 className="text-lg font-semibold mb-4">Current Suggestion</h2>
//     {selectedIssue ? (
//       <div>
//         <div className="mb-4">
//           <div className="text-sm text-gray-500">Original:</div>
//           <div className="p-2 bg-gray-100 rounded">{selectedIssue.text}</div>
//         </div>

//         <div className="mb-4">
//           <div className="text-sm text-gray-500">Suggestion:</div>
//           <div className="p-2 bg-green-100 rounded">{selectedIssue.suggestion}</div>
//         </div>

//         <div className="flex gap-2">
//           <button
//             className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm disabled:opacity-50"
//             onClick={() => handleSuggestionAction('accept')}
//             disabled={isLoading}
//           >
//             <Check size={16} />
//             Accept
//           </button>
//           <button
//             className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded text-sm disabled:opacity-50"
//             onClick={() => handleSuggestionAction('ignore')}
//             disabled={isLoading}
//           >
//             <X size={16} />
//             Ignore
//           </button>
//           <button
//             className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm disabled:opacity-50"
//             onClick={() => handleSuggestionAction('edit')}
//             disabled={isLoading}
//           >
//             <Edit size={16} />
//             Edit
//           </button>
//         </div>
//       </div>
//     ) : (
//       <div className="flex items-center justify-center h-32 text-gray-400">
//         <div className="text-center">
//           <AlertCircle size={24} className="mx-auto mb-2" />
//           <p>Select an issue to see suggestions</p>
//         </div>
//       </div>
//     )}
//   </div>
// </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;



// import React, { useState, useRef, } from 'react';
// import { Upload, AlertCircle, Check, X, Edit } from 'lucide-react';
// import type { NextPage } from 'next';
// import * as Mammoth from "mammoth";
// import * as PDFJS from 'pdfjs-dist';

// // Import the types
// import {
//   Issue,
//   IssueType,
//   ProofreadReport,
//   UserActionPayload
// } from './types';


// // Configure PDF.js worker
// PDFJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

// const Home: NextPage = () => {
//   const [text, setText] = useState<string>('');
//   const [issues, setIssues] = useState<Issue[]>([]);
//   const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
//   const [documentId, setDocumentId] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [error, setError] = useState<string | null>(null);

// // File extraction helper functions
// const extractTextFromDocx = async (file: File): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       try {
//         const arrayBuffer = event.target?.result as ArrayBuffer;
//         const result = await Mammoth.extractRawText({ arrayBuffer });
//         resolve(result.value);
//       } catch (error) {
//         reject(error);
//       }
//     };
//     reader.onerror = reject;
//     reader.readAsArrayBuffer(file);
//   });
// };

// const extractTextFromPDF = async (file: File): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       try {
//         const arrayBuffer = event.target?.result as ArrayBuffer;
//         const pdf = await PDFJS.getDocument({ data: arrayBuffer }).promise;

//         let extractedText = "";
//         for (let i = 1; i <= pdf.numPages; i++) {
//           const page = await pdf.getPage(i);
//           const textContent = await page.getTextContent();
//           const pageText = textContent.items.map((item) => (item as any).str).join(" ");
//           extractedText += pageText + "\n\n";
//         }

//         resolve(extractedText);
//       } catch (error) {
//         reject(error);
//       }
//     };
//     reader.onerror = reject;
//     reader.readAsArrayBuffer(file);
//   });
// };

//   // Handle file upload to backend
//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setIsLoading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await fetch('http://44.211.157.24:8000/legal-lens', {
//         method: 'POST',
//         body: formData
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data: ProofreadReport = await response.json();

//       // Update this part to set text from the proofread_report analysis
//       const extractedText = data.proofread_report?.proofread_analysis || '';
//       setText(extractedText);
//       setDocumentId(data.document_id);

//       // Modify issue extraction logic
//       const allIssues: Issue[] = [];

//       // Helper function to create issues from error lists
//       const createIssues = (errors: string[], type: IssueType) => {
//         return errors.map((error, index) => ({
//           id: `${type}-${index}`,
//           text: error,
//           suggestion: error,
//           type: type,
//           start: 0,  // You might want to calculate actual positions
//           end: error.length
//         }));
//       };

//       // Extract issues from different error categories
//       if (data.proofread_report) {
//         const report = data.proofread_report;

//         // Create issues based on the proofread_analysis
//         const analysisErrors = report.proofread_analysis.split('\n')
//           .filter(line => line.startsWith('**'))
//           .map(line => line.replace(/^\*\*.*:\s*/, ''));

//         allIssues.push(...createIssues(analysisErrors, 'grammar'));
//       }

//       setIssues(allIssues);
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       setError(error instanceof Error ? error.message : 'An unknown error occurred');
//       setIssues([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   const handleSuggestionAction = async (
//     action: 'accept' | 'ignore' | 'edit',
//     userEdit?: string
//   ) => {
//     if (!selectedIssue || !documentId) return;

//     setIsLoading(true);
//     try {
//       const response = await fetch('http://44.211.157.24:8000/legal-lens/action', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           document_id: documentId,
//           suggestion: selectedIssue.text,
//           error_type: selectedIssue.type,
//           action: action,
//           user_edit: userEdit
//         })
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       setText(data.updated_document);
//       setIssues(issues.filter(issue => issue.id !== selectedIssue.id));
//       setSelectedIssue(null);
//     } catch (error) {
//       console.error('Error applying suggestion:', error);
//       setError(error instanceof Error ? error.message : 'An unknown error occurred');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Color mapping for issue types
//   const getIssueColor = (type: IssueType): string => {
//     const colorMap: Record<IssueType, string> = {
//       'grammar': 'bg-red-200',
//       'punctuation': 'bg-yellow-200',
//       'terminology': 'bg-blue-200',
//       'citation': 'bg-purple-200'
//     };
//     return colorMap[type] || 'bg-gray-200';
//   };

//   // Render text with highlighted issues
//   const renderTextWithHighlights = () => {
//     if (!text || issues.length === 0) return text;

//     let lastIndex = 0;
//     const elements: React.ReactNode[] = [];

//     // Sort issues by start position
//     const sortedIssues = [...issues].sort((a, b) => a.start - b.start);

//     sortedIssues.forEach((issue, index) => {
//       // Add text before the issue
//       if (issue.start > lastIndex) {
//         elements.push(
//           <span key={`text-${index}`}>
//             {text.substring(lastIndex, issue.start)}
//           </span>
//         );
//       }

//       // Add the highlighted issue
//       const highlightColor = getIssueColor(issue.type);
//       elements.push(
//         <span
//           key={`issue-${issue.id}`}
//           className={`${highlightColor} cursor-pointer`}
//           onClick={() => setSelectedIssue(issue)}
//         >
//           {text.substring(issue.start, issue.end)}
//         </span>
//       );

//       lastIndex = issue.end;
//     });

//     // Add any remaining text
//     if (lastIndex < text.length) {
//       elements.push(
//         <span key="text-end">{text.substring(lastIndex)}</span>
//       );
//     }

//     return <>{elements}</>;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto p-4">
//         <h1 className="text-2xl font-bold mb-6 text-center">Legal Lens Proofreading Tool</h1>
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//             <strong className="font-bold">Error: </strong>
//             <span className="block sm:inline">{error}</span>
//           </div>
//         )}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
//           {/* Document upload section */}
//           <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow">
//             <h2 className="text-lg font-semibold mb-4">Document</h2>
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileUpload}
//               className="hidden"
//               accept=".txt,.doc,.docx,.pdf"
//               disabled={isLoading}
//             />
//             <button
//               className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
//               onClick={() => fileInputRef.current?.click()}
//               disabled={isLoading}
//             >
//               <Upload size={18} />
//               {isLoading ? 'Processing...' : 'Upload Document'}
//             </button>
//           </div>

//           {/* Text area section */}
//           <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow">
//             <textarea
//               className="w-full h-64 p-4 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
//               placeholder="Type or paste your text here..."
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               disabled={isLoading}
//             ></textarea>

//             <div className="mt-4 p-4 border rounded min-h-32 max-h-64 overflow-y-auto">
//               {renderTextWithHighlights()}
//             </div>
//           </div>

//           {/* Issues and suggestions section */}
//           <div className="lg:col-span-1 bg-white rounded-lg shadow">
//             {/* Issue summary */}
//             <div className="p-4 border-b">
//               <h2 className="text-lg font-semibold mb-4">Issue Summary</h2>
//               <div className="space-y-2">
//                 {(['grammar', 'punctuation', 'terminology', 'citation'] as IssueType[]).map(type => (
//                   <div key={type} className="flex items-center gap-2">
//                     <div className={`w-3 h-3 rounded-full ${getIssueColor(type)}`}></div>
//                     <span>
//                       {type.charAt(0).toUpperCase() + type.slice(1)}
//                       ({issues.filter(i => i.type === type).length})
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Rest of the component remains the same */}
//             {/* ... */}
//             <div className="p-4">
//               <h2 className="text-lg font-semibold mb-4">Current Suggestion</h2>
//               {selectedIssue ? (
//                 <div>
//                   <div className="mb-4">
//                     <div className="text-sm text-gray-500">Original:</div>
//                     <div className="p-2 bg-gray-100 rounded">{selectedIssue.text}</div>
//                   </div>

//                   <div className="mb-4">
//                     <div className="text-sm text-gray-500">Suggestion:</div>
//                     <div className="p-2 bg-green-100 rounded">{selectedIssue.suggestion}</div>
//                   </div>

//                   <div className="flex gap-2">
//                     <button
//                       className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm disabled:opacity-50"
//                       onClick={() => handleSuggestionAction('accept')}
//                       disabled={isLoading}
//                     >
//                       <Check size={16} />
//                       Accept
//                     </button>
//                     <button
//                       className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded text-sm disabled:opacity-50"
//                       onClick={() => handleSuggestionAction('ignore')}
//                       disabled={isLoading}
//                     >
//                       <X size={16} />
//                       Ignore
//                     </button>
//                     <button
//                       className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm disabled:opacity-50"
//                       onClick={() => handleSuggestionAction('edit')}
//                       disabled={isLoading}
//                     >
//                       <Edit size={16} />
//                       Edit
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center h-32 text-gray-400">
//                   <div className="text-center">
//                     <AlertCircle size={24} className="mx-auto mb-2" />
//                     <p>Select an issue to see suggestions</p>
//                   </div>
//                 </div>
//               )}
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;





import React, { useState, useRef, } from 'react';
import { Upload, AlertCircle, Check, X, Edit, ChevronDown, ChevronRight } from 'lucide-react';
import type { NextPage } from 'next';
// import * as Mammoth from "mammoth";
import * as PDFJS from 'pdfjs-dist';
import Returnpage from '../returnpage';

// Updated Types definition
type IssueType = 'grammar' | 'punctuation' | 'terminology' | 'citation';
// type ActionType = 'accept' | 'ignore' | 'modify';

interface Issue {
  id: string;
  text: string;
  suggestion: string;
  type: IssueType;
  start: number;
  end: number;
  details: string | string[];  // Allow both string and string[]

}

interface ProofreadReport {
  proofread_report?: {
    proofread_analysis: string;
    error_counts?: {
      [key: string]: number;
    };
    grammar_errors?: string[];
    punctuation_errors?: string[];
    legal_terminology_errors?: string[];
    citation_formatting_errors?: string[];
  };
  document_id?: string;
}

// Configure PDF.js worker
PDFJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

const Home: NextPage = () => {
  const [text, setText] = useState<string>('');
  const [, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [, setDocumentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editedSuggestion, setEditedSuggestion] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const [errorCounts, setErrorCounts] = useState<{ [key: string]: number }>({});
  const [errorDetails, setErrorDetails] = useState<{ [key: string]: string[] }>({});
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  // Existing file extraction methods remain the same...
  const errorTypeMapping: { [key: string]: IssueType } = {
    'Grammar Errors': 'grammar',
    'Punctuation Errors': 'punctuation',
    'Legal Terminology Errors': 'terminology',
    'Citation Formatting Errors': 'citation'
  };


  // File extraction helper functions
  // const extractTextFromDocx = async (file: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = async (event) => {
  //       try {
  //         const arrayBuffer = event.target?.result as ArrayBuffer;
  //         const result = await Mammoth.extractRawText({ arrayBuffer });
  //         resolve(result.value);
  //       } catch (error) {
  //         reject(error);
  //       }
  //     };
  //     reader.onerror = reject;
  //     reader.readAsArrayBuffer(file);
  //   });
  // };

  // const extractTextFromPDF = async (file: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = async (event) => {
  //       try {
  //         const arrayBuffer = event.target?.result as ArrayBuffer;
  //         const pdf = await PDFJS.getDocument({ data: arrayBuffer }).promise;

  //         let extractedText = "";
  //         for (let i = 1; i <= pdf.numPages; i++) {
  //           const page = await pdf.getPage(i);
  //           const textContent = await page.getTextContent();
  //           const pageText = textContent.items.map((item) => (item as any).str).join(" ");
  //           extractedText += pageText + "\n\n";
  //         }

  //         resolve(extractedText);
  //       } catch (error) {
  //         reject(error);
  //       }
  //     };
  //     reader.onerror = reject;
  //     reader.readAsArrayBuffer(file);
  //   });
  // };

  // Handle file upload 
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://44.211.157.24:8000/legal-lens', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProofreadReport = await response.json();

      const extractedText = data.proofread_report?.proofread_analysis || '';
      setText(extractedText);
      setDocumentId(data.document_id || null);

      // Collect error details
      const errorDetailsMap: { [key: string]: string[] } = {
        'Grammar Errors': data.proofread_report?.grammar_errors || [],
        'Punctuation Errors': data.proofread_report?.punctuation_errors || [],
        'Legal Terminology Errors': data.proofread_report?.legal_terminology_errors || [],
        'Citation Formatting Errors': data.proofread_report?.citation_formatting_errors || []
      };
      setErrorDetails(errorDetailsMap);

      // Create issues from the analysis
      const allIssues: Issue[] = Object.entries(errorDetailsMap).flatMap(([type, errors]) =>
        errors.map((error, index) => ({
          id: `${type}-${index}`,
          text: error,
          suggestion: error,
          type: errorTypeMapping[type],
          start: 0,
          end: error.length,
          details: [error]
        }))
      );
      setIssues(allIssues);

    } catch (error) {
      console.error('Error uploading file:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setIssues([]);
      setErrorDetails({});
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Color mapping for issue types


  // Extract issues from proofread analysis
  // const extractIssuesFromAnalysis = (analysis: string): Issue[] => {
  //   const issueTypes: IssueType[] = ['grammar', 'punctuation', 'terminology', 'citation'];

  //   const issues: Issue[] = [];
  //   const lines = analysis.split('\n');

  //   lines.forEach((line, index) => {
  //     issueTypes.forEach(type => {
  //       if (line.includes(`**${type.charAt(0).toUpperCase() + type.slice(1)}:**`)) {
  //         const nextLine = lines[index + 1];
  //         if (nextLine) {
  //           issues.push({
  //             id: `${type}-${issues.length}`,
  //             text: nextLine.split('->')[0].trim().replace(/"/g, ''),
  //             suggestion: nextLine.split('->')[1]?.trim().replace(/"/g, '') || '',
  //             type: type,
  //             start: 0,
  //             end: nextLine.length,
  //             details: ''
  //           });
  //         }
  //       }
  //     });
  //   });

  //   return issues;
  // };

  // Handle suggestion actions
  // const handleSuggestionAction = async (
  //   action: ActionType
  // ) => {
  //   if (!selectedIssue || !documentId) return;

  //   setIsLoading(true);
  //   try {
  //     const response = await fetch('http://44.211.157.24:8000/legal-lens/action', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         document_id: documentId,
  //         suggestion: selectedIssue.text,
  //         error_type: selectedIssue.type,
  //         action: action,
  //         user_edit: action === 'modify' ? editedSuggestion : undefined
  //       })
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();

  //     setText(data.updated_document);
  //     setIssues(issues.filter(issue => issue.id !== selectedIssue.id));
  //     setSelectedIssue(null);
  //     setEditedSuggestion('');
  //   } catch (error) {
  //     console.error('Error applying suggestion:', error);
  //     setError(error instanceof Error ? error.message : 'An unknown error occurred');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Color mapping for issue types
  const getIssueColor = (type: IssueType): string => {
    const colorMap: Record<IssueType, string> = {
      'grammar': 'bg-red-200',
      'punctuation': 'bg-yellow-200',
      'terminology': 'bg-blue-200',
      'citation': 'bg-purple-200'
    };
    return colorMap[type] || 'bg-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
      <Returnpage  />
        <h1 className="text-2xl font-bold mb-6 text-center">Legal Lens Proofreading Tool</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Document Upload Section */}
          <div className="lg:col-span-5 bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Document</h2>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".txt,.doc,.docx,.pdf"
              disabled={isLoading}
            />
            <button
              className="w-full flex items-center justify-center gap-2 bg-gray-500 hover:bg--600 text-white py-2 px-4 rounded disabled:opacity-50"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Upload size={18} />
              {isLoading ? 'Processing...' : 'Upload Document'}
            </button>
          </div>

          {/* Text Area Section */}
          <div className="lg:col-span-4 bg-white p-4 rounded-lg shadow">
            <textarea
              className="w-full h-64 p-4 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
              placeholder="Type or paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
            ></textarea>
          </div>

          {/* Issues and Suggestions Section */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow">
            {/* Issue Summary */}
            {/* <div className="p-4 border-b">
              <h2 className="text-lg font-semibold mb-4">Issue Summary</h2>
              <div className="space-y-2">
                {Object.entries(errorTypeMapping).map(([backendType, issueType]) => (
                  <div key={backendType} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getIssueColor(issueType)}`}></div>
                    <span className="flex-grow">
                      {backendType.replace(' Errors', '')}
                    </span>
                    <span className="font-semibold">
                      {errorCounts[backendType] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div> */}
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold mb-4">Issue Summary</h2>
              <div className="space-y-2">
                {Object.entries(errorTypeMapping).map(([backendType, issueType]) => (
                  <div key={backendType} className="group">
                    <div
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
                      onClick={() => toggleSection(backendType)}
                    >
                      <div className={`w-3 h-3 rounded-full ${getIssueColor(issueType)}`}></div>
                      <span className="flex-grow">
                        {backendType.replace(' Errors', '')}
                      </span>
                      <span className="font-semibold">
                        {errorDetails[backendType]?.length || 0}
                      </span>
                      {expandedSections[backendType] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>

                    {expandedSections[backendType] && (
                      <div className="pl-6 mt-2 space-y-2 text-sm text-gray-700">
                        {errorDetails[backendType]?.map((error, index) => (
                          <div
                            key={index}
                            className="cursor-pointer hover:bg-gray-50 p-1 rounded"
                            onClick={() => {
                              const issue: Issue = {
                                id: `${backendType}-${index}`,
                                text: error,
                                suggestion: error,
                                type: issueType,
                                start: 0,
                                end: error.length,
                                details: [error]
                              };
                              setSelectedIssue(issue);
                            }}
                          >
                            {error}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Current Suggestion */}
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Current Suggestion</h2>
              {selectedIssue ? (
                <div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-500">Original:</div>
                    <div className="p-2 bg-gray-100 rounded">{selectedIssue.text}</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-500">Suggestion:</div>
                    <div className="p-2 bg-green-100 rounded">{selectedIssue.suggestion}</div>
                  </div>

                  <div className="mb-4">
                    <textarea
                      className="w-full p-2 border rounded"
                      placeholder="Modify suggestion (optional)"
                      value={editedSuggestion}
                      onChange={(e) => setEditedSuggestion(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm disabled:opacity-50"
                      onClick={() => {/* handleSuggestionAction */ }}
                      disabled={isLoading}
                    >
                      <Check size={16} />
                      Accept
                    </button>
                    <button
                      className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded text-sm disabled:opacity-50"
                      onClick={() => {/* handleSuggestionAction */ }}
                      disabled={isLoading}
                    >
                      <X size={16} />
                      Ignore
                    </button>
                    <button
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm disabled:opacity-50"
                      onClick={() => {/* handleSuggestionAction */ }}
                      disabled={isLoading}
                    >
                      <Edit size={16} />
                      Modify
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-400">
                  <div className="text-center">
                    <AlertCircle size={24} className="mx-auto mb-2" />
                    <p>Select an issue to see suggestions</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;