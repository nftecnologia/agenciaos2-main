"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, MessageCircle, Copy, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactMarkdown from "react-markdown";

export function WhatsappTemplatesGenerator() {
  const [questions, setQuestions] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [tone, setTone] = useState("cordial");
  const [templates, setTemplates] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questions.trim() || !businessType.trim()) {
      setError("Por favor, preencha as perguntas frequentes e o tipo de negócio");
      return;
    }

    setIsLoading(true);
    setError("");
    setTemplates("");

    try {
      const response = await fetch("/api/ai/whatsapp-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions,
          businessType,
          tone
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar templates");
      }

      const data = await response.json();
      setTemplates(data.data.templates);
    } catch (err) {
      setError("Erro ao gerar templates. Tente novamente.");
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

  const extractTemplates = (content: string) => {
    const sections = content.split(/\*\*Resposta [^*]+\*\*/);
    return sections.slice(1).map(section => section.trim().split('\n\n')[0]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Gerador de Respostas Rápidas (Templates)</h3>
        <p className="text-sm text-muted-foreground">
          Crie respostas padronizadas e humanizadas para as dúvidas mais frequentes dos seus clientes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="questions">Perguntas/Situações Frequentes *</Label>
          <Textarea
            id="questions"
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            placeholder="Ex: Qual o preço? Qual o prazo de entrega? Como funciona a garantia? Vocês parcelam?"
            className="mt-1 min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Separe cada pergunta ou situação com vírgula ou nova linha
          </p>
        </div>

        <div>
          <Label htmlFor="businessType">Tipo de Negócio *</Label>
          <Input
            id="businessType"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            placeholder="Ex: E-commerce de moda, Consultoria financeira, Clínica médica..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="tone">Tom de Comunicação</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger id="tone" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cordial">Cordial e Profissional</SelectItem>
              <SelectItem value="casual">Casual e Descontraído</SelectItem>
              <SelectItem value="formal">Formal e Corporativo</SelectItem>
              <SelectItem value="empathetic">Empático e Acolhedor</SelectItem>
              <SelectItem value="technical">Técnico e Preciso</SelectItem>
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
              Gerando Templates...
            </>
          ) : (
            <>
              <MessageCircle className="mr-2 h-4 w-4" />
              Gerar Templates de Resposta
            </>
          )}
        </Button>
      </form>

      {templates && (
        <Card>
          <CardHeader>
            <CardTitle>Templates Gerados</CardTitle>
            <CardDescription>
              Clique para copiar qualquer template
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{templates}</ReactMarkdown>
            </div>
            <div className="mt-6 space-y-4">
              {extractTemplates(templates).map((template, index) => (
                <div
                  key={index}
                  className="relative p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => copyToClipboard(template, index)}
                >
                  <p className="pr-10 whitespace-pre-wrap text-sm">{template}</p>
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
