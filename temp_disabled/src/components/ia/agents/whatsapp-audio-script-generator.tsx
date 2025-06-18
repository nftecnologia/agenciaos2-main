"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Mic, Copy, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactMarkdown from "react-markdown";

export function WhatsappAudioScriptGenerator() {
  const [objective, setObjective] = useState("");
  const [product, setProduct] = useState("");
  const [tone, setTone] = useState("friendly");
  const [duration, setDuration] = useState("30-60");
  const [scripts, setScripts] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!objective.trim() || !product.trim()) {
      setError("Por favor, preencha o objetivo e o produto/serviço");
      return;
    }

    setIsLoading(true);
    setError("");
    setScripts("");

    try {
      const response = await fetch("/api/ai/whatsapp-audio-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objective,
          product,
          tone,
          duration
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar roteiros");
      }

      const data = await response.json();
      setScripts(data.data.scripts);
    } catch (err) {
      setError("Erro ao gerar roteiros. Tente novamente.");
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
    const sections = content.split(/\*\*Roteiro [^*]+\*\*/);
    return sections.slice(1).map(section => section.trim().split('\n\n')[0]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Gerador de Roteiros/Scripts de Áudio</h3>
        <p className="text-sm text-muted-foreground">
          Crie roteiros profissionais para áudios de WhatsApp que comunicam de forma clara e envolvente.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="objective">Objetivo do Áudio *</Label>
          <Textarea
            id="objective"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="Ex: Venda de produto, Pós-venda, Suporte técnico, Instrução de uso..."
            className="mt-1 min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="product">Produto/Serviço *</Label>
          <Textarea
            id="product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Ex: Curso de Marketing Digital, Consultoria Financeira, Software de Gestão..."
            className="mt-1 min-h-[60px]"
          />
        </div>

        <div>
          <Label htmlFor="tone">Tom Desejado</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger id="tone" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="friendly">Amigável e Profissional</SelectItem>
              <SelectItem value="enthusiastic">Entusiasmado e Energético</SelectItem>
              <SelectItem value="calm">Calmo e Tranquilo</SelectItem>
              <SelectItem value="formal">Formal e Corporativo</SelectItem>
              <SelectItem value="empathetic">Empático e Acolhedor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="duration">Duração Aproximada</Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger id="duration" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15-30">15-30 segundos (Muito Rápido)</SelectItem>
              <SelectItem value="30-60">30-60 segundos (Ideal)</SelectItem>
              <SelectItem value="60-90">60-90 segundos (Detalhado)</SelectItem>
              <SelectItem value="90-120">90-120 segundos (Completo)</SelectItem>
            </SelectContent>
          </Select>
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
              Gerando Roteiros...
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" />
              Gerar Roteiros de Áudio
            </>
          )}
        </Button>
      </form>

      {scripts && (
        <Card>
          <CardHeader>
            <CardTitle>Roteiros Gerados</CardTitle>
            <CardDescription>
              Clique para copiar qualquer roteiro
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
