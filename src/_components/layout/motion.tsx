'use client';

import { motion } from 'framer-motion';

export function Motion({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <motion.div
      className="flex w-full h-full min-h-dvh"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
