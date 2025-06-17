// Dynamic import for Puppeteer to avoid build issues in production
let puppeteer: any = null;

async function getPuppeteer() {
  if (!puppeteer) {
    try {
      puppeteer = await import('puppeteer');
      return puppeteer.default || puppeteer;
    } catch (error) {
      console.error('Puppeteer not available:', error);
      return null;
    }
  }
  return puppeteer;
}
import { EbookContent, EbookDescription } from './ebook-service'

export interface PDFGenerationOptions {
  template?: 'professional' | 'modern' | 'minimal'
  primaryColor?: string
  font?: 'inter' | 'roboto' | 'open-sans'
}

export class PDFGenerator {
  
  /**
   * Gera PDF do ebook usando Puppeteer
   */
  static async generateEbookPDF(params: {
    title: string
    description: EbookDescription
    content: EbookContent
    options?: PDFGenerationOptions
  }): Promise<Buffer> {
    const { title, description, content, options = {} } = params
    
    const template = options.template || 'professional'
    const primaryColor = options.primaryColor || '#2563eb'
    const font = options.font || 'inter'

    const htmlContent = this.buildHTMLContent({
      title,
      description,
      content,
      template,
      primaryColor,
      font
    })

    try {
      const puppeteerInstance = await getPuppeteer();
      
      if (!puppeteerInstance) {
        throw new Error('Puppeteer is not available in this environment');
      }

      const browser = await puppeteerInstance.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      })

      const page = await browser.newPage()
      
      // Configurar viewport e timeouts
      await page.setViewport({ width: 1200, height: 1600 })
      await page.setDefaultTimeout(30000)
      
      // Carregar conteúdo HTML
      await page.setContent(htmlContent, { 
        waitUntil: 'networkidle0',
        timeout: 30000
      })

      // Gerar PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '0.75in',
          right: '0.75in',
          bottom: '0.75in',
          left: '0.75in'
        },
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: ' ',
        footerTemplate: `
          <div style="font-size: 10px; text-align: center; width: 100%; color: #666; font-family: Inter, sans-serif;">
            <span class="pageNumber"></span> de <span class="totalPages"></span>
          </div>
        `,
        preferCSSPageSize: false
      })

      await browser.close()
      return Buffer.from(pdfBuffer)

    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      throw new Error('Erro ao gerar PDF do ebook')
    }
  }

  /**
   * Constrói o conteúdo HTML completo do ebook
   */
  private static buildHTMLContent(params: {
    title: string
    description: EbookDescription
    content: EbookContent
    template: string
    primaryColor: string
    font: string
  }): string {
    const { title, description, content, template, primaryColor, font } = params

    const cssStyles = this.generateCSSStyles({ template, primaryColor, font })
    
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${cssStyles}
</head>
<body>
  <!-- Capa -->
  <div class="cover-page">
    <div class="cover-content">
      <h1 class="cover-title">${title}</h1>
      <p class="cover-subtitle">${description.description.substring(0, 200)}...</p>
      <div class="cover-footer">
        <p>Gerado por AgênciaOS</p>
        <p>${new Date().getFullYear()}</p>
      </div>
    </div>
  </div>

  <!-- Sumário -->
  <div class="toc-page">
    <h2 class="section-title">Sumário</h2>
    <div class="toc-content">
      <div class="toc-item">
        <span class="toc-title">Introdução</span>
        <span class="toc-page">3</span>
      </div>
      ${content.chapters.map((chapter, index) => `
        <div class="toc-item">
          <span class="toc-title">Capítulo ${chapter.chapterNumber}: ${chapter.title}</span>
          <span class="toc-page">${4 + (index * 5)}</span>
        </div>
      `).join('')}
      <div class="toc-item">
        <span class="toc-title">Conclusão</span>
        <span class="toc-page">${4 + (content.chapters.length * 5)}</span>
      </div>
    </div>
  </div>

  <!-- Sobre o Ebook -->
  <div class="about-page">
    <h2 class="section-title">Sobre Este Ebook</h2>
    
    <div class="about-grid">
      <div class="about-item">
        <h3>Público-alvo</h3>
        <p>${description.targetAudience}</p>
      </div>
      
      <div class="about-item">
        <h3>Objetivos</h3>
        <ul>
          ${description.objectives.map(obj => `<li>${obj}</li>`).join('')}
        </ul>
      </div>
      
      <div class="about-item">
        <h3>Benefícios</h3>
        <ul>
          ${description.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
        </ul>
      </div>
      
      <div class="about-item">
        <h3>Informações</h3>
        <ul>
          <li><strong>Dificuldade:</strong> ${description.difficulty}</li>
          <li><strong>Páginas:</strong> ${description.totalPages}</li>
          <li><strong>Tempo de leitura:</strong> ${description.estimatedReadTime}</li>
          <li><strong>Capítulos:</strong> ${description.chapters.length}</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Introdução -->
  <div class="chapter-page">
    <h2 class="chapter-title">Introdução</h2>
    <div class="chapter-content">
      ${content.introduction}
    </div>
  </div>

  <!-- Capítulos -->
  ${content.chapters.map(chapter => `
    <div class="chapter-page">
      <div class="chapter-header">
        <span class="chapter-number">Capítulo ${chapter.chapterNumber}</span>
        <h2 class="chapter-title">${chapter.title}</h2>
      </div>
      
      <div class="chapter-content">
        ${chapter.content}
      </div>
      
      ${chapter.keyPoints?.length ? `
        <div class="key-points">
          <h3>Pontos-chave deste capítulo:</h3>
          <ul>
            ${chapter.keyPoints.map(point => `<li>${point}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `).join('')}

  <!-- Conclusão -->
  <div class="chapter-page">
    <h2 class="chapter-title">Conclusão</h2>
    <div class="chapter-content">
      ${content.conclusion}
    </div>
  </div>

  <!-- Contracapa -->
  <div class="back-cover">
    <div class="back-cover-content">
      <h3>Obrigado por ler!</h3>
      <p>Este ebook foi gerado com inteligência artificial através do AgênciaOS.</p>
      <p>Para mais conteúdos como este, visite nosso sistema.</p>
      
      <div class="stats">
        <div class="stat">
          <span class="number">${description.chapters.length}</span>
          <span class="label">Capítulos</span>
        </div>
        <div class="stat">
          <span class="number">${description.totalPages}</span>
          <span class="label">Páginas</span>
        </div>
        <div class="stat">
          <span class="number">${description.estimatedReadTime}</span>
          <span class="label">Leitura</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
    `
  }

  /**
   * Gera estilos CSS para diferentes templates
   */
  private static generateCSSStyles(params: {
    template: string
    primaryColor: string
    font: string
  }): string {
    const { primaryColor, font } = params

    const fontImport = {
      'inter': '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");',
      'roboto': '@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");',
      'open-sans': '@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap");'
    }

    const fontFamily = {
      'inter': 'Inter',
      'roboto': 'Roboto', 
      'open-sans': 'Open Sans'
    }

    return `
<style>
  ${fontImport[font as keyof typeof fontImport]}
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: '${fontFamily[font as keyof typeof fontFamily]}', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.6;
    color: #1a1a1a;
    font-size: 14px;
  }
  
  /* Páginas */
  .cover-page,
  .toc-page,
  .about-page,
  .chapter-page,
  .back-cover {
    page-break-before: always;
    min-height: 100vh;
    padding: 40px;
    display: flex;
    flex-direction: column;
  }
  
  /* Capa */
  .cover-page {
    background: linear-gradient(135deg, ${primaryColor} 0%, ${this.darkenColor(primaryColor, 20)} 100%);
    color: white;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  
  .cover-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    line-height: 1.2;
  }
  
  .cover-subtitle {
    font-size: 1.3rem;
    font-weight: 300;
    opacity: 0.9;
    max-width: 600px;
    margin-bottom: 4rem;
  }
  
  .cover-footer {
    position: absolute;
    bottom: 40px;
    font-size: 0.9rem;
    opacity: 0.7;
  }
  
  /* Sumário */
  .toc-content {
    margin-top: 2rem;
  }
  
  .toc-item {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px dotted #d1d5db;
  }
  
  .toc-title {
    font-weight: 500;
  }
  
  .toc-page {
    font-weight: 600;
    color: ${primaryColor};
  }
  
  /* Sobre */
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-top: 2rem;
  }
  
  .about-item h3 {
    color: ${primaryColor};
    margin-bottom: 1rem;
  }
  
  .about-item ul {
    list-style: none;
    padding-left: 0;
  }
  
  .about-item li {
    padding: 0.25rem 0;
    padding-left: 1rem;
    position: relative;
  }
  
  .about-item li:before {
    content: "▶";
    color: ${primaryColor};
    position: absolute;
    left: 0;
  }
  
  /* Capítulos */
  .chapter-header {
    margin-bottom: 3rem;
  }
  
  .chapter-number {
    display: block;
    color: ${primaryColor};
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }
  
  .chapter-title,
  .section-title {
    font-size: 2.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 2rem;
    line-height: 1.2;
  }
  
  .chapter-content {
    flex: 1;
  }
  
  .chapter-content h2 {
    font-size: 1.5rem;
    color: ${primaryColor};
    margin: 2rem 0 1rem 0;
  }
  
  .chapter-content h3 {
    font-size: 1.2rem;
    color: #374151;
    margin: 1.5rem 0 0.75rem 0;
  }
  
  .chapter-content p {
    margin-bottom: 1.2rem;
    text-align: justify;
  }
  
  .chapter-content ul,
  .chapter-content ol {
    margin: 1rem 0;
    padding-left: 2rem;
  }
  
  .chapter-content li {
    margin-bottom: 0.5rem;
  }
  
  .key-points {
    margin-top: 3rem;
    padding: 1.5rem;
    background: #f8fafc;
    border-left: 4px solid ${primaryColor};
    border-radius: 0 8px 8px 0;
  }
  
  .key-points h3 {
    color: ${primaryColor};
    margin-bottom: 1rem;
  }
  
  /* Contracapa */
  .back-cover {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  
  .back-cover-content h3 {
    font-size: 2rem;
    color: ${primaryColor};
    margin-bottom: 1rem;
  }
  
  .back-cover-content p {
    color: #64748b;
    margin-bottom: 1rem;
  }
  
  .stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    margin-top: 3rem;
  }
  
  .stat {
    text-align: center;
  }
  
  .stat .number {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: ${primaryColor};
  }
  
  .stat .label {
    font-size: 0.9rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  /* Utilitários */
  .highlight {
    background: #fef3c7;
    padding: 1rem;
    border-left: 4px solid #f59e0b;
    margin: 1.5rem 0;
    border-radius: 0 8px 8px 0;
  }
  
  strong {
    font-weight: 600;
    color: #1f2937;
  }
  
  em {
    font-style: italic;
    color: #374151;
  }
  
  /* Quebras de página */
  .page-break {
    page-break-before: always;
  }
  
  /* Print adjustments */
  @media print {
    body {
      -webkit-print-color-adjust: exact;
      color-adjust: exact;
    }
  }
</style>
    `
  }

  /**
   * Utilitário para escurecer cores
   */
  private static darkenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace("#", ""), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) - amt
    const G = (num >> 8 & 0x00FF) - amt
    const B = (num & 0x0000FF) - amt
    
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1)
  }
}

export default PDFGenerator