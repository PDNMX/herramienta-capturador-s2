import { NextRequest, NextResponse } from "next/server";
import { saveServidorContratacion } from "@/components/forms/servidoresContrataciones/handler";
import { servidoresContratacionesSchema } from "@/components/forms/servidoresContrataciones/schema";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    // Obtener el token de autorización del header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No autorizado. Proporcione un token válido." },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace("Bearer ", "");

    // Parsear el body de la petición
    const body = await request.json();

    // Validar los datos con el schema de Zod
    const validatedData = servidoresContratacionesSchema.parse(body);

    // Guardar en la base de datos usando el handler
    await saveServidorContratacion(validatedData, null, accessToken);

    return NextResponse.json(
      {
        success: true,
        message: "Servidor de contrataciones guardado exitosamente",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error al guardar servidor de contrataciones:", error);

    // Manejar errores de validación de Zod
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Error de validación",
          details: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Manejar otros errores
    return NextResponse.json(
      {
        error: "Error al guardar el registro",
        message: error.message || "Error desconocido",
        details: error.errors || null,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: "Endpoint para crear servidores de contrataciones",
      method: "POST",
      endpoint: "/api/servidores-contrataciones",
    },
    { status: 200 }
  );
}
