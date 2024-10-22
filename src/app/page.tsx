"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

// const ParallaxText = ({
//   children,
//   baseVelocity = 100,
// }: {
//   children: React.ReactNode;
//   baseVelocity?: number;
// }) => {
//   const [rotate, setRotate] = useState(0);
//   const baseX = useMotionValue(0);
//   const { scrollY } = useScroll();
//   const scrollVelocity = useVelocity(scrollY);
//   const smoothVelocity = useSpring(scrollVelocity, {
//     damping: 50,
//     stiffness: 400,
//   });
//   const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
//     clamp: false,
//   });

//   const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

//   useAnimationFrame((t, delta) => {
//     let moveBy = baseVelocity * (delta / 1000);
//     moveBy += moveBy * velocityFactor.get();
//     baseX.set(baseX.get() + moveBy);

//     setRotate(rotate + 0.1);
//   });

//   return (
//     <div className="parallax">
//       <motion.div className="scroller" style={{ x }}>
//         <motion.span
//           style={{ rotate: rotate }}
//           className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
//         >
//           {children}
//         </motion.span>
//       </motion.div>
//     </div>
//   );
// };

const FloatingCard = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 1, 0] }}
      whileTap={{ scale: 0.95 }}
    >
      <Card className="dark:bg-white/10 bg-black/10 backdrop-blur-lg border-0 shadow-xl">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-black/80 dark:text-white/80">{content}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const HomePage = () => {
  return (
    <div className="w-full overflow-hidden">
      <main>
        <section className="min-h-[75vh] flex flex-col justify-center items-center relative">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-6xl md:text-8xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
          >
            Welcome to the Adani Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-xl md:text-2xl text-center mb-12 text-black/80 dark:text-white/80 max-w-2xl"
          >
            Dashboard for Adani Limited Market Analysis
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <Link href={"/dashboard"}>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition duration-300">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
