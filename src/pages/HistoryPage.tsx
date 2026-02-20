import React from 'react';
import { useHistoryStore } from '@/lib/history-store';
import { HistoryCard } from '@/components/HistoryCard';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Camera } from 'lucide-react';
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
    // We navigate to home but could potentially pass state to show this specific result
    // For this phase, we'll focus on the list, but we'll show a toast or similar if needed.
    navigate('/', { state: { selectedScan: scan } });
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon" className="border-2 border-black shadow-hard-sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter italic">X-Ray Vault</h1>
              <p className="text-sm font-bold uppercase text-muted-foreground">Classified Evidence Log</p>
            </div>
          </div>
          {scans.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="border-2 border-black shadow-hard-sm uppercase font-bold">
                  <Trash2 className="mr-2 h-4 w-4" /> Burn Evidence
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-4 border-black rounded-none">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-black uppercase italic">Destroy the Vault?</AlertDialogTitle>
                  <AlertDialogDescription className="font-medium text-black">
                    This will permanently delete all saved ad analyses. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-2 border-black rounded-none uppercase font-bold">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearHistory} className="bg-red-600 hover:bg-red-700 text-white border-2 border-black rounded-none uppercase font-bold">
                    Burn It All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </header>
        <main>
          {scans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border-4 border-dashed border-black/20">
              <div className="p-6 bg-gray-100 border-2 border-black mb-6 rotate-3">
                <Camera size={64} className="text-black/20" />
              </div>
              <h2 className="text-2xl font-black uppercase mb-2">Vault is Empty</h2>
              <p className="max-w-xs font-medium mb-8">No ads have been processed yet. Start scanning to uncover the truth.</p>
              <Link to="/">
                <Button className="border-2 border-black shadow-hard bg-[#FFD23F] text-black hover:translate-y-1 hover:shadow-none transition-all uppercase font-bold px-8">
                  Scan First Ad
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {scans.map((scan) => (
                <HistoryCard key={scan.id} scan={scan} onClick={handleViewDetails} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}