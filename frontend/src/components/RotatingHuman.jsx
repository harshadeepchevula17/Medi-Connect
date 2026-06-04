"use client";

import { motion } from "framer-motion";

export default function RotatingHuman() {
  return (
    <motion.img
      src="/human.png"
      alt="Virtual Human"
      animate={{
        rotateY: [0, 360],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "linear",
      }}
      className="w-[350px] h-auto opacity-80"
      style={{
        filter: `
          drop-shadow(0 0 10px #38bdf8)
          drop-shadow(0 0 25px #38bdf8)
          drop-shadow(0 0 50px #38bdf8)
        `,
        transformStyle: "preserve-3d",
      }}
    />
  );
}