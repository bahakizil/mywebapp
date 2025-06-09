"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function KonamiCode() {
  const [keys, setKeys] = useState<string[]>([]);
  const [isKonamiActivated, setIsKonamiActivated] = useState(false);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key } = event;
      const newKeys = [...keys, key];
      
      // Keep only the most recent keys that could match the Konami code
      if (newKeys.length > KONAMI_CODE.length) {
        newKeys.shift();
      }
      
      setKeys(newKeys);
      
      // Check if the Konami code was entered
      const isKonami = newKeys.length === KONAMI_CODE.length && 
        newKeys.every((k, i) => k === KONAMI_CODE[i]);
      
      if (isKonami) {
        setIsKonamiActivated(true);
      }
    },
    [keys]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const closeModal = () => {
    setIsKonamiActivated(false);
    setKeys([]);
  };

  return (
    <AnimatePresence>
      {isKonamiActivated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <Card className="relative max-w-md p-6 bg-card text-card-foreground shadow-lg border-primary/20 dark:border-primary/10 border-2">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={closeModal}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="font-mono text-xs">
                <pre className="text-primary">
                  {`
 ▄▄▄      ██▓    ▓█████  ███▄    █   ▄████ 
▒████▄    ▓██▒    ▓█   ▀  ██ ▀█   █  ██▒ ▀█▒
▒██  ▀█▄  ▒██░    ▒███   ▓██  ▀█ ██▒▒██░▄▄▄░
░██▄▄▄▄██ ▒██░    ▒▓█  ▄ ▓██▒  ▐▌██▒░▓█  ██▓
 ▓█   ▓██▒░██████▒░▒████▒▒██░   ▓██░░▒▓███▀▒
 ▒▒   ▓▒█░░ ▒░▓  ░░░ ▒░ ░░ ▒░   ▒ ▒  ░▒   ▒ 
  ▒   ▒▒ ░░ ░ ▒  ░ ░ ░  ░░ ░░   ░ ▒░  ░   ░ 
  ░   ▒     ░ ░      ░      ░   ░ ░ ░ ░   ░ 
      ░  ░    ░  ░   ░  ░         ░       ░ 
                                            
              `}
                </pre>
                <div className="mt-4">
                  <p className="text-primary font-bold">AI Engineer Profile</p>
                  <div className="mt-2 grid grid-cols-2 gap-x-4">
                    <span className="text-muted-foreground">OS:</span>
                    <span>AI OS 2.0</span>
                    <span className="text-muted-foreground">Host:</span>
                    <span>Neural Networks Inc.</span>
                    <span className="text-muted-foreground">Kernel:</span>
                    <span>GPT-4.5-Ultra</span>
                    <span className="text-muted-foreground">Uptime:</span>
                    <span>5y 3m 12d 8h 42m</span>
                    <span className="text-muted-foreground">Packages:</span>
                    <span>42 (pip), 168 (npm)</span>
                    <span className="text-muted-foreground">Shell:</span>
                    <span>LLM-sh 3.2</span>
                    <span className="text-muted-foreground">Resolution:</span>
                    <span>3840x2160</span>
                    <span className="text-muted-foreground">DE:</span>
                    <span>React 18.0</span>
                    <span className="text-muted-foreground">WM:</span>
                    <span>Next.js</span>
                    <span className="text-muted-foreground">Terminal:</span>
                    <span>VisionTerminal</span>
                  </div>
                </div>
                <div className="mt-4 text-center text-xs text-muted-foreground">
                  You found the Konami Code easter egg! 🎮
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}