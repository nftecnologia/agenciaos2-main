"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, RefreshCcw, Copy, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactMarkdown from "react-markdown";

export function WhatsappFollowupGenerator() {
  const [objective, setObjective] = useState("retomar_contato");
  const [context, setContext] = useState("");
  const [lastInteraction, setLastInteraction] = useState("");
  const [customerInfo, setCustomerInfo] = useState("");
  const [messages, setMessages] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!context.trim()) {
      setError("Por favor, forneça o contexto da situação");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessages("");

    try {
      const response = await fetch("/api/ai/whatsapp-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objective,
          context,
          lastInteraction,
          customerInfo
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
    const sections = content.split(/\*\*(?:Abordagem|Lembrete|Agradecimento|Verificação|Parabéns|Oferta)[^*]+\*\*/);
    return sections.slice(1).map(section => section.trim().split('\n\n')[0]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Agente de Follow-up e Reengajamento</h3>
        <p className="text-sm text-muted-foreground">
          Crie mensagens personalizadas para manter relacionamento e reengajar clientes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="objective">Objetivo do Follow-up *</Label>
          <Select value={objective} onValueChange={setObjective}>
            <SelectTrigger id="objective" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retomar_contato">Retomar Contato Parado</SelectItem>
              <SelectItem value="lembrete_orcamento">Lembrete de Orçamento</SelectItem>
              <SelectItem value="agradecimento">Agradecimento</SelectItem>
              <SelectItem value="pos_venda">Pós-Venda</SelectItem>
              <SelectItem value="aniversario">Data Especial/Aniversário</SelectItem>
              <SelectItem value="recompra">Estímulo à Recompra</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="context">Contexto da Situação *</Label>
          <Textarea
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Ex: Cliente comprou produto há 30 dias, Orçamento enviado há 1 semana..."
            className="mt-1 min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="lastInteraction">Última Interação (opcional)</Label>
          <Input
            id="lastInteraction"
            value={lastInteraction}
            onChange={(e) => setLastInteraction(e.target.value)}
            placeholder="Ex: Há 15 dias, pediu informações sobre..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="customerInfo">Informações do Cliente (opcional)</Label>
          <Textarea
            id="customerInfo"
            value={customerInfo}
            onChange={(e) => setCustomerInfo(e.target.value)}
            placeholder="Ex: Nome: João, Empresa: XYZ, Comprou: Produto A..."
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
              <RefreshCcw className="mr-2 h-4 w-4" />
              Gerar Mensagens de Follow-up
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
                  <p className="pr-10 whitespace-pre-wrap text-sm">{msg}</p>
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
