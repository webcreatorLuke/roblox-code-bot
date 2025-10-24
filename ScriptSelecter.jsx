import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileCode, Clock } from "lucide-react";
import { format } from "date-fns";

export default function ScriptSelector({ history, selectedId, onSelect }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <FileCode className="w-4 h-4" />
        <span>Select Script:</span>
      </div>
      <Select value={selectedId} onValueChange={onSelect}>
        <SelectTrigger className="flex-1 max-w-md">
          <SelectValue placeholder="Choose a generated script" />
        </SelectTrigger>
        <SelectContent>
          {history.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              <div className="flex items-start justify-between gap-4 py-1">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.prompt}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {item.script_type && (
                      <span className="text-xs text-gray-500">
                        {item.script_type}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {format(new Date(item.created_date), 'MMM d, h:mm a')}
                    </span>
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
