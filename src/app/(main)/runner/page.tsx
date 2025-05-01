'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'; // Using Textarea as a simple editor for now
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Trash2, Loader2, BrainCircuit } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { explainCode } from '@/ai/flows/explain-code'; // Import the Genkit flow
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Basic security measure: Function constructor alternative (slightly safer context)
// Wrap code execution in a try-catch to handle potential runtime errors within the evaluated code
const safeEval = (code: string) => {
  let output = '';
  const customConsole = {
      log: (...args: any[]) => {
          output += args.map(arg => {
              if (typeof arg === 'object' && arg !== null) {
                  try {
                      // Limit stringification depth/length if needed in future
                      return JSON.stringify(arg, null, 2);
                  } catch (e: any) {
                      // Handle circular references more gracefully
                      if (e.name === 'TypeError' && e.message.includes('circular structure')) {
                          return '[Circular Object]';
                      }
                      return `[Error Stringifying Object: ${e.message}]`;
                  }
              }
              return String(arg);
          }).join(' ') + '\n';
      },
      error: (...args: any[]) => {
          output += `ERROR: ${args.map(String).join(' ')}\n`;
      },
      warn: (...args: any[]) => {
          output += `WARN: ${args.map(String).join(' ')}\n`;
      }
  };

  try {
      // Create a function with the custom console injected
      // Add a check for 'use strict' as it can cause issues when used globally inside the Function constructor
      const sanitizedCode = code.trim().startsWith("'use strict'") || code.trim().startsWith('"use strict"')
          ? code.substring(code.indexOf(';') + 1)
          : code;

      // Prevent direct access to global scope (experimental)
      const wrappedCode = `
        'use strict';
        const window = undefined;
        const document = undefined;
        const globalThis = undefined;
        ${sanitizedCode}
      `;

      const func = new Function('console', wrappedCode);
      func(customConsole); // Execute the code
      return { output: output || 'Code executed successfully (no console output).', error: null };
  } catch (error: any) {
      // Capture errors from the code execution itself
      console.error("Error during safeEval execution:", error); // Log the actual error for debugging
      return { output: output, error: error.message || 'An unknown error occurred during execution.' }; // Return the captured output along with the error
  }
};


export default function CodeRunnerPage() {
  const [code, setCode] = useState<string>("console.log('Hello, JS Ascent!');");
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isExplaining, setIsExplaining] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput(null);
    setError(null);
    setExplanation(null); // Clear explanation when running code

    // Simulate execution delay & run
    setTimeout(() => {
      const result = safeEval(code);
      setOutput(result.output);
      setError(result.error);
      setIsRunning(false);
    }, 50); // Reduced delay
  };

  const handleClearCode = () => {
    setCode('');
    setOutput(null);
    setError(null);
    setExplanation(null);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

 const handleExplainCode = async () => {
    if (!code.trim()) {
        toast({
            title: "Code Required",
            description: "Please enter some code to explain.",
            variant: "destructive",
        });
        return;
    }
    setIsExplaining(true);
    setExplanation(null); // Clear previous explanation
    setOutput(null); // Clear output/error
    setError(null);

    try {
        const result = await explainCode({ code });
        setExplanation(result.explanation);
    } catch (err: any) { // Catch specific error types if possible
        console.error("Error explaining code:", err);
        let description = "Could not get explanation from AI. Please try again.";
        // Check if the error message indicates a specific, potentially temporary issue
        if (err.message && (err.message.includes('503') || err.message.includes('overloaded') || err.message.includes('Service Unavailable'))) {
            description = "The AI model is temporarily unavailable or overloaded. Please try again in a few moments.";
        } else if (err.message && err.message.includes('API key not valid')) {
             description = "AI configuration error. Please check the API key.";
        }

        toast({
            title: "Explanation Failed",
            description: description,
            variant: "destructive",
        });
        setExplanation(`Sorry, an error occurred while generating the explanation: ${description}`); // Provide feedback in the explanation area too
    } finally {
        setIsExplaining(false);
    }
 };


  // Basic tab handling for the textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const value = e.currentTarget.value;

      // Insert 2 spaces for tab
      e.currentTarget.value = value.substring(0, start) + '  ' + value.substring(end);

      // Move cursor
      e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
    }
  };

  // Scroll to AI explainer section if hash is present
    useEffect(() => {
        if (window.location.hash === '#ai-explainer-section') {
            const element = document.getElementById('ai-explainer-section');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
            // Optionally clear the hash
            // window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
    }, []);


  return (
    <div className="container py-12 md:py-16 lg:py-20">
       <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Code Runner</h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          Write, run, and test your JavaScript code directly in the browser.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Code Editor Section */}
        <Card>
          <CardHeader>
            <CardTitle>JavaScript Editor</CardTitle>
            <CardDescription>Enter your code below.</CardDescription>
          </CardHeader>
          <CardContent className="relative">
             {/* Use a proper Code Editor component here in a real app (like CodeMirror, Monaco) */}
            <Textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="// Your JavaScript code here..."
              className="min-h-[300px] lg:min-h-[400px] font-mono text-sm bg-secondary border rounded-md focus-visible:ring-accent resize-none"
              spellCheck="false"
            />
             <div className="absolute bottom-4 right-4 flex space-x-2">
               <TooltipProvider>
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Button variant="ghost" size="icon" onClick={handleClearCode} disabled={isRunning || isExplaining}>
                       <Trash2 className="h-5 w-5" />
                       <span className="sr-only">Clear Code</span>
                     </Button>
                   </TooltipTrigger>
                   <TooltipContent>
                     <p>Clear Code</p>
                   </TooltipContent>
                 </Tooltip>
                <Tooltip>
                   <TooltipTrigger asChild>
                     <Button variant="ghost" size="icon" onClick={handleExplainCode} disabled={isRunning || isExplaining}>
                        <span className="inline-flex items-center justify-center"> {/* Wrap icon */}
                          <BrainCircuit className={`h-5 w-5 ${isExplaining ? 'text-accent animate-pulse' : ''}`} />
                        </span>
                       <span className="sr-only">Explain Code with AI</span>
                     </Button>
                   </TooltipTrigger>
                   <TooltipContent>
                     <p>Explain Code with AI</p>
                   </TooltipContent>
                 </Tooltip>
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Button onClick={handleRunCode} disabled={isRunning || isExplaining} className="bg-accent hover:bg-accent/90">
                        <span className="flex items-center">
                             {isRunning ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Play className="mr-2 h-4 w-4" />
                              )}
                              Run
                        </span>
                     </Button>
                   </TooltipTrigger>
                   <TooltipContent>
                     <p>Execute Code (Ctrl+Enter)</p>
                   </TooltipContent>
                 </Tooltip>
               </TooltipProvider>
             </div>
          </CardContent>
        </Card>

        {/* Output/Explanation Section */}
        <Card id="ai-explainer-section"> {/* Add ID here */}
          <CardHeader>
            <CardTitle>{explanation ? 'AI Explanation' : 'Output / Console'}</CardTitle> {/* Updated Title */}
            <CardDescription>{explanation ? 'AI analysis of your code.' : 'Results or errors from your code execution.'}</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] lg:h-[400px] w-full rounded-md border bg-secondary p-4">
              <pre className="text-sm whitespace-pre-wrap break-words">
                {isExplaining && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                {explanation && !isExplaining && explanation}
                {!explanation && isRunning && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                {!explanation && !isRunning && output && <code className="text-foreground">{output}</code>}
                {!explanation && !isRunning && error && <code className="text-destructive">{`Error: ${error}`}</code>}
                {!explanation && !isRunning && !output && !error && !isExplaining && (
                  <span className="text-muted-foreground">Run code or ask for explanation to see output.</span>
                )}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Keyboard shortcut for running code (optional)
// useEffect(() => {
//   const handleKeyDown = (event: KeyboardEvent) => {
//     if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
//        if (!isRunning && !isExplaining) {
//          handleRunCode();
//        }
//     }
//   };

//   window.addEventListener('keydown', handleKeyDown);
//   return () => {
//     window.removeEventListener('keydown', handleKeyDown);
//   };
// }, [isRunning, isExplaining, handleRunCode]); // Add dependencies
