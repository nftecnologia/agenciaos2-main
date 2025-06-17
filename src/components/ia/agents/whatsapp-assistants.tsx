"use client";

import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Mic, 
  MessageCircle, 
  TrendingUp, 
  RefreshCcw, 
  HeartHandshake 
} from "lucide-react";

import { WhatsappBroadcastGenerator } from "./whatsapp-broadcast-generator";
import { WhatsappAudioScriptGenerator } from "./whatsapp-audio-script-generator";
import { WhatsappTemplatesGenerator } from "./whatsapp-templates-generator";
import { WhatsappSalesScriptGenerator } from "./whatsapp-sales-script-generator";
import { WhatsappFollowupGenerator } from "./whatsapp-followup-generator";
import { WhatsappSupportGenerator } from "./whatsapp-support-generator";

export function WhatsappAssistants() {
  const [activeTab, setActiveTab] = useState("broadcast");

  const assistants = [
    {
      id: "broadcast",
      name: "Mensagens de Lista",
      description: "Campanhas de broadcast profissionais",
      icon: MessageSquare,
      component: WhatsappBroadcastGenerator,
      badge: "Popular"
    },
    {
      id: "audio",
      name: "Scripts de Áudio",
      description: "Roteiros para gravação de áudios",
      icon: Mic,
      component: WhatsappAudioScriptGenerator,
      badge: "Novo"
    },
    {
      id: "templates",
      name: "Respostas Rápidas",
      description: "Templates para atendimento ágil",
      icon: MessageCircle,
      component: WhatsappTemplatesGenerator,
      badge: "Essencial"
    },
    {
      id: "sales",
      name: "Scripts de Vendas",
      description: "Scripts para cada etapa da venda",
      icon: TrendingUp,
      component: WhatsappSalesScriptGenerator,
      badge: "Premium"
    },
    {
      id: "followup",
      name: "Follow-up",
      description: "Mensagens de reengajamento",
      icon: RefreshCcw,
      component: WhatsappFollowupGenerator,
      badge: "Estratégico"
    },
    {
      id: "support",
      name: "Atendimento",
      description: "Scripts para suporte ao cliente",
      icon: HeartHandshake,
      component: WhatsappSupportGenerator,
      badge: "Importante"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-full text-sm font-medium">
          <MessageSquare className="h-4 w-4" />
          Assistentes para WhatsApp
        </div>
        <h2 className="text-3xl font-bold">
          Ferramentas IA para <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">WhatsApp</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Otimize sua comunicação no WhatsApp com scripts profissionais e personalizados
        </p>
      </div>

      {/* Assistant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assistants.map((assistant) => {
          const Icon = assistant.icon;
          return (
            <Card 
              key={assistant.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                activeTab === assistant.id ? 'ring-2 ring-green-600' : ''
              }`}
              onClick={() => setActiveTab(assistant.id)}
            >
              <CardHeader className="space-y-1">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${
                    activeTab === assistant.id ? 'bg-gradient-to-r from-green-100 to-teal-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      activeTab === assistant.id ? 'text-green-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {assistant.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{assistant.name}</CardTitle>
                <CardDescription className="text-sm">
                  {assistant.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="hidden">
          {assistants.map((assistant) => (
            <TabsTrigger key={assistant.id} value={assistant.id}>
              {assistant.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {assistants.map((assistant) => {
          const Component = assistant.component;
          return (
            <TabsContent key={assistant.id} value={assistant.id}>
              <Component />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
