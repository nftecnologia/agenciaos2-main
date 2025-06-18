"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, TrendingUp, Copy, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactMarkdown from "react-markdown";

export function WhatsappSalesScriptGenerator() {
  const [product, setProduct] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [stage, setStage] = useState("abordagem");
  const [objections, setObjections] = useState("");
  const [scripts, setScripts] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product.trim() || !targetAudience.trim()) {
      setError("Por favor, preencha o produto/serviço e o público-alvo");
      return;
    }

    setIsLoading(true);
    setError("");
    setScripts("");

    try {
      const response = await fetch("/api/ai/whatsapp-sales-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          targetAudience,
          stage,
          objections
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar scripts");
      }

      const data = await response.json();
      setScripts(data.data.scripts);
    } catch (err) {
      setError("Erro ao gerar scripts. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  const extractScripts = (content: string) => {
    const sections = content.split(/\*\*(?:SCRIPTS|Abordagem|Apresentação|Fechamento|Resposta)[^*]+\*\*/);
    return sections.slice(1).map(section => section.trim().split('\n\n')[0]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Gerador de Scripts para Vendas</h3>
        <p className="text-sm text-muted-foreground">
          Crie scripts profissionais para cada etapa do processo de vendas via WhatsApp.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="product">Produto/Serviço *</Label>
          <Input
            id="product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Ex: Curso de Excel Avançado, Consultoria de Marketing..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="targetAudience">Público-Alvo *</Label>
          <Textarea
            id="targetAudience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="Ex: Profissionais de RH que precisam otimizar análises..."
            className="mt-1 min-h-[60px]"
          />
        </div>

        <div>
          <Label htmlFor="stage">Etapa da Venda *</Label>
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger id="stage" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="abordagem">Abordagem Inicial</SelectItem>
              <SelectItem value="apresentacao">Apresentação do Produto</SelectItem>
              <SelectItem value="objecao">Tratamento de Objeções</SelectItem>
              <SelectItem value="fechamento">Fechamento da Venda</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {stage === "objecao" && (
          <div>
            <Label htmlFor="objections">Objeções Comuns (opcional)</Label>
            <Textarea
              id="objections"
              value={objections}
              onChange={(e) => setObjections(e.target.value)}
              placeholder="Ex: Preço alto, Falta de tempo, Preciso pensar..."
              className="mt-1 min-h-[60px]"
            />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando Scripts...
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              Gerar Scripts de Vendas
            </>
          )}
        </Button>
      </form>

      {scripts && (
        <Card>
          <CardHeader>
            <CardTitle>Scripts Gerados</CardTitle>
            <CardDescription>
              Clique para copiar qualquer script
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{scripts}</ReactMarkdown>
            </div>
            <div className="mt-6 space-y-4">
              {extractScripts(scripts).map((script, index) => (
                <div
                  key={index}
                  className="relative p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => copyToClipboard(script, index)}
                >
                  <p className="pr-10 whitespace-pre-wrap text-sm">{script}</p>
                  <div className="absolute top-4 right-4">
                    {copiedIndex === index ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Copy className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
