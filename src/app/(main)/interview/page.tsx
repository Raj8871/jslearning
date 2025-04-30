'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, RefreshCw } from 'lucide-react';
import { aiInterviewFeedback } from '@/ai/flows/ai-interview-feedback';
import { useToast } from '@/hooks/use-toast';

// Mock initial questions - In a real app, these might be fetched or generated
const initialQuestions = [
    "Explain the difference between `let`, `const`, and `var` in JavaScript.",
    "What is a closure in JavaScript? Provide an example.",
    "Describe the concept of prototypal inheritance.",
    "What are Promises and how do they differ from callbacks?",
    "Explain `async/await` and its benefits.",
    "What is the difference between `==` and `===`?",
    "How does `this` keyword work in JavaScript?",
    "What are higher-order functions?",
    "Explain event delegation.",
    "What is the Virtual DOM in the context of frameworks like React?",
];

export default function InterviewPage() {
    const [currentQuestion, setCurrentQuestion] = useState<string>('');
    const [userAnswer, setUserAnswer] = useState<string>('');
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isLoadingFeedback, setIsLoadingFeedback] = useState<boolean>(false);
    const [isLoadingQuestion, setIsLoadingQuestion] = useState<boolean>(false);
    const { toast } = useToast();

    // Function to get a new random question
    const getNewQuestion = () => {
        setIsLoadingQuestion(true);
        setFeedback(null); // Clear previous feedback
        setUserAnswer(''); // Clear previous answer
        // Simulate fetching/generating a new question
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * initialQuestions.length);
            // Ensure the new question is different from the current one if possible
            let newQuestion = initialQuestions[randomIndex];
            if (initialQuestions.length > 1) {
                while (newQuestion === currentQuestion) {
                    const newIndex = Math.floor(Math.random() * initialQuestions.length);
                    newQuestion = initialQuestions[newIndex];
                }
            }
            setCurrentQuestion(newQuestion);
            setIsLoadingQuestion(false);
        }, 500); // Simulate network delay
    };

    // Get initial question on mount
    useEffect(() => {
        getNewQuestion();
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle answer submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userAnswer.trim()) {
            toast({
                title: "Answer Required",
                description: "Please provide an answer before submitting.",
                variant: "destructive",
            });
            return;
        }

        setIsLoadingFeedback(true);
        setFeedback(null); // Clear previous feedback

        try {
            // Call the Genkit flow
            const result = await aiInterviewFeedback({
                question: currentQuestion,
                answer: userAnswer,
            });
            setFeedback(result.feedback);
        } catch (error) {
            console.error("Error getting AI feedback:", error);
            toast({
                title: "Error",
                description: "Failed to get feedback from AI. Please try again.",
                variant: "destructive",
            });
            setFeedback("Sorry, I couldn't process your answer right now. Please try again.");
        } finally {
            setIsLoadingFeedback(false);
        }
    };

    return (
        <div className="container py-12 md:py-16 lg:py-20">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">AI Interview Practice</h1>
                <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                    Test your JavaScript knowledge with AI-generated questions and feedback.
                </p>
            </div>

            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>Interview Question</CardTitle>
                    <CardDescription>Read the question below and provide your best answer.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-4 bg-secondary rounded-md min-h-[60px] flex items-center justify-center">
                        {isLoadingQuestion ? (
                             <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        ) : (
                            <p className="text-lg font-medium text-center">{currentQuestion}</p>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="answer">Your Answer</Label>
                            <Textarea
                                placeholder="Type your answer here..."
                                id="answer"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                className="min-h-[150px]"
                                disabled={isLoadingFeedback || isLoadingQuestion}
                            />
                        </div>
                        <div className="flex justify-between items-center">
                             <Button
                                type="button"
                                variant="outline"
                                onClick={getNewQuestion}
                                disabled={isLoadingFeedback || isLoadingQuestion}
                             >
                                <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingQuestion ? 'animate-spin' : ''}`} />
                                New Question
                             </Button>
                             <Button type="submit" disabled={isLoadingFeedback || isLoadingQuestion || !userAnswer.trim()}>
                                {isLoadingFeedback ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Getting Feedback...
                                    </>
                                ) : (
                                    'Submit Answer'
                                )}
                            </Button>
                        </div>
                    </form>

                    {feedback && (
                        <div className="mt-6 border-t pt-6">
                            <h3 className="text-xl font-semibold mb-3">AI Feedback</h3>
                            <div className="p-4 bg-secondary rounded-md whitespace-pre-wrap text-sm">
                                {feedback}
                            </div>
                        </div>
                    )}
                </CardContent>
                 {/* Optional Footer */}
                 {/* <CardFooter>
                     <p className="text-xs text-muted-foreground">Feedback is generated by AI and may not always be perfect.</p>
                 </CardFooter> */}
            </Card>
        </div>
    );
}
