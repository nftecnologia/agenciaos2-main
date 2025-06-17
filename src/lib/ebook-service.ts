import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface EbookDescription {
  description: string
  targetAudience: string
  objectives: string[]
  benefits: string[]
  chapters: {
    number: number
    title: string
    description: string
    pages: number
  }[]
  totalPages: number
  estimatedReadTime: string
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado'
}

export interface EbookContent {
  introduction: string
  chapters: {
    chapterNumber: number
    title: string
    content: string
    wordCount: number
    keyPoints: string[]
  }[]
  conclusion: string
  metadata: {
    totalChapters: number
    totalPages: number
    generatedAt: string
  }
}

export class EbookService {
  
  /**
   * Gera descrição detalhada do ebook usando IA
   */
  static async generateDescription(params: {
    title: string
    targetAudience?: string
    industry?: string
  }): Promise<EbookDescription> {
    const { title, targetAudience, industry } = params

    const prompt = `
Crie uma descrição detalhada e estruturada para um ebook sobre "${title}".

Contexto adicional:
- Público-alvo: ${targetAudience || 'Profissionais e empreendedores'}
- Setor: ${industry || 'Geral'}

IMPORTANTE: Responda APENAS com um JSON válido seguindo exatamente esta estrutura:

{
  "description": "Descrição geral do ebook em 2-3 parágrafos, explicando do que se trata e seu valor",
  "targetAudience": "Descrição específica do público-alvo",
  "objectives": [
    "Objetivo de aprendizado 1",
    "Objetivo de aprendizado 2", 
    "Objetivo de aprendizado 3"
  ],
  "benefits": [
    "Benefício específico 1",
    "Benefício específico 2",
    "Benefício específico 3"
  ],
  "chapters": [
    {
      "number": 1,
      "title": "Título do Capítulo 1",
      "description": "Breve descrição do que será abordado no capítulo",
      "pages": 5
    },
    {
      "number": 2,
      "title": "Título do Capítulo 2", 
      "description": "Breve descrição do que será abordado no capítulo",
      "pages": 5
    }
  ],
  "totalPages": 50,
  "estimatedReadTime": "2-3 horas",
  "difficulty": "Iniciante"
}

Regras importantes:
- Crie exatamente 10 capítulos
- Cada capítulo deve ter 5 páginas
- Total de 50 páginas
- Difficulty deve ser: "Iniciante", "Intermediário" ou "Avançado"
- O conteúdo deve ser profissional e actionável
- Foque em conhecimento prático e aplicável
`

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })

      const content = completion.choices[0]?.message?.content
      if (!content) {
        throw new Error('Nenhum conteúdo retornado pela IA')
      }

      const parsed = JSON.parse(content) as EbookDescription
      
      // Validação básica
      if (!parsed.description || !parsed.chapters || parsed.chapters.length !== 10) {
        throw new Error('Formato de resposta inválido da IA')
      }

      return parsed
    } catch (error) {
      console.error('Erro ao gerar descrição:', error)
      throw new Error('Erro ao gerar descrição do ebook')
    }
  }

  /**
   * Gera capítulo individual do ebook
   */
  static async generateChapter(params: {
    chapterInfo: {
      number: number
      title: string
      description: string
    }
    ebookContext: {
      title: string
      description: string
      targetAudience: string
    }
    totalChapters: number
  }): Promise<{
    chapterNumber: number
    title: string
    content: string
    wordCount: number
    keyPoints: string[]
  }> {
    const { chapterInfo, ebookContext, totalChapters } = params

    const prompt = `
Escreva o conteúdo completo para o Capítulo ${chapterInfo.number}: "${chapterInfo.title}"

CONTEXTO DO EBOOK:
- Título: ${ebookContext.title}
- Descrição geral: ${ebookContext.description}
- Público-alvo: ${ebookContext.targetAudience}
- Este é o capítulo ${chapterInfo.number} de ${totalChapters}

DESCRIÇÃO DO CAPÍTULO: ${chapterInfo.description}

REQUISITOS:
- Escreva exatamente 5 páginas de conteúdo (aproximadamente 2500 palavras)
- Use linguagem profissional mas acessível
- Inclua exemplos práticos e actionáveis
- Use subtítulos (h2, h3) para organizar o conteúdo
- Adicione dicas valiosas e insights únicos
- Termine com um resumo dos pontos principais
- Use HTML semântico para formatação

FORMATO DA RESPOSTA (JSON):
{
  "chapterNumber": ${chapterInfo.number},
  "title": "${chapterInfo.title}",
  "content": "Conteúdo completo do capítulo em HTML bem formatado",
  "wordCount": número_aproximado_de_palavras,
  "keyPoints": ["Ponto chave 1", "Ponto chave 2", "Ponto chave 3"]
}

IMPORTANTE: Responda APENAS com o JSON, sem texto adicional.
`

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      })

      const content = completion.choices[0]?.message?.content
      if (!content) {
        throw new Error('Nenhum conteúdo retornado para o capítulo')
      }

      return JSON.parse(content)
    } catch (error) {
      console.error(`Erro ao gerar capítulo ${chapterInfo.number}:`, error)
      throw new Error(`Erro ao gerar capítulo ${chapterInfo.number}`)
    }
  }

  /**
   * Gera introdução do ebook
   */
  static async generateIntroduction(params: {
    title: string
    description: string
    targetAudience: string
    objectives: string[]
  }): Promise<string> {
    const { title, description, targetAudience, objectives } = params

    const prompt = `
Escreva uma introdução envolvente e profissional para o ebook "${title}".

CONTEXTO:
- Descrição: ${description}
- Público-alvo: ${targetAudience}
- Objetivos: ${objectives.join(', ')}

A introdução deve:
- Despertar interesse e curiosidade
- Explicar claramente o que o leitor aprenderá
- Mostrar os benefícios de ler o ebook
- Ser aproximadamente 500-700 palavras
- Usar HTML semântico para formatação
- Ter um tom profissional mas acessível

Responda APENAS com o HTML da introdução, sem JSON ou texto adicional.
`

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1500
      })

      return completion.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('Erro ao gerar introdução:', error)
      throw new Error('Erro ao gerar introdução')
    }
  }

  /**
   * Gera conclusão do ebook
   */
  static async generateConclusion(params: {
    title: string
    chapters: { title: string; keyPoints: string[] }[]
  }): Promise<string> {
    const { title, chapters } = params

    const keyPoints = chapters.flatMap(ch => ch.keyPoints).slice(0, 10)

    const prompt = `
Escreva uma conclusão inspiradora e motivacional para o ebook "${title}".

PRINCIPAIS PONTOS ABORDADOS:
${keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

A conclusão deve:
- Resumir os principais aprendizados
- Motivar o leitor a aplicar o conhecimento
- Incluir próximos passos ou call-to-action
- Ser aproximadamente 500-700 palavras
- Usar HTML semântico para formatação
- Ter um tom inspirador e actionável

Responda APENAS com o HTML da conclusão, sem JSON ou texto adicional.
`

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1500
      })

      return completion.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('Erro ao gerar conclusão:', error)
      throw new Error('Erro ao gerar conclusão')
    }
  }

  /**
   * Gera conteúdo completo do ebook
   */
  static async generateFullContent(params: {
    title: string
    approvedDescription: EbookDescription
  }): Promise<EbookContent> {
    const { title, approvedDescription } = params

    try {
      // 1. Gerar introdução
      const introduction = await this.generateIntroduction({
        title,
        description: approvedDescription.description,
        targetAudience: approvedDescription.targetAudience,
        objectives: approvedDescription.objectives
      })

      // 2. Gerar capítulos (com delay para evitar rate limiting)
      const chapters = []
      for (const chapterInfo of approvedDescription.chapters) {
        const chapter = await this.generateChapter({
          chapterInfo,
          ebookContext: {
            title,
            description: approvedDescription.description,
            targetAudience: approvedDescription.targetAudience
          },
          totalChapters: approvedDescription.chapters.length
        })
        
        chapters.push(chapter)
        
        // Delay de 1 segundo entre capítulos
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // 3. Gerar conclusão
      const conclusion = await this.generateConclusion({
        title,
        chapters
      })

      return {
        introduction,
        chapters,
        conclusion,
        metadata: {
          totalChapters: chapters.length,
          totalPages: approvedDescription.totalPages,
          generatedAt: new Date().toISOString()
        }
      }
    } catch (error) {
      console.error('Erro ao gerar conteúdo completo:', error)
      throw new Error('Erro ao gerar conteúdo do ebook')
    }
  }
}

export default EbookService