import React from 'react';
import { useHistoryStore } from '@/lib/history-store';
import { HistoryCard } from '@/components/HistoryCard';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Camera, ShieldAlert } from 'lucide-react';
import { ScanRecord } from '@/lib/history-store';
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
  const scans = useHistoryStore(s => s.scans);
  const clearHistory = useHistoryStore(s => s.clearHistory);
  const navigate = useNavigate();
  const handleViewDetails = (scan: ScanRecord) => {
    navigate('/', { state: { selectedScan: scan } });
  };
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-lime-accent selection:text-black">
      <div className="max-w-[430px] mx-auto px-6 py-8 flex flex-col h-full">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <Link to="/">
              <div className="p-2 border border-[#222] bg-[#111] hover:border-lime-accent transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </div>
            </Link>
            <div>
              <h1 className="text-2xl font-condensed font-black uppercase italic leading-none">THE VAULT</h1>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Archive Log v1.0</p>
            </div>
          </div>
          {scans.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10 rounded-none border border-transparent hover:border-red-500/20">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#0a0a0a] border-2 border-[#222] rounded-none">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-condensed text-2xl font-black text-white uppercase italic">TERMINATE ARCHIVE?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400 font-medium">
                    This will permanently delete all captured intelligence. This action is irreversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6">
                  <AlertDialogCancel className="bg-transparent border border-[#222] text-white rounded-none font-mono uppercase text-xs">ABORT</AlertDialogCancel>
                  <AlertDialogAction onClick={clearHistory} className="bg-red-600 hover:bg-red-700 text-white rounded-none font-mono uppercase text-xs">CONFIRM DELETION</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </header>
        <main className="flex-1">
          {scans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-[#222] bg-[#111]/30">
              <ShieldAlert size={48} className="text-[#333] mb-4" />
              <h2 className="text-xl font-condensed font-black uppercase mb-1">NO DATA LOGGED</h2>
              <p className="text-xs text-gray-500 uppercase tracking-tight mb-8 font-mono max-w-[200px]">Initial scan required to populate historical database.</p>
              <Link to="/">
                <Button className="bg-lime-accent text-black hover:scale-105 transition-transform font-condensed font-black text-lg px-8 py-6 h-auto rounded-none">
                  START SCAN
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {scans.map((scan) => (
                <HistoryCard key={scan.id} scan={scan} onClick={handleViewDetails} />
              ))}
            </div>
          )}
        </main>
        <footer className="mt-12 py-6 border-t border-[#222] text-center">
          <p className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.2em]">ADXRAY SECURITY PROTOCOL ENABLED</p>
        </footer>
      </div>
    </div>
  );
}