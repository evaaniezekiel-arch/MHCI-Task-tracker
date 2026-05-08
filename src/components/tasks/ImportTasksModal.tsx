"use client";

import React, { useState, useRef } from 'react';
import { X, Loader2, FileUp, FileText, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';
import { bulkImportTasks } from '@/actions/tasks';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ImportTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekId: string;
}

export default function ImportTasksModal({ isOpen, onClose, weekId }: ImportTasksModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseExcel(selectedFile);
    }
  };

  const parseExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);
      
      // Map common column names to our schema
      const mapped = json.map((row: any) => ({
        title: row.Title || row.title || row.Name || row.name || 'Untitled Task',
        description: row.Description || row.description || '',
        due_date: row.DueDate || row.due_date || row.Date || '',
        priority: row.Priority || row.priority || 'Medium',
        status: row.Status || row.status || 'Pending'
      }));
      
      setPreviewData(mapped);
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    if (previewData.length === 0) return;
    
    setIsImporting(true);
    try {
      const result = await bulkImportTasks(weekId, previewData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Successfully imported ${result.count} tasks`);
        router.refresh();
        onClose();
      }
    } catch (error) {
      toast.error('Failed to import tasks');
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      { Title: 'Security Audit', Description: 'Review system logs', DueDate: '2024-05-15', Priority: 'Critical', Status: 'Pending' },
      { Title: 'Budget Review', Description: 'Approve Q3 expenses', DueDate: '2024-05-16', Priority: 'High', Status: 'Pending' }
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tasks");
    XLSX.writeFile(wb, "MHCI_Task_Template.xlsx");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl mx-4 bg-[#1c1b1b] text-white border border-[#2a2a2a] rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a2a2a] bg-[#131313]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg">
              <FileUp size={20} className="text-black" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-tighter">Bulk Task Import</h2>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Excel / CSV Strategic Integration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-[#2a2a2a] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Upload Area */}
          {!file ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group border-2 border-dashed border-[#2a2a2a] rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-white/20 hover:bg-[#131313] transition-all"
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".xlsx, .xls, .csv"
                className="hidden"
              />
              <div className="w-16 h-16 rounded-2xl bg-[#131313] border border-[#2a2a2a] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText size={32} className="text-zinc-500 group-hover:text-white" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-1">Select Excel File</h3>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">Drag and drop or click to browse</p>
              
              <button 
                onClick={(e) => { e.stopPropagation(); downloadTemplate(); }}
                className="mt-6 flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
              >
                <Download size={12} />
                <span>Download Sample Template</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-[#131313] border border-[#2a2a2a] p-4 rounded-2xl">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{file.name}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">{previewData.length} Activities Detected</p>
                  </div>
                </div>
                <button 
                  onClick={() => setFile(null)}
                  className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-red-500 transition-colors"
                >
                  Clear File
                </button>
              </div>

              {/* Preview Table */}
              <div className="border border-[#2a2a2a] rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#131313] border-b border-[#2a2a2a]">
                    <tr className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                      <th className="px-4 py-3">Task Title</th>
                      <th className="px-4 py-3 text-center">Priority</th>
                      <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2a2a]">
                    {previewData.slice(0, 5).map((row, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 font-bold text-zinc-300">{row.title}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border border-zinc-800 text-zinc-500">
                            {row.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-zinc-600 font-bold uppercase text-[9px]">{row.status}</td>
                      </tr>
                    ))}
                    {previewData.length > 5 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-2 bg-[#131313] text-center text-[9px] font-bold text-zinc-600 uppercase italic">
                          + {previewData.length - 5} more activities
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-[#131313] border-t border-[#2a2a2a] flex items-center justify-between">
          <div className="flex items-center space-x-2 text-zinc-600">
            <AlertCircle size={14} />
            <span className="text-[9px] font-bold uppercase tracking-widest">Verify data before injection</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={!file || isImporting}
              className={cn(
                "flex items-center space-x-2 px-8 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                "disabled:opacity-20 disabled:grayscale",
                !isImporting && "hover:bg-zinc-200 active:scale-95 shadow-xl"
              )}
            >
              {isImporting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Injecting Strategic Data...</span>
                </>
              ) : (
                <>
                  <span>Initiate Bulk Import</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
