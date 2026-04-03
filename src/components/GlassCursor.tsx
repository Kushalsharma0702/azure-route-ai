import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const GlassCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      <style>{`
        .glass-cursor-blur {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37),
                      inset -1px -1px 1px rgba(255, 255, 255, 0.2),
                      inset 1px 1px 1px rgba(255, 255, 255, 0.2);
        }
        
        body {
          cursor: none;
        }
      `}</style>
      
      <motion.div
        animate={{
          x: mousePosition.x - 60,
          y: mousePosition.y - 60,
          opacity: isVisible ? 0.8 : 0,
          pointerEvents: "none",
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
        className="fixed w-32 h-32 glass-cursor-blur rounded-full z-10 flex items-center justify-center font-bold text-center px-4 text-primary select-none"
      >
        <div className="text-xs lg:text-sm font-bold text-foreground mix-blend-overlay">
          ✨
        </div>
      </motion.div>
    </>
  );
};

export default GlassCursor;
