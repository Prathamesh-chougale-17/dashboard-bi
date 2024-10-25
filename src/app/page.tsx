"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
            <p>Welcome to the Atharv</p>
            E-commerce Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-xl md:text-2xl text-center mb-12 text-black/80 dark:text-white/80 max-w-2xl"
          >
            A powerful dashboard to help you manage your e-commerce business
            more efficiently
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
