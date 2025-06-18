"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Type, Loader2, Copy, Check, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GeneratedContent {
  paragraphs: string[];
  examples: string[];
  keyPoints: string[];
  suggestions: string;
}

export function BlogParagraphGenerator() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    topic: "",
    section: "",
    targetAudience: "",
    tone: "conversacional",
    context: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/ai/blog-paragraph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setContent(data.data);
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyParagraph = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAllParagraphs = () => {
    if (!content) return;
    const allText = content.paragraphs.join("\n\n");
    navigator.clipboard.writeText(allText);
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="h-5 w-5" />
          Gerador de Parágrafos
        </CardTitle>
        <CardDescription>
          Desenvolva seções específicas do seu artigo com conteúdo rico e envolvente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tema do Artigo</Label>
              <Input
                placeholder="Ex: Marketing Digital para Pequenas Empresas"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Seção a Desenvolver</Label>
              <Input
                placeholder="Ex: Benefícios do Marketing Digital"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Público-alvo</Label>
              <Input
                placeholder="Ex: Empreendedores iniciantes"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Tom de Voz</Label>
              <Select
                value={formData.tone}
                onValueChange={(value) => setFormData({ ...formData, tone: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conversacional">Conversacional</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="tecnico">Técnico</SelectItem>
                  <SelectItem value="motivacional">Motivacional</SelectItem>
                  <SelectItem value="educativo">Educativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Contexto Adicional (opcional)</Label>
            <Textarea
              placeholder="Adicione informações extras que devem ser consideradas..."
              value={formData.context}
              onChange={(e) => setFormData({ ...formData, context: e.target.value })}
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando parágrafos...
              </>
            ) : (
              <>
                <Type className="mr-2 h-4 w-4" />
                Gerar Parágrafos
              </>
            )}
          </Button>
        </form>

        {content && (
          <div className="mt-8 space-y-6">
            {/* Parágrafos Gerados */}
            <div>
              <div className="flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                  Parágrafos Gerados
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyAllParagraphs}
                  className="hover:shadow-md transition-all"
                >
                  {copiedIndex === -1 ? (
                    <>
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar Todos
                    </>
                  )}
                </Button>
              </div>
              
              <div className="space-y-4">
                {content.paragraphs.map((paragraph, index) => (
                  <Card 
                    key={index} 
                    className="group border-0 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-background to-muted/20"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <Badge variant="outline" className="mb-2">
                            Parágrafo {index + 1}
                          </Badge>
                          <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
                            {paragraph}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyParagraph(paragraph, index)}
                        >
                          {copiedIndex === index ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Exemplos */}
            {content.examples.length > 0 && (
              <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <div className="p-2 bg-blue-500 text-white rounded-lg">
                      <Plus className="h-4 w-4" />
                    </div>
                    Exemplos Sugeridos
                  </h4>
                  <div className="space-y-3">
                    {content.examples.map((example, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-background/80 rounded-lg">
                        <Badge 
                          variant="secondary" 
                          className="mt-0.5 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        >
                          Ex {index + 1}
                        </Badge>
                        <p className="text-sm text-muted-foreground flex-1">{example}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pontos-Chave */}
            {content.keyPoints.length > 0 && (
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-lg">
                      ✓
                    </div>
                    Pontos-Chave
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {content.keyPoints.map((point, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="h-2 w-2 bg-green-500 rounded-full shrink-0" />
                        <span className="text-sm">{point}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sugestões */}
            {content.suggestions && (
              <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-lg animate-pulse">
                      💡
                    </div>
                    Sugestões para Expandir
                  </h4>
                  <p className="text-sm leading-relaxed bg-background/60 p-4 rounded-lg">{content.suggestions}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
