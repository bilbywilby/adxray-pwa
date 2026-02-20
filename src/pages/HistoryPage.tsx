import React from 'react';
import { useAdXRayStore, HistoryItem } from '@/lib/ad-analysis-store';
import { HistoryCard } from '@/components/HistoryCard';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, SearchX } from 'lucide-react';
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
  const history = useAdXRayStore(s => s.history);
  const clearHistory = useAdXRayStore(s => s.clearHistory);
  const deleteHistoryItem = useAdXRayStore(s => s.deleteHistoryItem);
  const loadAnalysis = useAdXRayStore(s => s.loadAnalysis);
  const navigate = useNavigate();
  const handleViewDetails = (item: HistoryItem) => {
    loadAnalysis(item.analysis, item.image);
    navigate('/');
  };
  return (
    <AppLayout container className="bg-background min-h-screen">
      <div className="flex flex-col min-h-[calc(100vh-8rem)]">
        <header className="flex justify-between items-center mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl font-display font-black uppercase italic leading-none">SCAN <span className="text-lime-accent">ARCHIVE</span></h1>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em]">Intelligence Log v5.0</p>
          </div>
          {history.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="text-red-500 hover:bg-red-500/10 rounded-none border border-white/5 hover:border-red-500/50 h-12 px-6">
                  <Trash2 className="h-4 w-4 mr-2" />
                  <span className="font-display font-bold uppercase tracking-tight">Wipe Records</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#0a0a0a] border-2 border-red-900/50 rounded-none">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display text-3xl font-black text-white uppercase italic">TERMINATE ARCHIVE?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400 font-medium font-mono text-xs uppercase">
                    This will permanently delete all captured scan intelligence. This action is irreversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-8">
                  <AlertDialogCancel className="bg-transparent border border-white/10 text-white rounded-none font-mono uppercase text-xs hover:bg-white/5">ABORT</AlertDialogCancel>
                  <AlertDialogAction onClick={clearHistory} className="bg-red-600 hover:bg-red-700 text-white rounded-none font-mono uppercase text-xs">CONFIRM_PURGE</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </header>
        <main className="flex-1">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-white/5 bg-white/[0.01]">
              <SearchX size={64} className="text-white/5 mb-8" />
              <h2 className="text-3xl font-display font-black uppercase italic mb-2">ARCHIVE EMPTY</h2>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-10 font-mono max-w-sm">No intelligence detected. Initiate scanning protocol from home terminal.</p>
              <Link to="/">
                <Button className="bg-lime-accent text-black hover:scale-105 transition-all font-display font-black text-xl px-12 py-8 h-auto rounded-none shadow-[0_0_20px_rgba(200,241,53,0.3)]">
                  INITIALIZE SCAN
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {history.map((item) => (
                <HistoryCard 
                  key={item.id} 
                  item={item} 
                  onClick={handleViewDetails} 
                  onDelete={deleteHistoryItem}
                />
              ))}
            </div>
          )}
        </main>
        <footer className="mt-20 py-8 border-t border-white/5 flex justify-between items-center opacity-30">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em]">ADXRAY_VAULT_ENCRYPTION_v5.0</p>
          <div className="flex gap-4">
             <div className="w-1.5 h-1.5 bg-lime-accent rounded-full animate-pulse" />
             <div className="w-1.5 h-1.5 bg-lime-accent rounded-full" />
             <div className="w-1.5 h-1.5 bg-lime-accent rounded-full animate-pulse" />
          </div>
        </footer>
      </div>
    </AppLayout>
  );
}