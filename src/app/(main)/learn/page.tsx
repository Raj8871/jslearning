
// src/app/(main)/learn/page.tsx
import React from 'react'; // Import React
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Code, FunctionSquare, Variable, Workflow, FileJson, Network, AlertTriangle, Pointer, Timer } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Mock data for learning categories
const learningCategories = [
  { id: 'variables', title: 'Variables & Data Types', description: 'Learn var, let, const, and fundamental data types.', icon: Variable, href: '/learn/variables' },
  { id: 'functions', title: 'Functions', description: 'Declarations, expressions, arrow functions, parameters.', icon: FunctionSquare, href: '/learn/functions' },
  { id: 'loops', title: 'Loops & Iteration', description: 'Master for, while, do...while, and array iteration.', icon: Workflow, href: '/learn/loops' },
  { id: 'objects', title: 'Objects', description: 'Literals, properties, methods, prototypes, manipulation.', icon: Code , href: '/learn/objects' },
  { id: 'arrays', title: 'Arrays', description: 'Create, manipulate, and iterate over arrays.', icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 8L14 12L10 16"/><rect x="3" y="4" width="18" height="16" rx="2"/></svg>, href: '/learn/arrays' },
  { id: 'dom', title: 'DOM Manipulation', description: 'Select, modify, create, and delete HTML elements.', icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg> , href: '/learn/dom' },
  { id: 'es6', title: 'ES6+ Features', description: 'Arrow functions, destructuring, Promises, classes, etc.', icon: BookOpen, href: '/learn/es6' },
  { id: 'async', title: 'Async JavaScript', description: 'Callbacks, Promises, async/await for async operations.', icon: Timer , href: '/learn/async' },
  { id: 'error-handling', title: 'Error Handling', description: 'Using try...catch, throw, and handling Promise errors.', icon: AlertTriangle, href: '/learn/error-handling' },
  { id: 'this-keyword', title: 'The `this` Keyword', description: 'Understand context and how `this` is determined.', icon: Pointer, href: '/learn/this-keyword' },
  { id: 'json', title: 'JSON', description: 'Parse and stringify JavaScript Object Notation.', icon: FileJson, href: '/learn/json' },
  { id: 'fetch-api', title: 'Fetch API', description: 'Make network requests to fetch resources.', icon: Network, href: '/learn/fetch-api' },
];


export default function LearnPage() {
  return (
    <div className="container py-12 md:py-16 lg:py-20">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Learn JavaScript</h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          Explore interactive tutorials covering core concepts and advanced topics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {learningCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Link href={category.href} key={category.id} className="block group">
              <Card className="h-full transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1 border-transparent hover:border-accent">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <div className="flex-shrink-0 w-8 h-8"> {/* Added fixed size container */}
                    {/* Conditionally render based on type: functional component or Lucide icon */}
                    {typeof IconComponent === 'function' && !IconComponent.prototype?.render ? (
                       // It's likely a functional component (like our SVG wrappers or Lucide icons)
                      <IconComponent className="h-full w-full text-accent" />
                    ) : (
                       // It might be a class component (less likely) or handle potential edge cases
                      <span>Icon?</span> // Fallback or alternative rendering
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                   {/* You could add progress indication here later */}
                   <p className="text-sm text-accent group-hover:underline">
                       {/* Wrap text in a span */}
                       <span>Start Learning →</span>
                   </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

       {/* AI Explainer Teaser */}
       <div className="mt-20 text-center bg-secondary p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Stuck on a concept?</h2>
        <p className="text-muted-foreground mb-6">
          Use our AI Explainer to get instant clarification on any JavaScript code snippet or variable.
        </p>
        {/* Link this to the actual AI Explainer feature/page when built */}
        <Button asChild>
          <Link href="/runner#ai-explainer-section">
              {/* Wrap children in a span */}
              <span>Try AI Explainer</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

    