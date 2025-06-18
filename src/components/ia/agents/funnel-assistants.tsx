"use client";

import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Plus, 
  Rocket, 
  TrendingDown
} from "lucide-react";

import { FunnelMainProductCreator } from "./funnel-main-product-creator";
import { FunnelOrderBumpExpress } from "./funnel-order-bump-express";
import { FunnelUpsellTurbo } from "./funnel-upsell-turbo";
import { FunnelDownsellRecovery } from "./funnel-downsell-recovery";

export function FunnelAssistants() {
  const [activeTab, setActiveTab] = useState("main-product");

  const assistants = [
    {
      id: "main-product",
      name: "Produto Principal",
      description: "Crie produtos digitais completos",
      icon: Package,
      component: FunnelMainProductCreator,
      badge: "Essential"
    },
    {
      id: "order-bump",
      name: "Order Bump Express",
      description: "Aumente o ticket médio sem atrito",
      icon: Plus,
      component: FunnelOrderBumpExpress,
      badge: "AOV +"
    },
    {
      id: "upsell",
      name: "Upsell Turbo",
      description: "Maximize o lifetime value",
      icon: Rocket,
      component: FunnelUpsellTurbo,
      badge: "LTV MAX"
    },
    {
      id: "downsell",
      name: "Downsell Recovery",
      description: "Recupere vendas perdidas",
      icon: TrendingDown,
      component: FunnelDownsellRecovery,
      badge: "Recovery"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium">
          <Package className="h-4 w-4" />
          Agentes para Funis de Vendas
        </div>
        <h2 className="text-3xl font-bold">
          Otimize seu <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Funil de Vendas</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Ferramentas estratégicas para criar produtos irresistíveis e maximizar conversões em cada etapa
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
