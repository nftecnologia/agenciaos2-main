"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, TrendingDown, Copy, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactMarkdown from "react-markdown";

export function FunnelDownsellRecovery() {
  const [mainProduct, setMainProduct] = useState("");
  const [rejectionReason, setRejectionReason] = useState("preco");
  const [mainPrice, setMainPrice] = useState("");
  const [upsellRejected, setUpsellRejected] = useState("");
  const [downsellStrategy, setDownsellStrategy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mainProduct.trim()) {
      setError("Por favor, preencha o produto principal");
      return;
    }

    setIsLoading(true);
    setError("");
    setDownsellStrategy("");

    try {
      const response = await fetch("/api/ai/funnel-downsell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mainProduct,
          rejectionReason,
          mainPrice,
          upsellRejected
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar estratégia de downsell");
      }

      const data = await response.json();
      setDownsellStrategy(data.data.downsellStrategy);
    } catch (err) {
      setError("Erro ao criar estratégia de downsell. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(downsellStrategy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Downsell Recovery</h3>
        <p className="text-sm text-muted-foreground">
          Recupere vendas perdidas transformando objeções em oportunidades adaptadas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="mainProduct">Produto Principal *</Label>
          <Textarea
            id="mainProduct"
            value={mainProduct}
            onChange={(e) => setMainProduct(e.target.value)}
            placeholder="Ex: Mentoria de 6 meses, Curso completo de vendas..."
            className="mt-1 min-h-[60px]"
          />
        </div>

        <div>
          <Label htmlFor="rejectionReason">Motivo da Rejeição *</Label>
          <Select value={rejectionReason} onValueChange={setRejectionReason}>
            <SelectTrigger id="rejectionReason" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="preco">Preço Alto</SelectItem>
              <SelectItem value="urgencia">Falta de Urgência</SelectItem>
              <SelectItem value="confianca">Falta de Confiança</SelectItem>
              <SelectItem value="tempo">Falta de Tempo</SelectItem>
              <SelectItem value="resultado">Dúvida sobre Resultados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="mainPrice">Preço Original (opcional)</Label>
          <Input
            id="mainPrice"
            value={mainPrice}
            onChange={(e) => setMainPrice(e.target.value)}
            placeholder="Ex: R$ 2.997, R$ 5.000..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="upsellRejected">Upsell Rejeitado (opcional)</Label>
          <Input
            id="upsellRejected"
            value={upsellRejected}
            onChange={(e) => setUpsellRejected(e.target.value)}
            placeholder="Ex: Coaching individual, Licença vitalícia..."
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
              Criando Estratégia...
            </>
          ) : (
            <>
              <TrendingDown className="mr-2 h-4 w-4" />
              Gerar Downsell Recovery
            </>
          )}
        </Button>
      </form>

      {downsellStrategy && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Estratégia de Recuperação</CardTitle>
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
              Ofertas adaptadas para converter objeções em vendas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{downsellStrategy}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
