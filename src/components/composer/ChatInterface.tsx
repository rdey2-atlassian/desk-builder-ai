import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { useEffect, useState } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  userPrompt: string;
  currentStep: number;
  totalSteps: number;
  steps: Array<{ id: string; label: string }>;
}

export const ChatInterface = ({ userPrompt, currentStep, totalSteps, steps }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "user-prompt",
      role: "user",
      content: userPrompt,
    },
  ]);

  useEffect(() => {
    if (currentStep === 0) {
      // Initial message
      setMessages((prev) => [
        ...prev,
        {
          id: "init",
          role: "assistant",
          content: "I'm analyzing your requirements and composing a helpdesk solution for you...",
        },
      ]);
    } else if (currentStep <= totalSteps) {
      const step = steps[currentStep - 1];
      const stepMessages: { [key: string]: string } = {
        portal: "Initializing a travel website with your branding and setting up email intake...",
        request_types: "Initializing 6 request types based on your travel desk needs...",
        knowledge: "Setting up knowledge base with 10 starter articles and policy documents...",
        integrations: "Connecting integrations: Okta, Slack, Confluence...",
        automations: "Configuring routing rules and approval workflows...",
        slas: "Setting up SLA targets for emergency and standard requests...",
        teams: "Adding the team structure with Owner, Agent, and Viewer roles...",
      };

      const message = stepMessages[step?.id] || `Initializing ${step?.label}...`;
      
      setMessages((prev) => [
        ...prev,
        {
          id: `step-${currentStep}`,
          role: "assistant",
          content: message,
        },
      ]);
    } else if (currentStep > totalSteps) {
      // Completion message
      setMessages((prev) => [
        ...prev,
        {
          id: "complete",
          role: "assistant",
          content: "✅ I have finished composing a helpdesk for you and have initialized all the components including portal, request types, knowledge base, integrations, automations, SLAs, and team structure. Would you like to test it out now?",
        },
      ]);
    }
  }, [currentStep, totalSteps, steps]);

  return (
    <Card className="p-6 h-full flex flex-col">
      <h3 className="font-semibold text-lg mb-4">Composition Progress</h3>
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 animate-fade-in ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="bg-primary/10">
                  <Bot className="w-4 h-4 text-primary" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`rounded-lg p-3 max-w-[80%] ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground ml-auto"
                  : "bg-muted"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === "user" && (
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="bg-primary/10">
                  <User className="w-4 h-4 text-primary" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
