import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HelpCircle, Monitor, Play, Server, Laptop, Smartphone, Upload, Image, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ConnectionGuideModal() {
  const [loggerFile, setLoggerFile] = useState<File | null>(null);
  const [setupImage, setSetupImage] = useState<File | null>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/80 hover:bg-secondary border border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-all">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>How to Connect VSC</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg bg-card border-border max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg gradient-text flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            How to Connect VSC to Dashboard
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Steps */}
          {[
            { icon: Monitor, label: 'Step 1', text: 'Open Visual Studio Code' },
            { icon: Play, label: 'Step 2', text: 'Run logger.py' },
            { icon: Server, label: 'Step 3', text: 'Make sure FastAPI server is running on:' },
            { icon: Laptop, label: 'Step 4', text: 'Keep both dashboard and VSC running on the same laptop' },
            { icon: Smartphone, label: 'Step 5', text: 'If accessing from phone, use:' },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
              <div className="p-1.5 rounded-md bg-primary/20 shrink-0 mt-0.5">
                <step.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="text-xs font-display text-primary uppercase tracking-wider">{step.label}</span>
                <p className="text-sm text-foreground mt-0.5">{step.text}</p>
                {i === 2 && (
                  <code className="mt-1.5 block text-xs font-mono bg-background px-2 py-1 rounded border border-border text-primary">
                    http://localhost:8000
                  </code>
                )}
                {i === 4 && (
                  <code className="mt-1.5 block text-xs font-mono bg-background px-2 py-1 rounded border border-border text-warning">
                    http://YOUR_IP_ADDRESS:8000
                  </code>
                )}
              </div>
            </div>
          ))}

          {/* Upload logger.py */}
          <div className="p-4 rounded-lg border border-border bg-secondary/30 space-y-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Upload className="h-4 w-4 text-warning" />
              Upload your latest logger.py if connection fails
            </h4>
            <label className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept=".py"
                className="hidden"
                onChange={(e) => setLoggerFile(e.target.files?.[0] || null)}
              />
              {loggerFile ? (
                <div className="flex items-center gap-2 text-success text-sm">
                  <CheckCircle className="h-4 w-4" />
                  {loggerFile.name}
                </div>
              ) : (
                <span className="text-muted-foreground text-sm">Click to upload logger.py</span>
              )}
            </label>
          </div>

          {/* Upload setup image */}
          <div className="p-4 rounded-lg border border-border bg-secondary/30 space-y-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Image className="h-4 w-4 text-quantum" />
              Upload a picture of your telemetry setup (ESP32 wiring)
            </h4>
            <label className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setSetupImage(e.target.files?.[0] || null)}
              />
              {setupImage ? (
                <div className="space-y-2 w-full">
                  <div className="flex items-center gap-2 text-success text-sm">
                    <CheckCircle className="h-4 w-4" />
                    {setupImage.name}
                  </div>
                  <img
                    src={URL.createObjectURL(setupImage)}
                    alt="Setup"
                    className="w-full max-h-40 object-contain rounded-lg"
                  />
                </div>
              ) : (
                <span className="text-muted-foreground text-sm">Click to upload an image</span>
              )}
            </label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
