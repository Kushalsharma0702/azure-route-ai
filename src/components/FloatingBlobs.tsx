import { motion } from "framer-motion";

const blobs = [
  { size: 320, x: "10%", y: "20%", delay: 0, color: "hsl(230 80% 56% / 0.08)" },
  { size: 260, x: "75%", y: "10%", delay: 2, color: "hsl(262 60% 55% / 0.07)" },
  { size: 200, x: "60%", y: "70%", delay: 4, color: "hsl(280 70% 50% / 0.06)" },
  { size: 180, x: "20%", y: "80%", delay: 1, color: "hsl(230 80% 56% / 0.05)" },
  { size: 140, x: "85%", y: "50%", delay: 3, color: "hsl(262 60% 55% / 0.06)" },
];

const FloatingBlobs = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {blobs.map((blob, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full blur-3xl"
        style={{
          width: blob.size,
          height: blob.size,
          left: blob.x,
          top: blob.y,
          background: blob.color,
        }}
        animate={{
          y: [0, -30, 0, 20, 0],
          x: [0, 15, 0, -15, 0],
          scale: [1, 1.1, 1, 0.95, 1],
        }}
        transition={{
          duration: 12 + i * 2,
          repeat: Infinity,
          delay: blob.delay,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

export default FloatingBlobs;
