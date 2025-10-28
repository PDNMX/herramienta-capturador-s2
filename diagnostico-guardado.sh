#!/bin/bash

# Script de diagnóstico para el flujo de guardado
# Verifica todo el proceso de guardado de datos

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${YELLOW}============================================================${NC}"
echo -e "${YELLOW}  DIAGNÓSTICO: Flujo de Guardado de Formulario${NC}"
echo -e "${YELLOW}============================================================${NC}\n"

# 1. Verificar que Next.js esté corriendo
echo -e "${BLUE}[1/7] Verificando Next.js...${NC}"
if curl -s http://localhost:3005 > /dev/null 2>&1; then
    echo -e "   ${GREEN}✓${NC} Next.js está corriendo en puerto 3005"
else
    echo -e "   ${RED}✗${NC} Next.js NO está corriendo en puerto 3005"
    echo -e "   ${YELLOW}→${NC} Ejecuta: cd herramienta-capturador-s2 && npm run dev"
fi

# 2. Verificar que Directus esté corriendo
echo -e "\n${BLUE}[2/7] Verificando Directus...${NC}"
if curl -s http://localhost:8055/server/ping | grep -q "pong"; then
    echo -e "   ${GREEN}✓${NC} Directus está corriendo en puerto 8055"
else
    echo -e "   ${RED}✗${NC} Directus NO está corriendo"
    echo -e "   ${YELLOW}→${NC} Ejecuta: docker-compose up -d"
fi

# 3. Verificar configuración de .env
echo -e "\n${BLUE}[3/7] Verificando configuración .env...${NC}"
if [ -f ".env" ]; then
    BACKEND_URL=$(grep NEXT_PUBLIC_BACKEND_URL .env | cut -d '=' -f2)
    echo -e "   ${GREEN}✓${NC} Archivo .env existe"
    echo -e "   ${BLUE}→${NC} NEXT_PUBLIC_BACKEND_URL: $BACKEND_URL"
else
    echo -e "   ${RED}✗${NC} Archivo .env NO existe"
    echo -e "   ${YELLOW}→${NC} Crea .env desde .env-EXAMPLE"
fi

# 4. Verificar colección en Directus
echo -e "\n${BLUE}[4/7] Verificando colección en Directus...${NC}"
COLLECTION="servidores_intervengan_procedimientos_contrataciones"
# Intentar obtener items (aunque falle por autenticación, nos dirá si la colección existe)
RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:8055/items/$COLLECTION?limit=1 2>/dev/null)
HTTP_CODE=$(echo "$RESPONSE" | tail -1)

if [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "403" ]; then
    echo -e "   ${GREEN}✓${NC} Colección existe (requiere autenticación)"
elif [ "$HTTP_CODE" = "404" ]; then
    echo -e "   ${RED}✗${NC} Colección NO existe o nombre incorrecto"
    echo -e "   ${YELLOW}→${NC} Verifica el nombre: $COLLECTION"
else
    echo -e "   ${GREEN}✓${NC} Colección accesible (código: $HTTP_CODE)"
fi

# 5. Verificar archivos clave del proyecto
echo -e "\n${BLUE}[5/7] Verificando archivos del proyecto...${NC}"

FILES=(
    "components/forms/servidoresContrataciones/handler.ts"
    "components/forms/servidoresContrataciones/schema.ts"
    "app/(dashboard)/inicio/entes/create/page.tsx"
    "lib/directus.ts"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "   ${GREEN}✓${NC} $file"
    else
        echo -e "   ${RED}✗${NC} $file ${RED}(FALTA)${NC}"
    fi
done

# 6. Verificar que el handler usa el nombre correcto de colección
echo -e "\n${BLUE}[6/7] Verificando nombre de colección en el código...${NC}"
HANDLER_FILE="components/forms/servidoresContrataciones/handler.ts"
if [ -f "$HANDLER_FILE" ]; then
    if grep -q "servidores_intervengan_procedimientos_contrataciones" "$HANDLER_FILE"; then
        echo -e "   ${GREEN}✓${NC} Handler usa nombre correcto de colección"
    else
        echo -e "   ${RED}✗${NC} Handler NO usa nombre correcto de colección"
        echo -e "   ${YELLOW}→${NC} Busca el nombre en $HANDLER_FILE"
    fi
fi

PAGE_FILE="app/(dashboard)/inicio/entes/create/page.tsx"
if [ -f "$PAGE_FILE" ]; then
    if grep -q "servidores_intervengan_procedimientos_contrataciones" "$PAGE_FILE"; then
        echo -e "   ${GREEN}✓${NC} Page usa nombre correcto de colección"
    else
        echo -e "   ${RED}✗${NC} Page NO usa nombre correcto de colección"
        echo -e "   ${YELLOW}→${NC} Revisa $PAGE_FILE (línea ~41)"
    fi
fi

# 7. Información adicional
echo -e "\n${BLUE}[7/7] Información adicional...${NC}"
echo -e "   ${BLUE}→${NC} URL del formulario: http://localhost:3005/inicio/entes/create"
echo -e "   ${BLUE}→${NC} Endpoint de Directus: http://localhost:8055/items/$COLLECTION"
echo -e "   ${BLUE}→${NC} API de Next.js: http://localhost:3005/api/servidores-contrataciones"

# Resumen
echo -e "\n${YELLOW}============================================================${NC}"
echo -e "${YELLOW}  SIGUIENTE PASO${NC}"
echo -e "${YELLOW}============================================================${NC}\n"

echo -e "${BLUE}Para probar el guardado:${NC}"
echo -e "1. Abre http://localhost:3005/inicio/entes/create"
echo -e "2. Abre DevTools (F12) y ve a la pestaña Console"
echo -e "3. Llena el formulario con datos válidos"
echo -e "4. Haz click en Guardar"
echo -e "5. Observa los logs en la consola\n"

echo -e "${BLUE}Datos de prueba válidos:${NC}"
echo -e "- CURP: PEGJ800101HDFRRS09"
echo -e "- RFC: PEGJ800101ABC"
echo -e "- Ejercicio: 2023"
echo -e "- Nombres: sin números\n"

echo -e "${BLUE}Si necesitas más ayuda, revisa:${NC}"
echo -e "- DIAGNOSTICO-FRONTEND.md"
echo -e "- RESUMEN-CORRECCIONES.md"
echo -e "- PRUEBAS-RAPIDAS.md\n"
