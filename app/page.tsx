/* app/page.tsx */
"use client";

import Head from "next/head";
import { motion, animate } from "framer-motion";
import { useEffect, useState, useRef } from "react";

// Utility functions
function daysInCurrentMonth(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}
function secondsInMonth(): number {
  return daysInCurrentMonth() * 24 * 60 * 60;
}
function earningsPerSecond(monthlySalary: number): number {
  return monthlySalary / secondsInMonth();
}
function elapsedSecondsSinceMonthStart(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  return (now.getTime() - start.getTime()) / 1000;
}

export default function Home() {
  const [salary, setSalary] = useState<number>(0);
  const [displayed, setDisplayed] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSalary, setModalSalary] = useState<string>("");

  const perSecondRef = useRef<number>(0);

  // Load salary from localStorage on mount
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("salary") : null;
    if (stored) {
      const val = parseFloat(stored);
      if (!isNaN(val)) setSalary(val);
    }
  }, []);

  // Update per-second rate whenever salary changes
  useEffect(() => {
    perSecondRef.current = earningsPerSecond(salary);

    // Recalculate base earned amount at month start
    const base = perSecondRef.current * elapsedSecondsSinceMonthStart();

    setDisplayed(base);

  }, [salary]);

  // Animation loop – updates every frame for smooth count-up
  useEffect(() => {
    let animationFrame: number;
    const startTime = performance.now();
    const baseElapsed = elapsedSecondsSinceMonthStart();
    const baseAmount = perSecondRef.current * baseElapsed;

    const step = (now: number) => {
      const deltaSec = (now - startTime) / 1000;
      const newAmount = baseAmount + perSecondRef.current * deltaSec;
      setDisplayed(newAmount);
      animationFrame = requestAnimationFrame(step);
    };
    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [salary]);



  // Format number as currency (₹) with two decimals and commas
  const formatCurrency = (num: number) => {
    // Returns only the numeric part; the ₹ symbol will be added separately for consistent alignment.
    return num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Helper to format number without currency symbol.
  const formatNumber = formatCurrency;

  // Open settings to set monthly salary
  const handleSettingsClick = () => {
    setIsModalOpen(true);
  };

  const perSecFormatted = formatNumber(perSecondRef.current);


  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Live Earnings Tracker</title>
        <meta name="description" content="Real-time earnings calculator that updates based on your monthly salary, with persistent storage and smooth animation." />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800">
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-4 right-4 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 shadow-lg transition-colors"
        >
          Settings
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm mx-4">
              <h2 className="text-xl font-semibold mb-4">Set Monthly Salary</h2>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                value={modalSalary}
                onChange={e => setModalSalary(e.target.value)}
                placeholder="Enter salary in ₹"
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  onClick={() => {
                    setIsModalOpen(false);
                    setModalSalary("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                  onClick={() => {
                    const val = parseFloat(modalSalary);
                    if (!isNaN(val)) {
                      setSalary(val);
                      localStorage.setItem("salary", val.toString());
                    }
                    setIsModalOpen(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

                <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl p-6 sm:p-8 shadow-xl max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl w-full mx-4">
          <motion.h1
            className="text-4xl md:text-6xl font-bold tracking-wider text-white drop-shadow-lg text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
          <span className="inline-flex items-baseline">
            <span className="text-4xl md:text-6xl mr-1">₹</span>
            <span className="text-4xl md:text-6xl">{formatNumber(displayed)}</span>
          </span>
        </motion.h1>
        <p className="text-base md:text-lg text-gray-200 text-center mt-2">
          <span className="inline-flex items-baseline">
            <span className="text-base md:text-lg mr-1">₹</span>
            <span>{perSecFormatted}</span>
          </span>
          /sec
        </p>

        </div>
      </main>
    </>
  );
}
