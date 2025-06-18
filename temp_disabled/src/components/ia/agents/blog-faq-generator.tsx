"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Loader2, Copy, Check, Code } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FaqContent {
  faqs: {
    question: string;
    answer: string;
    keywords: string[];
  }[];
  lists: {
    tips: {
      title: string;
      items: string[];
    };
    benefits: {
      title: string;
      items: string[];
    };
    commonMistakes: {
      title: string;
      items: string[];
    };
    steps: {
      title: string;
      items: string[];
    };
  };
  schemaMarkup: {
    faqSchema: string;
    howToSchema?: string;
  };
}

export function BlogFaqGenerator() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<FaqContent | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    topic: "",
    service: "",
    targetAudience: "",
    existingContent: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/ai/blog-faq", {
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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const copyAllFaqs = () => {
    if (!content) return;
    const faqText = content.faqs
      .map(faq => `**P:** ${faq.question}\n**R:** ${faq.answer}`)
      .join("\n\n");
    copyToClipboard(faqText, "all-faqs");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Gerador de FAQs e Listas
        </CardTitle>
        <CardDescription>
          Crie perguntas frequentes e listas úteis para enriquecer seu conteúdo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tema do Artigo</Label>
              <Input
                placeholder="Ex: Marketing Digital para E-commerce"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Serviço/Produto (opcional)</Label>
              <Input
                placeholder="Ex: Consultoria de Marketing"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Público-alvo (opcional)</Label>
            <Input
              placeholder="Ex: Pequenos empresários"
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Contexto Adicional (opcional)</Label>
            <Textarea
              placeholder="Adicione informações extras sobre o tema..."
              value={formData.existingContent}
              onChange={(e) => setFormData({ ...formData, existingContent: e.target.value })}
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando FAQs e Listas...
              </>
            ) : (
              <>
                <HelpCircle className="mr-2 h-4 w-4" />
                Gerar Conteúdo
              </>
            )}
          </Button>
        </form>

        {content && (
          <div className="mt-6">
            <Tabs defaultValue="faqs" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
                <TabsTrigger value="lists">Listas</TabsTrigger>
                <TabsTrigger value="schema">Schema</TabsTrigger>
              </TabsList>

              {/* FAQs Tab */}
              <TabsContent value="faqs" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Perguntas Frequentes</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyAllFaqs}
                  >
                    {copiedItem === "all-faqs" ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar Todas
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-3">
                  {content.faqs.map((faq, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium text-sm mb-1">{faq.question}</p>
                            <p className="text-sm text-muted-foreground">{faq.answer}</p>
                          </div>
                          {faq.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {faq.keywords.map((keyword, kIndex) => (
                                <Badge key={kIndex} variant="outline" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Lists Tab */}
              <TabsContent value="lists" className="space-y-6">
                {/* Dicas */}
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Badge className="bg-blue-500">Dicas</Badge>
                      {content.lists.tips.title}
                    </h4>
                    <ul className="space-y-2">
                      {content.lists.tips.items.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">✓</span>
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Benefícios */}
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Badge className="bg-green-500">Benefícios</Badge>
                      {content.lists.benefits.title}
                    </h4>
                    <ul className="space-y-2">
                      {content.lists.benefits.items.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">+</span>
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Erros Comuns */}
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Badge className="bg-red-500">Cuidados</Badge>
                      {content.lists.commonMistakes.title}
                    </h4>
                    <ul className="space-y-2">
                      {content.lists.commonMistakes.items.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">×</span>
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Passo a Passo */}
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Badge className="bg-purple-500">Tutorial</Badge>
                      {content.lists.steps.title}
                    </h4>
                    <ol className="space-y-2">
                      {content.lists.steps.items.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-purple-500 font-bold mt-0.5">{index + 1}.</span>
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Schema Tab */}
              <TabsContent value="schema" className="space-y-4">
                <div className="space-y-4">
                  {/* FAQ Schema */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          FAQ Schema Markup
                        </h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(content.schemaMarkup.faqSchema, "faq-schema")}
                        >
                          {copiedItem === "faq-schema" ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <pre className="bg-muted p-4 rounded overflow-x-auto">
                        <code className="text-xs">{content.schemaMarkup.faqSchema}</code>
                      </pre>
                    </CardContent>
                  </Card>

                  {/* HowTo Schema */}
                  {content.schemaMarkup.howToSchema && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Code className="h-4 w-4" />
                            HowTo Schema Markup
                          </h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(content.schemaMarkup.howToSchema!, "howto-schema")}
                          >
                            {copiedItem === "howto-schema" ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <pre className="bg-muted p-4 rounded overflow-x-auto">
                          <code className="text-xs">{content.schemaMarkup.howToSchema}</code>
                        </pre>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
