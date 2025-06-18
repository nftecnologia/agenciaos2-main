"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Plus, Copy, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactMarkdown from "react-markdown";

export function FunnelOrderBumpExpress() {
  const [mainProduct, setMainProduct] = useState("");
  const [objective, setObjective] = useState("aumentar_ticket");
  const [mainPrice, setMainPrice] = useState("");
  const [orderBumps, setOrderBumps] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mainProduct.trim() || !objective) {
      setError("Por favor, preencha o produto principal e objetivo");
      return;
    }

    setIsLoading(true);
    setError("");
    setOrderBumps("");

    try {
      const response = await fetch("/api/ai/funnel-order-bump", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mainProduct,
          objective,
          mainPrice
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar order bumps");
      }

      const data = await response.json();
      setOrderBumps(data.data.orderBumps);
    } catch (err) {
      setError("Erro ao criar order bumps. Tente novamente.");
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

  const extractBumps = (content: string) => {
    const sections = content.split(/\*\*(?:BUMP|Copy|Checkbox)[^*]+\*\*/);
    const bumpSections = [];
    for (let i = 1; i < sections.length; i += 2) {
      if (sections[i] && sections[i].includes("SIM!")) {
        bumpSections.push(sections[i].trim());
      }
    }
    return bumpSections;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Order Bump Express</h3>
        <p className="text-sm text-muted-foreground">
          Crie order bumps irresistíveis que aumentam o ticket médio sem atrito no checkout.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="mainProduct">Produto Principal *</Label>
          <Textarea
            id="mainProduct"
            value={mainProduct}
            onChange={(e) => setMainProduct(e.target.value)}
            placeholder="Ex: Curso de Instagram para Negócios, Planilha de Controle Financeiro..."
            className="mt-1 min-h-[60px]"
          />
        </div>

        <div>
          <Label htmlFor="objective">Objetivo do Bump *</Label>
          <Select value={objective} onValueChange={setObjective}>
            <SelectTrigger id="objective" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aumentar_ticket">Aumentar Ticket Médio</SelectItem>
              <SelectItem value="reduzir_objecao">Reduzir Objeção</SelectItem>
              <SelectItem value="complementar">Complementar Oferta</SelectItem>
              <SelectItem value="acelerar_resultado">Acelerar Resultado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="mainPrice">Preço do Produto Principal (opcional)</Label>
          <Input
            id="mainPrice"
            value={mainPrice}
            onChange={(e) => setMainPrice(e.target.value)}
            placeholder="Ex: R$ 497, R$ 997..."
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
              Gerando Order Bumps...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Gerar Order Bumps Express
            </>
          )}
        </Button>
      </form>

      {orderBumps && (
        <Card>
          <CardHeader>
            <CardTitle>Order Bumps Criados</CardTitle>
            <CardDescription>
              Copie e implemente no seu checkout para aumentar o AOV
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{orderBumps}</ReactMarkdown>
            </div>
            <div className="mt-6 space-y-4">
              {extractBumps(orderBumps).map((bump, index) => (
                <div
                  key={index}
                  className="relative p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => copyToClipboard(bump, index)}
                >
                  <p className="pr-10 whitespace-pre-wrap text-sm">{bump}</p>
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
