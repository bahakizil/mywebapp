"use client";

import { motion } from 'framer-motion';

export function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-8">
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-primary to-transparent"
          style={{ width: "100px" }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        />
        
        <motion.div
          className="relative"
          whileHover={{ rotate: 180, scale: 1.2 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-3 h-3 border-2 border-primary rounded-full bg-background">
            <motion.div
              className="w-full h-full bg-primary rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
        
        <motion.div
          className="h-px bg-gradient-to-r from-primary via-primary to-transparent"
          style={{ width: "100px" }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </motion.div>
    </div>
  );
} 