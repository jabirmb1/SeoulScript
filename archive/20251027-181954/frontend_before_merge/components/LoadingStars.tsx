import { motion } from 'framer-motion';

export default function LoadingStars() {
  return (
    <div className="mt-8 flex items-center justify-center">
      <motion.div
        className="h-8 w-8 rounded-full border-2 border-neon-purple/60 border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 1.2 }}
      />
      <motion.span
        className="ml-3 text-silver/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2.4 }}
      >
        writing scene…
      </motion.span>
    </div>
  );
}
