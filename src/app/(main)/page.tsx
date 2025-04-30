import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BrainCircuit, Code, MessageSquareQuote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-primary to-blue-700 dark:from-primary dark:to-blue-900">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-5xl xl:text-6xl/none">
                  Master JavaScript with JS Ascent
                </h1>
                <p className="max-w-[600px] text-primary-foreground/80 md:text-xl">
                  Interactive tutorials, AI-powered explanations, live code editor, and interview prep. Your journey to becoming a JavaScript pro starts here.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/learn">
                    {/* Wrap children in a span */}
                    <span>
                      Start Learning
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/runner">
                    {/* Wrap children in a span */}
                    <span>Try Code Runner</span>
                  </Link>
                </Button>
              </div>
            </div>
             <Image
                src="https://picsum.photos/600/400"
                data-ai-hint="abstract geometric shapes code learning"
                width={600}
                height={400}
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-lg"
              />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
               <div className="inline-block rounded-lg bg-accent/10 px-3 py-1 text-sm text-accent-foreground">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Accelerate Your JavaScript Skills</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                JS Ascent provides the tools you need to learn effectively and efficiently.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Code className="h-6 w-6 text-accent" /> Interactive Tutorials</CardTitle>
                <CardDescription>Learn by doing with hands-on exercises and clear explanations.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Covering everything from variables and functions to advanced ES6+ features and DOM manipulation.</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BrainCircuit className="h-6 w-6 text-accent" /> AI Explainer</CardTitle>
                <CardDescription>Understand complex code snippets or variable names instantly.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Paste your code or variable name and get a clear, AI-generated explanation.</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MessageSquareQuote className="h-6 w-6 text-accent" /> AI Interview Prep</CardTitle>
                <CardDescription>Practice common JavaScript interview questions with AI feedback.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Get ready for your next technical interview with targeted practice and analysis.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

       {/* Call to Action Section */}
       <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Ready to Ascend Your JavaScript Skills?</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join JS Ascent today and start your journey towards JavaScript mastery. It's free to get started!
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
             <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
               <Link href="/learn">
                 {/* Wrap children in a span */}
                 <span>
                   Start Learning Now
                   <ArrowRight className="ml-2 h-5 w-5" />
                 </span>
               </Link>
             </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
