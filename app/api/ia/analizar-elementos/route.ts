// app/api/ia/analizar-elementos/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: Request) {
  try {
    const { historial } = await req.json()

    if (!historial || !Array.isArray(historial)) {
      console.warn("⚠️ Historial inválido:", historial)
      return NextResponse.json({ error: 'Historial inválido' }, { status: 400 })
    }

    const textoUsuario = historial
      .filter((m: any) => m.tipo === "usuario")
      .map((m: any) => m.texto)
      .join("\n")

    const prompt = `
    Eres un asistente legal. Analiza el siguiente texto y responde SOLO con una lista JSON válida que indique qué elementos de una denuncia legal están presentes. 
      
    SOLO considera que un elemento está presente si el texto contiene una descripción clara, específica y directa del mismo. No asumas ni infieras elementos implícitos. No incluyas explicaciones ni formato markdown.
      
    Elementos posibles:
      - hechos: Descripción de lo que ocurrió.
      - tiempo: Cuándo ocurrió (fecha o momento).
      - lugar: Dónde ocurrió (ubicación).
      - modo: Cómo ocurrió.
      - sujetos: Quiénes participaron o fueron testigos (nombre, cargo, etc.).
      - evidencia: Pruebas disponibles (fotos, audios, documentos).
      
    Texto del usuario:
    ${textoUsuario}
      
    Ejemplo de salida válida:
    ["hechos", "tiempo", "lugar", "modo", "sujetos", "evidencia"]
    `
      

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Eres un abogado que etiqueta elementos clave en una denuncia.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 100,
    })

    let raw = completion.choices[0].message.content?.trim() || '[]'
    console.log("📦 Respuesta bruta IA:", raw)

    if (raw.startsWith("```")) {
      raw = raw.replace(/```json|```/g, "").trim()
    }

    const elementos = JSON.parse(raw)
    console.log("✅ Elementos detectados:", elementos)

    return NextResponse.json({ elementos })
  } catch (err) {
    console.error("❌ Error analizando elementos:", err)
    return NextResponse.json({ error: 'Error al analizar elementos' }, { status: 500 })
  }
}
