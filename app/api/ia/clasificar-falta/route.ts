// app/api/ia/clasificar-falta/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

const contexto_faltas = `
Clasificación de faltas:

FALTAS ADMINISTRATIVAS GRAVES
- Cohecho: Aceptar sobornos o dádivas para realizar acciones relacionadas con su función.
- Peculado: Apropiación o uso indebido de bienes públicos.
- Desvío de recursos públicos: Utilizar recursos públicos para fines distintos a los autorizados.
- Abuso de funciones: Ejercer atribuciones no conferidas o usarlas para obtener beneficios.
- Actuación bajo conflicto de interés: Intervenir en asuntos con interés personal o familiar.

FALTAS ADMINISTRATIVAS NO GRAVES
- Negligencia administrativa: Descuido en el cumplimiento de obligaciones.
- Incumplimiento de funciones: No realizar tareas conforme a normativa.
- Descuido en la conservación de recursos: Mal uso o abandono de bienes asignados.
- Omisión en la declaración patrimonial: Declaración incompleta o no presentada.
- Violación de procedimientos de contratación: Incumplimiento de reglas en contrataciones.

HECHOS DE CORRUPCIÓN
- Soborno: Ofrecer o recibir beneficios indebidos por favores.
- Malversación de fondos: Uso indebido de recursos públicos.
- Tráfico de influencias: Uso de relaciones para obtener ventajas.
- Enriquecimiento ilícito: Incremento patrimonial sin justificación legal.
- Obstrucción de la justicia: Impedir investigaciones o sanciones.
`

export async function POST(req: Request) {
  try {
    const { historial } = await req.json()

    if (!historial || !Array.isArray(historial)) {
      console.warn("⚠️ Historial inválido:", historial)
      return NextResponse.json({ error: 'Historial inválido' }, { status: 400 })
    }

    const relato = historial.map((p: any) => `- ${p.respuesta}`).join('\n')

    const prompt = `
Actúas como abogado especialista en derecho administrativo sancionador. A partir del siguiente relato del denunciante, realiza un análisis jurídico profesional en un solo párrafo, sin listas ni encabezados.

Debes:
- Identificar si se trata de una falta administrativa grave, no grave o un hecho de corrupción.
- Precisar la clasificación específica.
- Justificar jurídicamente tu clasificación, basado en los hechos descritos.

No emitas recomendaciones, opiniones ni repitas definiciones jurídicas. Sé conciso, formal y técnico.

Clasificación legal de referencia:
${contexto_faltas}

Relato del denunciante:
${relato}
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Eres un abogado experto en derecho administrativo y anticorrupción. Escribes dictámenes legales claros y sin rodeos.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 750,
    })

    const resultado = completion.choices[0].message.content?.trim()

    if (!resultado) {
      throw new Error("Respuesta vacía del modelo")
    }

    return NextResponse.json({ clasificacion: resultado })
  } catch (error) {
    console.error("❌ Error clasificando falta:", error)
    return NextResponse.json({ error: 'Error al clasificar la falta' }, { status: 500 })
  }
}
