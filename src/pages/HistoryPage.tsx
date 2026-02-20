import React from 'react';
import { useHistoryStore, ExtractionRecord } from '@/lib/history-store';
import { useExtractionStore } from '@/lib/extraction-store';
import { HistoryCard } from '@/components/HistoryCard';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, FileSearch } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
export function HistoryPage() {
  const records = useHistoryStore(s => s.records);
  const clearHistory = useHistoryStore(s => s.clearHistory);
  const setResults = useExtractionStore(s => s.setResults);
  const setFile = useExtractionStore(s => s.setFile);
  const navigate = useNavigate();
  const handleViewDetails = (record: ExtractionRecord) => {
    setFile(record.fileName);
    setResults(record.rawText, record.structuredData);
    navigate('/');
  };
  return (
    <AppLayout container className="bg-background min-h-screen">
      <div className="flex flex-col min-h-[calc(100vh-8rem)]">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-4xl font-display font-black uppercase italic leading-none">THE VAULT</h1>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em]">Neural Archive Log v5.0</p>
            </div>
          </div>
          {records.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="text-red-500 hover:bg-red-500/10 rounded-none border border-[#222] hover:border-red-500/50 h-12 px-6">
                  <Trash2 className="h-4 w-4 mr-2" />
                  <span className="font-display font-bold uppercase tracking-tight">Wipe Database</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#0a0a0a] border-2 border-red-900/50 rounded-none">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display text-3xl font-black text-white uppercase italic">TERMINATE ARCHIVE?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400 font-medium">
                    This will permanently delete all extracted intelligence records. This action is irreversible and the matrix cannot be recovered.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-8">
                  <AlertDialogCancel className="bg-transparent border border-[#222] text-white rounded-none font-mono uppercase text-xs hover:bg-[#111]">ABORT_MISSION</AlertDialogCancel>
                  <AlertDialogAction onClick={clearHistory} className="bg-red-600 hover:bg-red-700 text-white rounded-none font-mono uppercase text-xs">CONFIRM_PURGE</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </header>
        <main className="flex-1">
          {records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-[#1a1a1a] bg-[#0d0d0d]/50">
              <div className="relative mb-8">
                <FileSearch size={64} className="text-[#222]" />
                <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
              </div>
              <h2 className="text-3xl font-display font-black uppercase italic mb-2">DATABASE EMPTY</h2>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-10 font-mono max-w-sm">No document intelligence detected. Please initiate scanning protocol from home terminal.</p>
              <Link to="/">
                <Button className="bg-primary text-black hover:scale-105 transition-all font-display font-black text-xl px-12 py-8 h-auto rounded-none shadow-[0_0_20px_rgba(200,241,53,0.3)]">
                  INITIALIZE SCAN
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {records.map((record) => (
                <HistoryCard key={record.id} record={record} onClick={handleViewDetails} />
              ))}
            </div>
          )}
        </main>
        <footer className="mt-20 py-8 border-t border-[#111] flex justify-between items-center opacity-40">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em]">DOCXRAY_VAULT_ENCRYPTION_v5.0</p>
          <div className="flex gap-4">
             <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
             <div className="w-2 h-2 bg-primary rounded-full" />
             <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        </footer>
      </div>
    </AppLayout>
  );
}