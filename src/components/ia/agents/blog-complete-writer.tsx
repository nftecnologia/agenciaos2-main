"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Loader2, Download, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CompleteArticle {
  article: {
    title: string;
    introduction: string;
    sections: {
      heading: string;
      content: string;
      subSections?: {
        heading: string;
        content: string;
      }[];
    }[];
    conclusion: string;
    faq: {
      question: string;
      answer: string;
    }[];
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    slug: string;
    keywordDensity: string;
    readabilityScore: string;
  };
  enhancements: {
    internalLinks: string[];
    externalLinks: string[];
    ctas: string[];
    images: {
      placement: string;
      description: string;
      altText: string;
    }[];
  };
  socialMedia: {
    tldr: string;
    linkedinIntro: string;
    twitterThread: string[];
    openGraph: {
      title: string;
      description: string;
    };
  };
  checklist: {
    seoScore: number;
    issues: string[];
    improvements: string[];
  };
}

export function BlogCompleteWriter() {
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState<CompleteArticle | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    niche: "",
    topic: "",
    mainKeyword: "",
    secondaryKeywords: "",
    targetAudience: "",
    objective: "atrair-trafego",
    tone: "conversacional",
    wordCount: "1000",
    additionalInfo: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/ai/blog-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setArticle(data.data);
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const copySection = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const downloadArticle = () => {
    if (!article) return;
    
    let content = `# ${article.article.title}\n\n`;
    content += `${article.article.introduction}\n\n`;
    
    article.article.sections.forEach(section => {
      content += `## ${section.heading}\n\n${section.content}\n\n`;
      if (section.subSections) {
        section.subSections.forEach(sub => {
          content += `### ${sub.heading}\n\n${sub.content}\n\n`;
        });
      }
    });
    
    content += `## Conclusão\n\n${article.article.conclusion}\n\n`;
    
    if (article.article.faq.length > 0) {
      content += `## FAQ\n\n`;
      article.article.faq.forEach(faq => {
        content += `**${faq.question}**\n${faq.answer}\n\n`;
      });
    }
    
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${article.seo.slug}.md`;
    a.click();
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { variant: "default" as const, color: "text-green-600" };
    if (score >= 60) return { variant: "secondary" as const, color: "text-yellow-600" };
    return { variant: "destructive" as const, color: "text-red-600" };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Gerador de Artigo Completo
        </CardTitle>
        <CardDescription>
          Crie artigos completos, otimizados para SEO e prontos para publicar
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nicho</Label>
              <Input
                placeholder="Ex: Marketing Digital"
                value={formData.niche}
                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Tema do Artigo</Label>
              <Input
                placeholder="Ex: Como Criar Conteúdo Viral"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Palavra-chave Principal</Label>
              <Input
                placeholder="Ex: conteúdo viral"
                value={formData.mainKeyword}
                onChange={(e) => setFormData({ ...formData, mainKeyword: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Palavras-chave Secundárias</Label>
              <Input
                placeholder="Ex: marketing viral, engajamento"
                value={formData.secondaryKeywords}
                onChange={(e) => setFormData({ ...formData, secondaryKeywords: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Público-alvo</Label>
              <Input
                placeholder="Ex: Criadores de conteúdo"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Objetivo do Artigo</Label>
              <Select
                value={formData.objective}
                onValueChange={(value) => setFormData({ ...formData, objective: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="atrair-trafego">Atrair Tráfego</SelectItem>
                  <SelectItem value="gerar-leads">Gerar Leads</SelectItem>
                  <SelectItem value="educar">Educar</SelectItem>
                  <SelectItem value="converter">Converter</SelectItem>
                  <SelectItem value="engajar">Engajar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label>Tamanho do Artigo</Label>
              <Select
                value={formData.wordCount}
                onValueChange={(value) => setFormData({ ...formData, wordCount: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500">500-800 palavras</SelectItem>
                  <SelectItem value="1000">1000-1500 palavras</SelectItem>
                  <SelectItem value="2000">2000-2500 palavras</SelectItem>
                  <SelectItem value="3000">3000+ palavras</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Informações Adicionais (opcional)</Label>
            <Textarea
              placeholder="Adicione contexto extra, requisitos específicos..."
              value={formData.additionalInfo}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando artigo completo...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Gerar Artigo Completo
              </>
            )}
          </Button>
        </form>

        {article && (
          <div className="mt-6">
            <Tabs defaultValue="article" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="article">Artigo</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="enhancements">Melhorias</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="checklist">Checklist</TabsTrigger>
              </TabsList>

              {/* Artigo Tab */}
              <TabsContent value="article" className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">{article.article.title}</h3>
                  <Button variant="outline" onClick={downloadArticle}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>

                {/* Introdução */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Introdução</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copySection(article.article.introduction, "intro")}
                      >
                        {copiedSection === "intro" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {article.article.introduction}
                    </p>
                  </CardContent>
                </Card>

                {/* Seções */}
                {article.article.sections.map((section, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-lg">{section.heading}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copySection(section.content, `section-${index}`)}
                        >
                          {copiedSection === `section-${index}` ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-4">
                        {section.content}
                      </p>
                      
                      {section.subSections && section.subSections.map((sub, subIndex) => (
                        <div key={subIndex} className="ml-4 mt-4 border-l-2 border-muted pl-4">
                          <h5 className="font-medium mb-2">{sub.heading}</h5>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {sub.content}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}

                {/* Conclusão */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Conclusão</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copySection(article.article.conclusion, "conclusion")}
                      >
                        {copiedSection === "conclusion" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {article.article.conclusion}
                    </p>
                  </CardContent>
                </Card>

                {/* FAQ */}
                {article.article.faq.length > 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-4">FAQ</h4>
                      <div className="space-y-3">
                        {article.article.faq.map((faq, index) => (
                          <div key={index} className="pb-3 border-b last:border-0">
                            <p className="font-medium text-sm mb-1">{faq.question}</p>
                            <p className="text-sm text-muted-foreground">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* SEO Tab */}
              <TabsContent value="seo" className="space-y-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <Label className="text-sm">Título SEO</Label>
                      <p className="text-sm bg-muted p-2 rounded mt-1">{article.seo.metaTitle}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm">Meta Description</Label>
                      <p className="text-sm bg-muted p-2 rounded mt-1">{article.seo.metaDescription}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm">URL Slug</Label>
                      <code className="text-sm bg-muted p-2 rounded mt-1 block">/{article.seo.slug}</code>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">Densidade de Palavra-chave</Label>
                        <Badge variant="outline" className="mt-1">{article.seo.keywordDensity}</Badge>
                      </div>
                      <div>
                        <Label className="text-sm">Score de Legibilidade</Label>
                        <Badge variant="outline" className="mt-1">{article.seo.readabilityScore}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Enhancements Tab */}
              <TabsContent value="enhancements" className="space-y-4">
                {/* CTAs */}
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3">📣 CTAs Sugeridos</h4>
                    <div className="space-y-2">
                      {article.enhancements.ctas.map((cta, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge variant="secondary">CTA {index + 1}</Badge>
                          <span className="text-sm">{cta}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-3">🔗 Links Internos</h4>
                      <ul className="space-y-1">
                        {article.enhancements.internalLinks.map((link, index) => (
                          <li key={index} className="text-sm text-muted-foreground">• {link}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-3">🌐 Links Externos</h4>
                      <ul className="space-y-1">
                        {article.enhancements.externalLinks.map((link, index) => (
                          <li key={index} className="text-sm text-muted-foreground">• {link}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Imagens */}
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3">🖼️ Imagens Sugeridas</h4>
                    <div className="space-y-3">
                      {article.enhancements.images.map((img, index) => (
                        <div key={index} className="border rounded p-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{img.placement}</Badge>
                          </div>
                          <p className="text-sm mb-1">{img.description}</p>
                          <p className="text-xs text-muted-foreground">Alt: {img.altText}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Social Media Tab */}
              <TabsContent value="social" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3">📱 Resumo para Redes Sociais</h4>
                    <p className="text-sm bg-muted p-3 rounded">{article.socialMedia.tldr}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3">💼 LinkedIn</h4>
                    <p className="text-sm bg-muted p-3 rounded">{article.socialMedia.linkedinIntro}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3">🐦 Thread do Twitter</h4>
                    <div className="space-y-2">
                      {article.socialMedia.twitterThread.map((tweet, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Badge variant="outline">{index + 1}</Badge>
                          <p className="text-sm">{tweet}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3">🔗 Open Graph</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">Título</Label>
                        <p className="text-sm bg-muted p-2 rounded mt-1">
                          {article.socialMedia.openGraph.title}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm">Descrição</Label>
                        <p className="text-sm bg-muted p-2 rounded mt-1">
                          {article.socialMedia.openGraph.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Checklist Tab */}
              <TabsContent value="checklist" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center mb-6">
                      <h3 className="text-3xl font-bold mb-2">
                        <span className={getScoreBadge(article.checklist.seoScore).color}>
                          {article.checklist.seoScore}/100
                        </span>
                      </h3>
                      <Badge variant={getScoreBadge(article.checklist.seoScore).variant}>
                        Score SEO
                      </Badge>
                    </div>

                    {article.checklist.issues.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-3 text-red-600">⚠️ Problemas Encontrados</h4>
                        <ul className="space-y-1">
                          {article.checklist.issues.map((issue, index) => (
                            <li key={index} className="text-sm text-muted-foreground">• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {article.checklist.improvements.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 text-green-600">✅ Melhorias Sugeridas</h4>
                        <ul className="space-y-1">
                          {article.checklist.improvements.map((improvement, index) => (
                            <li key={index} className="text-sm text-muted-foreground">• {improvement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
