"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, AlertCircle, CheckCircle, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SeoAnalysis {
  seoScore: number;
  keywordDensity: {
    main: string;
    secondary: string[];
  };
  improvements: {
    title: string;
    metaDescription: string;
    headings: string[];
    internalLinks: string[];
    externalLinks: string[];
    contentGaps: string[];
    readability: string;
  };
  faq: {
    question: string;
    answer: string;
  }[];
  lsiKeywords: string[];
  actionItems: string[];
}

export function BlogSeoOptimizer() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SeoAnalysis | null>(null);
  const [formData, setFormData] = useState({
    content: "",
    mainKeyword: "",
    secondaryKeywords: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/ai/blog-seo", {
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Otimizador SEO
        </CardTitle>
        <CardDescription>
          Analise e otimize seu conteúdo para melhor ranqueamento nos buscadores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Conteúdo do Artigo</Label>
            <Textarea
              placeholder="Cole aqui o conteúdo do seu artigo..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Palavra-chave Principal</Label>
              <Input
                placeholder="Ex: marketing digital"
                value={formData.mainKeyword}
                onChange={(e) => setFormData({ ...formData, mainKeyword: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Palavras-chave Secundárias (opcional)</Label>
              <Input
                placeholder="Ex: redes sociais, vendas online"
                value={formData.secondaryKeywords}
                onChange={(e) => setFormData({ ...formData, secondaryKeywords: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analisando SEO...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analisar e Otimizar
              </>
            )}
          </Button>
        </form>

        {analysis && (
          <div className="mt-8 space-y-6">
            {/* Score SEO */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/20">
              <CardContent className="pt-8 pb-6">
                <div className="text-center mb-6">
                  <div className="relative inline-flex items-center justify-center mb-4">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative bg-background rounded-full p-8 shadow-inner">
                      <h3 className="text-5xl font-bold">
                        <span className={getScoreColor(analysis.seoScore)}>
                          {analysis.seoScore}
                        </span>
                        <span className="text-2xl text-muted-foreground">/100</span>
                      </h3>
                    </div>
                  </div>
                  <Badge 
                    variant={getScoreBadge(analysis.seoScore)} 
                    className="text-lg px-4 py-1"
                  >
                    Score SEO
                  </Badge>
                </div>
                <div className="relative">
                  <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-4 rounded-full transition-all duration-1000 ease-out ${
                        analysis.seoScore >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        analysis.seoScore >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        'bg-gradient-to-r from-red-500 to-pink-500'
                      }`}
                      style={{ width: `${analysis.seoScore}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Densidade de Palavras-chave */}
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  Densidade de Palavras-chave
                </h4>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Palavra-chave principal</span>
                      <Badge className="bg-primary text-primary-foreground">
                        {analysis.keywordDensity.main}
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-2 bg-primary rounded-full transition-all"
                        style={{ width: analysis.keywordDensity.main }}
                      />
                    </div>
                  </div>
                  
                  {analysis.keywordDensity.secondary.map((density, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Secundária {index + 1}</span>
                        <Badge variant="secondary">{density}</Badge>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-1.5 bg-secondary rounded-full transition-all"
                          style={{ width: density }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Melhorias Sugeridas */}
            <div className="space-y-4">
              <h4 className="font-semibold">Melhorias Sugeridas</h4>
              
              {/* Título e Meta Description */}
              <Card>
                <CardContent className="pt-6">
                  <h5 className="font-medium mb-3">📝 Título e Meta Tags</h5>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm">Título Otimizado</Label>
                      <p className="text-sm bg-muted p-2 rounded mt-1">{analysis.improvements.title}</p>
                    </div>
                    <div>
                      <Label className="text-sm">Meta Description</Label>
                      <p className="text-sm bg-muted p-2 rounded mt-1">{analysis.improvements.metaDescription}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Headings */}
              {analysis.improvements.headings.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h5 className="font-medium mb-3">📌 Sugestões de Headings</h5>
                    <div className="space-y-2">
                      {analysis.improvements.headings.map((heading, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge variant="secondary">H{index + 2}</Badge>
                          <span className="text-sm">{heading}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Legibilidade */}
              <Card>
                <CardContent className="pt-6">
                  <h5 className="font-medium mb-3">📖 Análise de Legibilidade</h5>
                  <p className="text-sm text-muted-foreground">{analysis.improvements.readability}</p>
                </CardContent>
              </Card>
            </div>

            {/* Palavras-chave LSI */}
            {analysis.lsiKeywords.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3">🔤 Palavras-chave LSI Recomendadas</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.lsiKeywords.map((keyword, index) => (
                      <Badge key={index} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ações Prioritárias */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <div className="p-2 bg-orange-500 text-white rounded-lg">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  Ações Prioritárias
                </h4>
                <div className="space-y-3">
                  {analysis.actionItems.map((action, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-3 bg-background/80 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="mt-0.5">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="text-sm flex-1">{action}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FAQ Sugeridas */}
            {analysis.faq.length > 0 && (
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-6 flex items-center gap-2">
                    <div className="p-2 bg-purple-500 text-white rounded-lg">
                      <HelpCircle className="h-5 w-5" />
                    </div>
                    FAQ Sugeridas para o Artigo
                  </h4>
                  <div className="space-y-4">
                    {analysis.faq.map((item, index) => (
                      <div 
                        key={index} 
                        className="group p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <p className="font-medium text-sm mb-2 group-hover:text-primary transition-colors">
                          {item.question}
                        </p>
                        <p className="text-sm text-muted-foreground pl-4 border-l-2 border-muted">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
