import { motion } from 'framer-motion';

export default function Header() {
  return (
    <div className="text-center mb-8">
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-semibold font-display tracking-tight text-white"
        style={{textShadow:'0 0 24px rgba(167,139,250,0.25)'}}
      >
        SeoulScript ✨
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mt-2 text-silver/90"
      >
        AI-crafted K-Drama scripts — short, emotional, inspiring.
      </motion.p>
    </div>
  );
}
