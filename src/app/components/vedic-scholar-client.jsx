"use client";

import { answerVedicQuestion } from "@/ai/flows/answer-vedic-questions";
import { suggestExplorationTopics } from "@/ai/flows/suggest-exploration-topics";
import { analyzeStoryForLessons } from "@/ai/flows/analyze-story-for-lessons";
import { OmIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BookText, ChevronRight, Loader2, Sparkles, BrainCircuit } from "lucide-react";
import { useCallback, useState } from "react";

const PREDEFINED_TOPICS = [
  "Deities",
  "The Mahabharata",
  "The Ramayana",
  "The Vedas",
  "The Upanishads",
  "Dharma",
  "Karma",
  "Moksha",
];
const TEXT_FILTERS = ["Mahabharata", "Ramayana", "Vedas", "Upanishads"];

export const VedicScholarClient = () => {
  const [question, setQuestion] = useState("");
  const [filter, setFilter] = useState("none");
  const [response, setResponse] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [suggestedTopics, setSuggestedTopics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleSubmission = useCallback(
    async (currentQuestion) => {
      if (!currentQuestion.trim()) return;

      setIsLoading(true);
      setResponse(null);
      setAnalysis(null);
      setSuggestedTopics(null);
      setQuestion(currentQuestion);

      try {
        const result = await answerVedicQuestion({
          question: currentQuestion,
          relevantText:
            filter === "none"
              ? undefined
              : (filter),
        });
        setResponse(result);

        const suggestions = await suggestExplorationTopics({
          topic: currentQuestion,
        });
        setSuggestedTopics(suggestions.suggestedTopics);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "An error occurred",
          description: "Failed to get an answer. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [filter, toast]
  );
  
  const handleAnalysis = useCallback(async () => {
    if (!response) return;
  
    setIsAnalyzing(true);
    setAnalysis(null);
  
    try {
      const result = await analyzeStoryForLessons({
        story: response.answer,
        question: question,
      });
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to analyze the story. Please try again.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [response, question, toast]);

  const handleTopicClick = (topic) => {
    const constructedQuestion = `Tell me about ${topic}`;
    handleSubmission(constructedQuestion);
  };

  const AnswerCard = ({
    answer,
    sources,
  }) => (
    <Card className="mt-6 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-primary">
          <Sparkles className="text-accent" />
          AI Generated Answer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap leading-relaxed">{answer}</p>
        {sources && sources.length > 0 && (
          <div className="mt-6">
            <h4 className="font-bold font-headline text-lg mb-2 text-primary">Sources</h4>
            <div className="flex flex-wrap gap-2">
              {sources.map((source, i) => (
                <Badge key={i} variant="secondary">
                  {source}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleAnalysis} disabled={isAnalyzing}>
          {isAnalyzing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <BrainCircuit className="mr-2 h-4 w-4" />
          )}
          Analyze Story
        </Button>
      </CardFooter>
    </Card>
  );

  const AnalysisCard = ({
    analysis,
    relevance,
  }) => (
    <Card className="mt-6 bg-card/80 backdrop-blur-sm border-accent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-primary">
          <BrainCircuit className="text-accent" />
          Story Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-bold font-headline text-lg mb-2 text-primary">Moral & Universal Principles</h4>
          <p className="whitespace-pre-wrap leading-relaxed">{analysis}</p>
        </div>
        <div>
          <h4 className="font-bold font-headline text-lg mb-2 text-primary">Contemporary Relevance</h4>
          <p className="whitespace-pre-wrap leading-relaxed">{relevance}</p>
        </div>
      </CardContent>
    </Card>
  );

  const ResponseArea = () => {
    if (isLoading) {
      return (
        <div className="space-y-4 mt-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-8 w-1/4 mt-4" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      );
    }

    if (response) {
      return (
        <>
          <AnswerCard answer={response.answer} sources={response.sources} />
          {isAnalyzing && (
            <div className="space-y-4 mt-6">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-8 w-1/4 mt-4" />
              <Skeleton className="h-24 w-full" />
            </div>
          )}
          {analysis && <AnalysisCard analysis={analysis.analysis} relevance={analysis.relevance} />}
        </>
      )
    }

    return (
      <div className="text-center mt-12">
        <OmIcon className="mx-auto h-16 w-16 text-primary/50" />
        <h2 className="mt-4 text-2xl font-headline text-primary">
          Vedic Scholar AI
        </h2>
        <p className="mt-2 text-muted-foreground">
          Ask a question or select a topic to begin your journey.
        </p>
      </div>
    );
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <h3 className="text-lg font-bold font-headline text-primary">
            Explore Topics
          </h3>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {PREDEFINED_TOPICS.map((topic) => (
              <SidebarMenuItem key={topic}>
                <SidebarMenuButton
                  onClick={() => handleTopicClick(topic)}
                  className="w-full justify-start font-body"
                >
                  <BookText className="text-accent" />
                  <span>{topic}</span>
                  <ChevronRight className="ml-auto" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Filter by Text</SidebarGroupLabel>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="font-body">
              <SelectValue placeholder="Select a text" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All Texts</SelectItem>
              {TEXT_FILTERS.map((text) => (
                <SelectItem key={text} value={text}>
                  {text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SidebarGroup>
      </Sidebar>
      <SidebarInset className="flex flex-col min-h-screen">
        <header className="p-4 border-b flex items-center gap-4 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
          <OmIcon className="h-8 w-8 text-accent" />
          <h1 className="text-2xl font-bold font-headline text-primary">
            Vedic Scholar AI
          </h1>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmission(question);
            }}
          >
            <div className="relative">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about Hindu deities, events, concepts..."
                className="pr-32 text-base min-h-[80px]"
                rows={3}
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="lg"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90"
                disabled={isLoading || !question.trim()}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-5 w-5" />
                )}
                Ask
              </Button>
            </div>
          </form>

          <ResponseArea />

          {suggestedTopics && suggestedTopics.length > 0 && (
            <Card className="mt-6 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-headline text-primary">
                  Further Exploration
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {suggestedTopics.map((topic, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    onClick={() => handleTopicClick(topic)}
                  >
                    {topic}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
