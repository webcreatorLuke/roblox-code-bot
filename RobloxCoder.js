import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

import ExamplePrompts from '../components/roblox/ExamplePrompts';
import CodeOutput from '../components/roblox/CodeOutput';
import HistoryPanel from '../components/roblox/HistoryPanel';
import ScriptSelector from '../components/roblox/ScriptSelector';

export default function RobloxCoder() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [scriptType, setScriptType] = useState('');
  const [scriptLocation, setScriptLocation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedScriptId, setSelectedScriptId] = useState('');
  
  const queryClient = useQueryClient();

  const { data: history = [], isLoading: historyLoading } = useQuery({
    queryKey: ['codeGenerations'],
    queryFn: () => base44.entities.CodeGeneration.list('-created_date', 10),
  });

  // Auto-select the most recent script when history updates
  useEffect(() => {
    if (history.length > 0 && !selectedScriptId) {
      setSelectedScriptId(history[0].id);
      handleHistorySelect(history[0]);
    }
  }, [history]);

  const createGenerationMutation = useMutation({
    mutationFn: (data) => base44.entities.CodeGeneration.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['codeGenerations'] });
    },
  });

  const generateCode = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setCurrentPrompt(prompt);
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert Roblox Lua script developer. Generate clean, well-commented Roblox Lua code for the following request. 

IMPORTANT: You must respond with a JSON object in this exact format:
{
  "code": "the actual lua code here",
  "script_type": "Script" or "LocalScript" or "ModuleScript",
  "location": "where to place it (e.g., ServerScriptService, StarterPlayer.StarterCharacterScripts, StarterGui, Workspace, etc.)"
}

Follow Roblox best practices and include helpful comments in the code.

Request: ${prompt}`,
        response_json_schema: {
          type: "object",
          properties: {
            code: { type: "string" },
            script_type: { type: "string" },
            location: { type: "string" }
          },
          required: ["code", "script_type", "location"]
        }
      });

      const codeWithInfo = `-- Go in: ${response.location}\n-- This is a: ${response.script_type}\n\n${response.code}`;

      setGeneratedCode(codeWithInfo);
      setScriptType(response.script_type);
      setScriptLocation(response.location);
      
      const newItem = await createGenerationMutation.mutateAsync({
        prompt: prompt,
        generated_code: codeWithInfo,
        script_type: response.script_type,
        script_location: response.location,
        category: detectCategory(prompt)
      });

      setSelectedScriptId(newItem.id);
      setPrompt('');
    } catch (error) {
      console.error('Error generating code:', error);
    }
    
    setIsGenerating(false);
  };

  const detectCategory = (prompt) => {
    const lower = prompt.toLowerCase();
    if (lower.includes('gui') || lower.includes('ui') || lower.includes('button')) return 'gui';
    if (lower.includes('tool') || lower.includes('weapon')) return 'tool';
    if (lower.includes('jump') || lower.includes('walk') || lower.includes('mechanic')) return 'game_mechanic';
    if (lower.includes('anim')) return 'animation';
    if (lower.includes('sound') || lower.includes('music')) return 'sound';
    return 'script';
  };

  const handleExampleSelect = (exampleText) => {
    setPrompt(exampleText);
  };

  const handleHistorySelect = (item) => {
    setGeneratedCode(item.generated_code);
    setCurrentPrompt(item.prompt);
    setScriptType(item.script_type || '');
    setScriptLocation(item.script_location || '');
    setSelectedScriptId(item.id);
  };

  const handleScriptSelect = (scriptId) => {
    const selected = history.find(item => item.id === scriptId);
    if (selected) {
      handleHistorySelect(selected);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      generateCode();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50">
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-red-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Roblox AI Coder
            </h1>
            <p className="text-red-100 text-lg max-w-2xl mx-auto">
              Describe what you want to create and get instant Roblox Lua code
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 shadow-lg border-2 border-gray-100">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      What do you want to create?
                    </label>
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Example: Make a script that gives players a sword when they join..."
                      className="min-h-[120px] text-base resize-none"
                      disabled={isGenerating}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Press Ctrl + Enter to generate
                    </p>
                  </div>

                  <Button
                    onClick={generateCode}
                    disabled={!prompt.trim() || isGenerating}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-6 text-lg shadow-md hover:shadow-lg transition-all"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating your code...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Generate Code
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>

            {!generatedCode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <ExamplePrompts onSelectExample={handleExampleSelect} />
              </motion.div>
            )}

            {generatedCode && (
              <>
                <ScriptSelector 
                  history={history}
                  selectedId={selectedScriptId}
                  onSelect={handleScriptSelect}
                />
                <CodeOutput 
                  code={generatedCode} 
                  prompt={currentPrompt}
                  scriptType={scriptType}
                  scriptLocation={scriptLocation}
                />
              </>
            )}
          </div>

          <div>
            <HistoryPanel
              history={history}
              onSelectHistory={handleHistorySelect}
              isLoading={historyLoading}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <div className="text-center">
            <h3 className="font-semibold text-blue-900 mb-2">
              💡 Tips for better results
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
              <div>
                <p className="font-medium mb-1">Be specific</p>
                <p className="text-blue-600">
                  Include details about what you want the script to do
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Describe functionality</p>
                <p className="text-blue-600">
                  Explain how the script should work and what it should achieve
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Mention interactions</p>
                <p className="text-blue-600">
                  Tell if players interact with it or if it runs automatically
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
