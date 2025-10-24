import React from 'react';
import { Card } from "@/components/ui/card";
import { Sparkles, Zap, Gamepad2, Wand2 } from "lucide-react";
import { motion } from "framer-motion";

const examples = [
  {
    icon: Zap,
    text: "Make a double jump script",
    color: "from-yellow-400 to-orange-500"
  },
  {
    icon: Gamepad2,
    text: "Create a simple obby checkpoint system",
    color: "from-blue-400 to-cyan-500"
  },
  {
    icon: Wand2,
    text: "Make a teleport GUI with buttons",
    color: "from-purple-400 to-pink-500"
  },
  {
    icon: Sparkles,
    text: "Create a coin collect system with leaderstats",
    color: "from-green-400 to-emerald-500"
  }
];

export default function ExamplePrompts({ onSelectExample }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        Try these examples
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {examples.map((example, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-red-200 bg-white group"
              onClick={() => onSelectExample(example.text)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${example.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <example.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {example.text}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
