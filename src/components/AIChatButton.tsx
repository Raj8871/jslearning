'use client';

import Link from 'next/link';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AIChatButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            variant="default" // Use primary color
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-accent hover:bg-accent/90 text-accent-foreground animate-bounce" // Bounce animation
            aria-label="Open AI Explainer"
          >
            <Link href="/runner#ai-explainer-section">
                {/* Wrap icon in a span */}
                <span>
                     <Bot className="h-7 w-7" />
                </span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Try the AI Code Explainer!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
