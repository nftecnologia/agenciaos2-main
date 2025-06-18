"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Loader2, AlertTriangle, TrendingUp, Clock, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

interface UpdateAnalysis {
  outdatedSections: {
    original: string;
    updated: string;
    reason: string;
  }[];
  newSections: {
    title: string;
    content: string;
    placement: string;
  }[];
  statistics: {
    old: string[];
    new: string[];
  };
  trends: string[];
  removeSuggestions: string[];
  seoUpdates: {
    keywords: string[];
    title?: string;
  };
  priority: string;
}

export function BlogUpdateAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<UpdateAnalysis | null>(null);
  const [formData, setFormData] = useState({
    content: "",
    topic: "",
    currentYear: new Date().getFullYear().toString()
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/ai/blog-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setAnalysis(data.data);
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "alta":
        return "destructive";
      case "média":
        return "secondary";
      case "baixa":
        return "outline";
      default:
        return "default";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "alta":
        return <AlertTriangle className="h-4 w-4" />;
      case "média":
        return <Clock className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Atualizador de Conteúdo
        </CardTitle>
        <CardDescription>
          Identifique seções desatualizadas e receba sugestões de melhorias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Conteúdo do Artigo</Label>
            <Textarea
              placeholder="Cole aqui o conteúdo que deseja analisar para atualizações..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tópico do Artigo (opcional)</Label>
              <Input
                placeholder="Ex: Marketing Digital, SEO, etc."
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Ano Atual</Label>
              <Input
                type="number"
                value={formData.currentYear}
                onChange={(e) => setFormData({ ...formData, currentYear: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analisando conteúdo...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Analisar Atualizações
              </>
            )}
          </Button>
        </form>

        {analysis && (
          <div className="mt-8 space-y-6">
            {/* Prioridade */}
            <Card className={`border-0 shadow-lg ${
              analysis.priority.toLowerCase() === 'alta' ? 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20' :
              analysis.priority.toLowerCase() === 'média' ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20' :
              'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20'
            }`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${
                      analysis.priority.toLowerCase() === 'alta' ? 'bg-red-500' :
                      analysis.priority.toLowerCase() === 'média' ? 'bg-yellow-500' :
                      'bg-green-500'
                    } text-white`}>
                      {getPriorityIcon(analysis.priority)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Prioridade de Atualização</p>
                      <p className="text-xs text-muted-foreground">Recomendação baseada na análise</p>
                    </div>
                  </div>
                  <Badge 
                    variant={getPriorityColor(analysis.priority)} 
                    className="text-lg px-4 py-1"
                  >
                    {analysis.priority.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Seções Desatualizadas */}
            {analysis.outdatedSections.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 rounded-lg">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse" />
                  <h3 className="text-lg font-semibold">Seções Desatualizadas</h3>
                  <Badge variant="secondary" className="ml-auto">
                    {analysis.outdatedSections.length} seções
                  </Badge>
                </div>
                <div className="space-y-4">
                  {analysis.outdatedSections.map((section, index) => (
                    <Card key={index} className="border-0 shadow-md overflow-hidden">
                      <div className="h-1 bg-gradient-to-r from-yellow-400 to-orange-400" />
                      <CardContent className="pt-6">
                        <Badge 
                          className="mb-4 bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200 border-yellow-300"
                        >
                          ⚠️ {section.reason}
                        </Badge>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-1 bg-red-500 rounded-full" />
                              <Label className="text-sm font-medium">Versão Original</Label>
                            </div>
                            <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900">
                              <p className="text-sm leading-relaxed">{section.original}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-1 bg-green-500 rounded-full" />
                              <Label className="text-sm font-medium">Versão Atualizada</Label>
                            </div>
                            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                              <p className="text-sm leading-relaxed">{section.updated}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Novas Seções Sugeridas */}
            {analysis.newSections.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <h3 className="text-lg font-semibold">Novas Seções Sugeridas</h3>
                  <Badge variant="secondary" className="ml-auto">
                    {analysis.newSections.length} adições
                  </Badge>
                </div>
                <div className="space-y-3">
                  {analysis.newSections.map((section, index) => (
                    <Card key={index} className="group border-0 shadow-sm hover:shadow-md transition-all">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                              <Plus className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{section.title}</h4>
                              <Badge 
                                variant="outline" 
                                className="mt-1 bg-green-50 dark:bg-green-950/50"
                              >
                                📍 {section.placement}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed pl-11">
                          {section.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Estatísticas */}
            {(analysis.statistics.old.length > 0 || analysis.statistics.new.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.statistics.old.length > 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-3 text-red-600">📊 Estatísticas Desatualizadas</h4>
                      <ul className="space-y-1">
                        {analysis.statistics.old.map((stat, index) => (
                          <li key={index} className="text-sm text-muted-foreground">• {stat}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {analysis.statistics.new.length > 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-3 text-green-600">📊 Estatísticas Atualizadas</h4>
                      <ul className="space-y-1">
                        {analysis.statistics.new.map((stat, index) => (
                          <li key={index} className="text-sm text-muted-foreground">• {stat}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Tendências Atuais */}
            {analysis.trends.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3">🚀 Tendências Atuais para Incluir</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.trends.map((trend, index) => (
                      <Badge key={index} variant="secondary">
                        {trend}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* SEO Updates */}
            {analysis.seoUpdates.keywords.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3">🔍 Atualizações SEO</h4>
                  {analysis.seoUpdates.title && (
                    <div className="mb-3">
                      <Label className="text-sm">Novo Título Sugerido</Label>
                      <p className="text-sm bg-muted p-2 rounded mt-1">{analysis.seoUpdates.title}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm">Novas Palavras-chave Relevantes</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {analysis.seoUpdates.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sugestões de Remoção */}
            {analysis.removeSuggestions.length > 0 && (
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3">🗑️ Conteúdo Obsoleto para Remover</h4>
                  <ul className="space-y-2">
                    {analysis.removeSuggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-red-500">×</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
