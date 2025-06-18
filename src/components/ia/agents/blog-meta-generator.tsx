"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Link, Loader2, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MetaData {
  metaDescriptions: {
    text: string;
    length: number;
    style: string;
  }[];
  slugs: {
    slug: string;
    reasoning: string;
  }[];
  openGraph: {
    title: string;
    description: string;
  };
  tips: string[];
}

export function BlogMetaGenerator() {
  const [loading, setLoading] = useState(false);
  const [metaData, setMetaData] = useState<MetaData | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mainKeyword: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/ai/blog-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setMetaData(data.data);
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

  const getStyleColor = (style: string) => {
    switch (style.toLowerCase()) {
      case "persuasivo":
        return "bg-purple-500";
      case "informativo":
        return "bg-blue-500";
      case "urgente":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getLengthColor = (length: number) => {
    if (length > 160) return "text-red-600";
    if (length > 150) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Gerador de Meta Tags e Slugs
        </CardTitle>
        <CardDescription>
          Crie meta descriptions persuasivas e URLs otimizadas para SEO
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Título do Artigo</Label>
            <Input
              placeholder="Ex: Como Criar Conteúdo Viral em 2024"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Conteúdo (primeiros parágrafos)</Label>
            <Textarea
              placeholder="Cole aqui o início do seu artigo..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Palavra-chave Principal (opcional)</Label>
            <Input
              placeholder="Ex: conteúdo viral"
              value={formData.mainKeyword}
              onChange={(e) => setFormData({ ...formData, mainKeyword: e.target.value })}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando meta tags...
              </>
            ) : (
              <>
                <Link className="mr-2 h-4 w-4" />
                Gerar Meta Tags
              </>
            )}
          </Button>
        </form>

        {metaData && (
          <div className="mt-8 space-y-6">
            {/* Meta Descriptions */}
            <div>
              <div className="flex items-center gap-2 mb-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-lg">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                <h3 className="text-lg font-semibold">Meta Descriptions Otimizadas</h3>
              </div>
              <div className="space-y-3">
                {metaData.metaDescriptions.map((meta, index) => (
                  <Card 
                    key={index}
                    className="group border-0 shadow-md hover:shadow-lg transition-all"
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <p className="text-sm flex-1 leading-relaxed">{meta.text}</p>
                        <Button
                          variant="outline"
                          size="icon"
                          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(meta.text, `meta-${index}`)}
                        >
                          {copiedItem === `meta-${index}` ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge 
                          className={`${getStyleColor(meta.style)} text-white border-0`}
                        >
                          {meta.style === "persuasivo" ? "💜" : meta.style === "informativo" ? "📘" : "🔥"} {meta.style}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-20 bg-gray-200 rounded-full overflow-hidden`}>
                            <div 
                              className={`h-full transition-all ${
                                meta.length > 160 ? 'bg-red-500' :
                                meta.length > 150 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min((meta.length / 160) * 100, 100)}%` }}
                            />
                          </div>
                          <span className={`text-xs font-medium ${getLengthColor(meta.length)}`}>
                            {meta.length}/160
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Slugs */}
            <div>
              <div className="flex items-center gap-2 mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <h3 className="text-lg font-semibold">URLs Amigáveis (Slugs)</h3>
              </div>
              <div className="space-y-3">
                {metaData.slugs.map((slug, index) => (
                  <Card 
                    key={index}
                    className="group border-0 shadow-sm hover:shadow-md transition-all"
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                            <Link className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <code className="text-sm bg-muted px-3 py-1.5 rounded font-mono">
                            /{slug.slug}
                          </code>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(slug.slug, `slug-${index}`)}
                        >
                          {copiedItem === `slug-${index}` ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground pl-12">{slug.reasoning}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Open Graph */}
            {metaData.openGraph && (
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Badge variant="secondary">Open Graph</Badge>
                    Para Redes Sociais
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm">Título Social</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm bg-muted p-2 rounded flex-1">
                          {metaData.openGraph.title}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(metaData.openGraph.title, "og-title")}
                        >
                          {copiedItem === "og-title" ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">Descrição Social</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm bg-muted p-2 rounded flex-1">
                          {metaData.openGraph.description}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(metaData.openGraph.description, "og-desc")}
                        >
                          {copiedItem === "og-desc" ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dicas */}
            {metaData.tips.length > 0 && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3">💡 Dicas para Melhorar CTR</h4>
                  <ul className="space-y-2">
                    {metaData.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-sm text-muted-foreground">{tip}</span>
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
