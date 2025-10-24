import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Code, FolderTree, FileCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CodeOutput({ code, prompt, scriptType, scriptLocation }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!code) return null;

  const getScriptTypeColor = (type) => {
    switch(type) {
      case 'Script': return 'bg-green-100 text-green-800 border-green-200';
      case 'LocalScript': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ModuleScript': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {prompt && (
        <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
          <Code className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Your request:</p>
            <p className="text-sm text-red-700">{prompt}</p>
          </div>
        </div>
      )}

      {/* Script Info Cards */}
      {(scriptType || scriptLocation) && (
        <div className="grid md:grid-cols-2 gap-3">
          {scriptType && (
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <FileCode className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Script Type</p>
                    <Badge className={`mt-1 ${getScriptTypeColor(scriptType)} border font-semibold`}>
                      {scriptType}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {scriptLocation && (
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <FolderTree className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Place it in</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {scriptLocation}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      <Card className="overflow-hidden border-2 border-gray-200">
        <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-base font-mono flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="ml-2">{scriptType || 'Script'}.lua</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="text-white hover:bg-gray-700"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Copied!
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <pre className="bg-gray-900 text-gray-100 p-6 overflow-x-auto text-sm font-mono leading-relaxed max-h-[500px] overflow-y-auto">
            <code>{code}</code>
          </pre>
        </CardContent>
      </Card>
    </motion.div>
  );
}
