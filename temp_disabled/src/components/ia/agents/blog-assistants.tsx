"use client";

import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Lightbulb, 
  Type, 
  Search, 
  Link, 
  RefreshCw, 
  HelpCircle, 
  BookOpen 
} from "lucide-react";

import { BlogIdeasGenerator } from "./blog-ideas-generator";
import { BlogStructureGenerator } from "./blog-structure-generator";
import { BlogParagraphGenerator } from "./blog-paragraph-generator";
import { BlogSeoOptimizer } from "./blog-seo-optimizer";
import { BlogMetaGenerator } from "./blog-meta-generator";
import { BlogUpdateAnalyzer } from "./blog-update-analyzer";
import { BlogFaqGenerator } from "./blog-faq-generator";
import { BlogCompleteWriter } from "./blog-complete-writer";

export function BlogAssistants() {
  const [activeTab, setActiveTab] = useState("ideas");

  const assistants = [
    {
      id: "ideas",
      name: "Ideias de Artigos",
      description: "Gere ideias criativas e otimizadas",
      icon: Lightbulb,
      component: BlogIdeasGenerator,
      badge: "Criativo"
    },
    {
      id: "structure",
      name: "Estruturas",
      description: "Crie estruturas detalhadas",
      icon: FileText,
      component: BlogStructureGenerator,
      badge: "Organização"
    },
    {
      id: "paragraph",
      name: "Parágrafos",
      description: "Desenvolva seções específicas",
      icon: Type,
      component: BlogParagraphGenerator,
      badge: "Conteúdo"
    },
    {
      id: "seo",
      name: "Otimização SEO",
      description: "Melhore seu ranqueamento",
      icon: Search,
      component: BlogSeoOptimizer,
      badge: "Essencial"
    },
    {
      id: "meta",
      name: "Meta Tags",
      description: "Meta descriptions otimizadas",
      icon: Link,
      component: BlogMetaGenerator,
      badge: "SEO"
    },
    {
      id: "update",
      name: "Atualizar Conteúdo",
      description: "Identifique melhorias",
      icon: RefreshCw,
      component: BlogUpdateAnalyzer,
      badge: "Manutenção"
    },
    {
      id: "faq",
      name: "FAQs",
      description: "Perguntas frequentes",
      icon: HelpCircle,
      component: BlogFaqGenerator,
      badge: "Engajamento"
    },
    {
      id: "complete",
      name: "Artigos Completos",
      description: "Artigos prontos para publicar",
      icon: BookOpen,
      component: BlogCompleteWriter,
      badge: "Recomendado"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium">
          <BookOpen className="h-4 w-4" />
          Assistentes para Blog
        </div>
        <h2 className="text-3xl font-bold">
          Ferramentas IA para <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Blog</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Ferramentas completas de IA para criar conteúdo otimizado
        </p>
      </div>

      {/* Assistant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {assistants.map((assistant) => {
          const Icon = assistant.icon;
          return (
            <Card 
              key={assistant.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                activeTab === assistant.id ? 'ring-2 ring-purple-600' : ''
              }`}
              onClick={() => setActiveTab(assistant.id)}
            >
              <CardHeader className="space-y-1">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${
                    activeTab === assistant.id ? 'bg-gradient-to-r from-purple-100 to-pink-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      activeTab === assistant.id ? 'text-purple-600' : 'text-gray-600'
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
