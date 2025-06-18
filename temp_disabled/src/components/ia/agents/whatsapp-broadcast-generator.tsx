"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, MessageSquare, Copy, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactMarkdown from "react-markdown";

export function WhatsappBroadcastGenerator() {
  const [objective, setObjective] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("professional");
  const [details, setDetails] = useState("");
  const [messages, setMessages] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!objective.trim() || !audience.trim()) {
      setError("Por favor, preencha o objetivo e o público-alvo");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessages("");

    try {
      const response = await fetch("/api/ai/whatsapp-broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objective,
          audience,
          tone,
          details
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar mensagens");
      }

      const data = await response.json();
      setMessages(data.data.messages);
    } catch (err) {
      setError("Erro ao gerar mensagens. Tente novamente.");
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

  const extractMessages = (content: string) => {
    const sections = content.split(/\*\*(?:Mensagem Principal|Variação Alternativa|Versão Resumida):\*\*/);
    return sections.slice(1).map(section => section.trim().split('\n\n')[0]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Gerador de Mensagens de Lista/Broadcast</h3>
        <p className="text-sm text-muted-foreground">
          Crie mensagens profissionais para campanhas de WhatsApp, evitando spam e aumentando engajamento.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="objective">Objetivo da Campanha *</Label>
          <Textarea
            id="objective"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="Ex: Promoção de Black Friday, Lançamento de produto, Reengajamento de clientes..."
            className="mt-1 min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="audience">Público-Alvo *</Label>
          <Textarea
            id="audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="Ex: Clientes que compraram nos últimos 3 meses, Leads qualificados..."
            className="mt-1 min-h-[60px]"
          />
        </div>

        <div>
          <Label htmlFor="tone">Tom da Mensagem</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger id="tone" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Profissional e Amigável</SelectItem>
              <SelectItem value="casual">Casual e Descontraído</SelectItem>
              <SelectItem value="formal">Formal e Corporativo</SelectItem>
              <SelectItem value="enthusiastic">Entusiasmado e Motivador</SelectItem>
              <SelectItem value="urgent">Urgente e Direto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="details">Detalhes Adicionais (opcional)</Label>
          <Textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Ex: Desconto de 30%, Prazo até dia 15, Inclui frete grátis..."
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
              Gerando Mensagens...
            </>
          ) : (
            <>
              <MessageSquare className="mr-2 h-4 w-4" />
              Gerar Mensagens de Broadcast
            </>
          )}
        </Button>
      </form>

      {messages && (
        <Card>
          <CardHeader>
            <CardTitle>Mensagens Geradas</CardTitle>
            <CardDescription>
              Clique para copiar qualquer mensagem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{messages}</ReactMarkdown>
            </div>
            <div className="mt-6 space-y-4">
              {extractMessages(messages).map((msg, index) => (
                <div
                  key={index}
                  className="relative p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => copyToClipboard(msg, index)}
                >
                  <p className="pr-10 whitespace-pre-wrap">{msg}</p>
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
