// app/api/ia/siguiente-pregunta/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: Request) {
  const { historial } = await req.json()

  if (!historial || !Array.isArray(historial)) {
    return NextResponse.json({ error: 'Historial inválido' }, { status: 400 })
  }

  // Construye el contexto: preguntas y respuestas previas
  const contexto = historial
    .map((p: { pregunta: string; respuesta: string }) => `${p.pregunta}\n${p.respuesta}`)
    .join('\n\n')

  const prompt = `
Eres un asistente legal que ayuda a una persona a redactar una denuncia administrativa o de corrupción. 
Tu objetivo es obtener todos los elementos legales clave (hechos, tiempo, lugar, modo, sujetos, evidencia) de forma clara y eficiente.

Historial de conversación:
${contexto}

Haz UNA sola pregunta directa para obtener el siguiente elemento faltante. Usa un tono profesional, directo y sin frases emocionales. 
No repitas elementos ya cubiertos. No digas "gracias" ni "entiendo". Sé breve, preciso y formal.

⚠️ Si ya tienes todos los elementos mencionados, responde exactamente:
"Gracias por la información. Ya tengo los elementos necesarios para clasificar la falta. Puedes presionar el botón para continuar."
`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente legal guiado por elementos legales. Preciso, directo y claro.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.4,
      max_tokens: 300,
    })

    const pregunta = completion.choices?.[0]?.message?.content?.trim() || "No se pudo generar la siguiente pregunta."
    return NextResponse.json({ pregunta })
  } catch (error) {
    console.error('❌ Error generando pregunta:', error)
    return NextResponse.json({ error: 'Error generando siguiente pregunta' }, { status: 500 })
  }
}
