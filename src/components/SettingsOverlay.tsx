import React from 'react';
import { useAdXRayStore } from '@/lib/ad-analysis-store';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield, Key, Trash2 } from 'lucide-react';
export function SettingsOverlay({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const apiKey = useAdXRayStore(s => s.settings.apiKey);
  const precisionMode = useAdXRayStore(s => s.settings.precisionMode);
  const updateSettings = useAdXRayStore(s => s.updateSettings);
  const clearHistory = useAdXRayStore(s => s.clearHistory);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-background border-l border-white/10 w-full sm:max-w-md">
        <SheetHeader className="mb-8">
          <SheetTitle className="font-display text-3xl font-black uppercase italic text-white">System Settings</SheetTitle>
          <SheetDescription className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">Configuration Protocol v1.0</SheetDescription>
        </SheetHeader>
        <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lime-accent">
              <Key size={16} />
              <Label className="font-display font-bold uppercase tracking-tight">AI Gateway Token</Label>
            </div>
            <Input 
              type="password" 
              placeholder="Enter provider key..." 
              value={apiKey}
              onChange={(e) => updateSettings({ apiKey: e.target.value })}
              className="bg-white/5 border-white/10 text-white rounded-none font-mono"
            />
            <p className="text-[10px] text-gray-500 font-mono leading-relaxed">
              *Your key is stored locally in this browser. Images are processed via secure Cloudflare proxy.
            </p>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10">
            <div className="space-y-0.5">
              <Label className="font-display font-bold uppercase text-white">Neural Precision</Label>
              <p className="text-[10px] text-gray-500 font-mono uppercase">Enhanced visual mapping</p>
            </div>
            <Switch 
              checked={precisionMode} 
              onCheckedChange={(c) => updateSettings({ precisionMode: c })}
              className="data-[state=checked]:bg-lime-accent" 
            />
          </div>
          <div className="pt-10 border-t border-white/10">
            <Button 
              variant="ghost" 
              onClick={() => { clearHistory(); onOpenChange(false); }}
              className="w-full h-12 border border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-none font-display font-bold uppercase"
            >
              <Trash2 className="mr-2" size={18} /> Wipe Local History
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}