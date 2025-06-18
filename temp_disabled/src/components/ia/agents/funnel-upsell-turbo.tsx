"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Rocket, Copy, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReactMarkdown from "react-markdown";

export function FunnelUpsellTurbo() {
  const [mainProduct, setMainProduct] = useState("");
  const [revenueGoal, setRevenueGoal] = useState("");
  const [mainPrice, setMainPrice] = useState("");
  const [customerProfile, setCustomerProfile] = useState("");
  const [upsellStrategy, setUpsellStrategy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mainProduct.trim() || !revenueGoal.trim()) {
      setError("Por favor, preencha o produto principal e a meta de faturamento");
      return;
    }

    setIsLoading(true);
    setError("");
    setUpsellStrategy("");

    try {
      const response = await fetch("/api/ai/funnel-upsell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mainProduct,
          revenueGoal,
          mainPrice,
          customerProfile
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar estratégia de upsell");
      }

      const data = await response.json();
      setUpsellStrategy(data.data.upsellStrategy);
    } catch (err) {
      setError("Erro ao criar estratégia de upsell. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(upsellStrategy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Upsell Turbo</h3>
        <p className="text-sm text-muted-foreground">
          Maximize o lifetime value com upsells premium que agregam valor genuíno.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="mainProduct">Produto Principal *</Label>
          <Textarea
            id="mainProduct"
            value={mainProduct}
            onChange={(e) => setMainProduct(e.target.value)}
            placeholder="Ex: Curso de Facebook Ads, Mentoria de Vendas..."
            className="mt-1 min-h-[60px]"
          />
        </div>

        <div>
          <Label htmlFor="revenueGoal">Meta de Faturamento *</Label>
          <Input
            id="revenueGoal"
            value={revenueGoal}
            onChange={(e) => setRevenueGoal(e.target.value)}
            placeholder="Ex: R$ 100.000/mês, Dobrar o faturamento atual..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="mainPrice">Preço do Produto Principal (opcional)</Label>
          <Input
            id="mainPrice"
            value={mainPrice}
            onChange={(e) => setMainPrice(e.target.value)}
            placeholder="Ex: R$ 997, R$ 1.997..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="customerProfile">Perfil do Cliente (opcional)</Label>
          <Textarea
            id="customerProfile"
            value={customerProfile}
            onChange={(e) => setCustomerProfile(e.target.value)}
            placeholder="Ex: Empreendedores iniciantes, Profissionais de marketing..."
            className="mt-1 min-h-[60px]"
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
              <Rocket className="mr-2 h-4 w-4" />
              Gerar Upsell Turbo
            </>
          )}
        </Button>
      </form>

      {upsellStrategy && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Estratégia de Upsell</CardTitle>
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
              Estratégia completa para maximizar o LTV dos seus clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{upsellStrategy}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
