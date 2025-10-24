import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, Code } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const categoryColors = {
  script: "bg-blue-100 text-blue-800",
  gui: "bg-purple-100 text-purple-800",
  tool: "bg-green-100 text-green-800",
  game_mechanic: "bg-orange-100 text-orange-800",
  animation: "bg-pink-100 text-pink-800",
  sound: "bg-cyan-100 text-cyan-800",
  other: "bg-gray-100 text-gray-800"
};

export default function HistoryPanel({ history, onSelectHistory, isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5" />
            Recent Generations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5" />
            Recent Generations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No code generated yet</p>
            <p className="text-xs mt-1">Start by asking for some Roblox code!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5" />
          Recent Generations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="p-4 space-y-2">
            {history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onSelectHistory(item)}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                    {item.prompt}
                  </p>
                  <Badge className={`${categoryColors[item.category]} flex-shrink-0`}>
                    {item.category?.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">
                  {format(new Date(item.created_date), 'MMM d, h:mm a')}
                </p>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
