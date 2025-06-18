"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Loader2, Copy, Check, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BlogStructure {
  title: string;
  metaDescription: string;
  introduction: string;
  sections: {
    heading: string;
    subheadings: string[];
    cta?: string;
  }[];
  conclusion: string;
  faq: {
    question: string;
    answer: string;
  }[];
  internalLinks: string[];
  externalLinks: string[];
}

export function BlogStructureGenerator() {
  const [loading, setLoading] = useState(false);
  const [structure, setStructure] = useState<BlogStructure | null>(null);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    targetAudience: "",
    mainKeyword: "",
    articleLength: "medium"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/ai/blog-structure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setStructure({
          title: data.data.title || formData.title,
          metaDescription: data.data.metaDescription || "",
          introduction: data.data.introduction || "",
          sections: data.data.sections || [],
          conclusion: data.data.conclusion || "",
          faq: data.data.faq || [],
          internalLinks: data.data.internalLinks || [],
          externalLinks: data.data.externalLinks || []
        });
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyStructure = () => {
    if (!structure) return;
    
    const text = `
# ${structure.title}

**Meta Description:** ${structure.metaDescription}

## Introdução
${structure.introduction}

${structure.sections.map((section, index) => `
## ${index + 1}. ${section.heading}
${section.subheadings.map(sub => `- ${sub}`).join('\n')}
${section.cta ? `\n**CTA:** ${section.cta}` : ''}
`).join('\n')}

## Conclusão
${structure.conclusion}

## FAQ
${structure.faq.map(item => `**P:** ${item.question}\n**R:** ${item.answer}`).join('\n\n')}
    `.trim();
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Estruturador de Post
        </CardTitle>
        <CardDescription>
          Crie uma estrutura detalhada e otimizada para seu artigo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Título do Artigo</Label>
            <Input
              placeholder="Ex: Como Aumentar Vendas Online em 2024"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Público-alvo</Label>
              <Input
                placeholder="Ex: Empreendedores digitais iniciantes"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Palavra-chave Principal</Label>
              <Input
                placeholder="Ex: vendas online"
                value={formData.mainKeyword}
                onChange={(e) => setFormData({ ...formData, mainKeyword: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tamanho do Artigo</Label>
            <Select
              value={formData.articleLength}
              onValueChange={(value) => setFormData({ ...formData, articleLength: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Curto (500-800 palavras)</SelectItem>
                <SelectItem value="medium">Médio (1000-1500 palavras)</SelectItem>
                <SelectItem value="long">Longo (2000+ palavras)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Estruturando artigo...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Gerar Estrutura
              </>
            )}
          </Button>
        </form>

        {structure && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                Estrutura do Artigo
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={copyStructure}
                className="hover:shadow-md transition-all"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar Estrutura
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              {/* Título e Meta Description */}
              <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-1 bg-purple-500 rounded-full" />
                    <h4 className="font-semibold">Título Otimizado (H1)</h4>
                  </div>
                  <p className="text-lg mb-6 font-medium">{structure.title}</p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">SEO</Badge>
                    <h4 className="font-semibold">Meta Description</h4>
                  </div>
                  <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded-lg">{structure.metaDescription}</p>
                </CardContent>
              </Card>

              {/* Introdução */}
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <div className="p-2 bg-blue-500 text-white rounded-lg">
                      📝
                    </div>
                    Introdução
                  </h4>
                  <p className="text-sm bg-muted/50 p-4 rounded-lg leading-relaxed">{structure.introduction}</p>
                </CardContent>
              </Card>

              {/* Seções */}
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-6 flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-lg">
                      📋
                    </div>
                    Estrutura de Tópicos
                  </h4>
                  <div className="space-y-6">
                    {structure.sections.map((section, index) => (
                      <div 
                        key={index} 
                        className="relative p-4 bg-gradient-to-r from-transparent to-muted/30 rounded-lg border-l-4 border-primary hover:shadow-md transition-all"
                      >
                        <div className="absolute -left-4 top-4 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="ml-4">
                          <h5 className="font-semibold mb-3 text-lg">
                            {section.heading} <Badge variant="outline" className="ml-2">H2</Badge>
                          </h5>
                          <div className="space-y-2">
                            {section.subheadings.map((sub, subIndex) => (
                              <div 
                                key={subIndex} 
                                className="flex items-start gap-3 ml-4 p-2 hover:bg-muted/50 rounded transition-colors"
                              >
                                <ChevronRight className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <span className="text-sm flex-1">{sub}</span>
                                <Badge variant="secondary" className="text-xs">H3</Badge>
                              </div>
                            ))}
                          </div>
                          {section.cta && (
                            <div className="mt-3 ml-4">
                              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                                💡 CTA: {section.cta}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* FAQ */}
              {structure.faq.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-4">Perguntas Frequentes</h4>
                    <div className="space-y-3">
                      {structure.faq.map((item, index) => (
                        <div key={index}>
                          <p className="font-medium text-sm">{item.question}</p>
                          <p className="text-sm text-muted-foreground mt-1">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Links Sugeridos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {structure.internalLinks.length > 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Links Internos Sugeridos</h4>
                      <ul className="text-sm space-y-1">
                        {structure.internalLinks.map((link, index) => (
                          <li key={index} className="text-muted-foreground">• {link}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {structure.externalLinks.length > 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Links Externos Sugeridos</h4>
                      <ul className="text-sm space-y-1">
                        {structure.externalLinks.map((link, index) => (
                          <li key={index} className="text-muted-foreground">• {link}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
