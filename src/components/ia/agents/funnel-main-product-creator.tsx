"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Package, Copy, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactMarkdown from "react-markdown";

export function FunnelMainProductCreator() {
  const [niche, setNiche] = useState("");
  const [painPoint, setPainPoint] = useState("");
  const [format, setFormat] = useState("curso");
  const [targetPrice, setTargetPrice] = useState("");
  const [productPlan, setProductPlan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!niche.trim() || !painPoint.trim() || !targetPrice.trim()) {
      setError("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);
    setError("");
    setProductPlan("");

    try {
      const response = await fetch("/api/ai/funnel-main-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche,
          painPoint,
          format,
          targetPrice
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar produto");
      }

      const data = await response.json();
      setProductPlan(data.data.productPlan);
    } catch (err) {
      setError("Erro ao criar produto. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(productPlan);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Criador de Produto Principal</h3>
        <p className="text-sm text-muted-foreground">
          Crie produtos digitais completos e estratégicos a partir de um briefing simples.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="niche">Nicho de Mercado *</Label>
          <Input
            id="niche"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="Ex: Marketing Digital, Fitness, Finanças Pessoais..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="painPoint">Dor/Problema a Resolver *</Label>
          <Textarea
            id="painPoint"
            value={painPoint}
            onChange={(e) => setPainPoint(e.target.value)}
            placeholder="Ex: Empreendedores que não conseguem vender online, Pessoas que querem emagrecer mas não têm tempo..."
            className="mt-1 min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="format">Formato do Produto *</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger id="format" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="curso">Curso Online</SelectItem>
              <SelectItem value="ebook">E-book</SelectItem>
              <SelectItem value="saas">Software (SaaS)</SelectItem>
              <SelectItem value="mentoria">Mentoria/Consultoria</SelectItem>
              <SelectItem value="fisico">Produto Físico</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="targetPrice">Preço-Alvo *</Label>
          <Input
            id="targetPrice"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            placeholder="Ex: R$ 997, R$ 1.997, R$ 497..."
            className="mt-1"
          />
        </div>

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
              Criando Produto...
            </>
          ) : (
            <>
              <Package className="mr-2 h-4 w-4" />
              Criar Produto Principal
            </>
          )}
        </Button>
      </form>

      {productPlan && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Produto Criado</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
            <CardDescription>
              Seu produto está pronto para ser desenvolvido e lançado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{productPlan}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
