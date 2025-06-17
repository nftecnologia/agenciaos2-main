"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, HeartHandshake, Copy, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactMarkdown from "react-markdown";

export function WhatsappSupportGenerator() {
  const [supportType, setSupportType] = useState("duvida_tecnica");
  const [issue, setIssue] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [tone, setTone] = useState("empathetic");
  const [scripts, setScripts] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!issue.trim()) {
      setError("Por favor, descreva o problema ou situação");
      return;
    }

    setIsLoading(true);
    setError("");
    setScripts("");

    try {
      const response = await fetch("/api/ai/whatsapp-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supportType,
          issue,
          businessType,
          tone
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
    const sections = content.split(/\*\*(?:Abordagem|Tutorial|Resposta|Desculpas)[^*]+\*\*/);
    return sections.slice(1).map(section => section.trim().split('\n\n')[0]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Gerador de Scripts para Atendimento e Suporte</h3>
        <p className="text-sm text-muted-foreground">
          Crie scripts empáticos e resolutivos para atendimento ao cliente via WhatsApp.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="supportType">Tipo de Atendimento *</Label>
          <Select value={supportType} onValueChange={setSupportType}>
            <SelectTrigger id="supportType" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="duvida_tecnica">Dúvida Técnica</SelectItem>
              <SelectItem value="reclamacao">Reclamação</SelectItem>
              <SelectItem value="orientacao">Orientação de Uso</SelectItem>
              <SelectItem value="desculpas">Pedido de Desculpas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="issue">Problema/Situação *</Label>
          <Textarea
            id="issue"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            placeholder="Ex: Cliente não consegue acessar o sistema, Produto chegou com defeito..."
            className="mt-1 min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="businessType">Tipo de Negócio (opcional)</Label>
          <Input
            id="businessType"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            placeholder="Ex: SaaS, E-commerce, Consultoria..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="tone">Tom Desejado</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger id="tone" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="empathetic">Empático e Profissional</SelectItem>
              <SelectItem value="casual">Casual e Amigável</SelectItem>
              <SelectItem value="formal">Formal e Corporativo</SelectItem>
              <SelectItem value="technical">Técnico e Preciso</SelectItem>
              <SelectItem value="apologetic">Apologético e Compreensivo</SelectItem>
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
              Gerando Scripts...
            </>
          ) : (
            <>
              <HeartHandshake className="mr-2 h-4 w-4" />
              Gerar Scripts de Suporte
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
