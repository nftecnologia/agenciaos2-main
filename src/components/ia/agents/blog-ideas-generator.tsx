"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Loader2, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";

interface BlogIdea {
  title: string;
  approach: string;
  keywords: string[];
  engagementPotential: string;
  reasoning: string;
}

export function BlogIdeasGenerator() {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<BlogIdea[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    niche: "",
    targetAudience: "",
    keywords: "",
    objectives: [] as string[]
  });

  const objectives = [
    { value: "Atrair tráfego", icon: "🎯" },
    { value: "Gerar leads", icon: "🧲" },
    { value: "Educar", icon: "📚" },
    { value: "Vender", icon: "💰" },
    { value: "Engajar", icon: "💬" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/ai/blog-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setIdeas(data.data.ideas || []);
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getPotentialColor = (potential: string) => {
    switch (potential.toLowerCase()) {
      case "alto":
        return "bg-green-500";
      case "médio":
        return "bg-yellow-500";
      case "baixo":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Gerador de Ideias de Artigos
        </CardTitle>
        <CardDescription>
          Gere ideias criativas e otimizadas para SEO baseadas no seu nicho
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nicho do Blog</Label>
              <Input
                placeholder="Ex: Marketing Digital, Tecnologia, Saúde..."
                value={formData.niche}
                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Público-alvo</Label>
              <Input
                placeholder="Ex: Empreendedores, Estudantes, Profissionais..."
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Palavras-chave (opcional)</Label>
            <Input
              placeholder="Ex: marketing digital, redes sociais, vendas online..."
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Objetivos do Blog</Label>
            <div className="flex flex-wrap gap-2">
              {objectives.map((obj) => (
                <Badge
                  key={obj.value}
                  variant={formData.objectives.includes(obj.value) ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => {
                    if (formData.objectives.includes(obj.value)) {
                      setFormData({
                        ...formData,
                        objectives: formData.objectives.filter((o) => o !== obj.value)
                      });
                    } else {
                      setFormData({
                        ...formData,
                        objectives: [...formData.objectives, obj.value]
                      });
                    }
                  }}
                >
                  <span className="mr-1">{obj.icon}</span>
                  {obj.value}
                </Badge>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando ideias...
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 h-4 w-4" />
                Gerar Ideias
              </>
            )}
          </Button>
        </form>

        {ideas.length > 0 && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                Ideias Geradas
              </h3>
              <Badge variant="secondary">{ideas.length} ideias</Badge>
            </div>
            
            <div className="grid gap-4">
              {ideas.map((idea, index) => (
                <Card 
                  key={index} 
                  className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/20"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                          {idea.title}
                        </h4>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyToClipboard(idea.title, index)}
                      >
                        {copiedIndex === index ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <Badge 
                        variant="secondary" 
                        className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      >
                        📝 {idea.approach}
                      </Badge>
                      <Badge 
                        className={`${getPotentialColor(idea.engagementPotential)} text-white`}
                      >
                        ⚡ Potencial {idea.engagementPotential}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {idea.reasoning}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {idea.keywords.map((keyword, kIndex) => (
                        <Badge 
                          key={kIndex} 
                          variant="outline" 
                          className="text-xs bg-background/50"
                        >
                          #{keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
