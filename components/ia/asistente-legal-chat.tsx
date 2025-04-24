"use client"

import { useState, useRef, useEffect } from "react"
import {
  CheckCircle,
  Clock,
  MapPin,
  Users,
  FileText,
  Eye,
  Loader2
} from "lucide-react"

const ELEMENTOS = [
  { id: "hechos", label: "Hechos", icon: Eye },
  { id: "tiempo", label: "Tiempo", icon: Clock },
  { id: "lugar", label: "Lugar", icon: MapPin },
  { id: "modo", label: "Modo", icon: FileText },
  { id: "sujetos", label: "Sujetos", icon: Users },
  { id: "evidencia", label: "Evidencia", icon: CheckCircle }
]

export function AsistenteLegalChat() {
  const [messages, setMessages] = useState([{ tipo: "ia", texto: "Hola, ¿podrías contarme brevemente qué ocurrió?" }])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [clasificacion, setClasificacion] = useState("")
  const [mostrarModal, setMostrarModal] = useState(false)
  const [cargandoClasificacion, setCargandoClasificacion] = useState(false)
  const [elementosDetectados, setElementosDetectados] = useState<string[]>([])
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  const clasificarFalta = async () => {
    try {
      setCargandoClasificacion(true)
      const historial = messages
        .filter((m) => m.tipo === "usuario")
        .map((m, i) => ({
          pregunta: messages[i * 2]?.texto || "",
          respuesta: m.texto,
        }))

      const res = await fetch("/api/ia/clasificar-falta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ historial }),
      })

      const data = await res.json()
      setClasificacion(data.clasificacion || "❌ No se pudo clasificar.")
      setMostrarModal(true)
    } catch (err) {
      console.error("❌ Error al clasificar:", err)
      setClasificacion("❌ Error al clasificar la falta.")
      setMostrarModal(true)
    } finally {
      setCargandoClasificacion(false)
    }
  }

  const enviar = async () => {
    if (!input.trim()) return

    const nuevaEntrada = { tipo: "usuario", texto: input.trim() }
    const historialActualizado = [...messages, nuevaEntrada]
    setMessages(historialActualizado)
    setInput("")
    setLoading(true)

    try {
      const resPregunta = await fetch("/api/ia/siguiente-pregunta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          historial: historialActualizado.filter((m) => m.tipo === "usuario").map((m, i) => ({
            pregunta: messages[i * 2]?.texto || "",
            respuesta: m.texto,
          })),
        }),
      })

      const dataPregunta = await resPregunta.json()
      const textoPregunta = dataPregunta.pregunta || "Sin respuesta de la IA."
      setMessages((prev) => [...prev, { tipo: "ia", texto: textoPregunta }])

      const resAnalisis = await fetch("/api/ia/analizar-elementos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ historial: historialActualizado }),
      })

      const dataAnalisis = await resAnalisis.json()
      const nuevos = dataAnalisis.elementos || []

      const todosDetectados = ELEMENTOS.every(e =>
        elementosDetectados.includes(e.id) || nuevos.includes(e.id)
      )

      if (todosDetectados) {
        setMessages((prev) => [
          ...prev,
          {
            tipo: "ia",
            texto: "Gracias por la información. Ya tengo los elementos necesarios para clasificar la falta.",
          },
        ])
        setTimeout(() => {
          clasificarFalta()
        }, 1000)
      }

      if (Array.isArray(nuevos)) {
        setElementosDetectados((prev) =>
          Array.from(new Set([...prev, ...nuevos.map((e: string) => e.toLowerCase())]))
        )
      }
    } catch (err) {
      console.error("❌ Error en el flujo:", err)
      setMessages((prev) => [...prev, { tipo: "ia", texto: "❌ Error al conectar con la IA." }])
    } finally {
      setLoading(false)
    }
  }

  // Spinner overlay centrado
  const SpinnerOverlay = () => (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="flex items-center gap-2 bg-white px-6 py-4 rounded-md shadow-md">
        <Loader2 className="w-5 h-5 animate-spin text-green-700" />
        <span className="text-sm text-gray-800">Generando clasificación del tipo de falta administrativa o hecho de corrupción...</span>
      </div>
    </div>
  )

  return (
    <div className="p-4 rounded-2xl border border-muted shadow-sm bg-muted/40 space-y-4">
      <h3 className="text-base md:text-lg font-semibold text-primary">
        🧠 Asistente de IA para identificar el tipo de falta administrativa
      </h3>

      {/* Chips visuales */}
      <div className="flex flex-wrap gap-2">
        {ELEMENTOS.map((el) => {
          const Icon = el.icon
          const activo = elementosDetectados.includes(el.id)
          return (
            <div
              key={el.id}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm border transition-all ${
                activo
                  ? "bg-green-100 border-green-500 text-green-800 font-semibold"
                  : "bg-gray-100 border-gray-300 text-gray-500"
              }`}
            >
              <Icon className="w-4 h-4" />
              {el.label}
            </div>
          )
        })}
      </div>

      {/* Conversación */}
      <div
        ref={chatRef}
        className="h-64 overflow-y-auto border border-muted rounded-xl p-3 bg-background space-y-2"
      >
        {messages.map((m, i) => (
          <div key={i} className={`text-sm ${m.tipo === "ia" ? "text-left" : "text-right"}`}>
            <span
              className={`inline-block px-4 py-2 rounded-xl max-w-[80%] ${
                m.tipo === "ia"
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {m.texto}
            </span>
          </div>
        ))}
      </div>

      {/* Overlay mientras se genera la clasificación */}
      {cargandoClasificacion && !mostrarModal && <SpinnerOverlay />}

      {/* Clasificación Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 space-y-4">
            <h2 className="text-lg font-semibold text-green-700 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> Clasificación de la falta
            </h2>
            {cargandoClasificacion ? (
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Generando clasificación...
              </div>
            ) : (
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{clasificacion}</p>
            )}
            <div className="text-right">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input y botón */}
      <div className="flex items-end gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          placeholder="Tu mensaje"
          className="flex-1 text-sm px-3 py-2 border border-muted rounded-md bg-background placeholder:text-muted-foreground"
        />
        <button
          onClick={enviar}
          disabled={loading}
          className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition"
        >
          {loading ? "..." : "Enviar"}
        </button>
      </div>
    </div>
  )
}
