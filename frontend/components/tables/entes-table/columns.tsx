// @ts-nocheck
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";

export const createColumns = (session): ColumnDef<any>[] => [
  {
    accessorKey: "fecha",
    header: () => <div className="text-left">Fecha</div>,
    cell: ({ row }) => {
      const fecha = row.original.fecha;
      if (!fecha) return <div className="text-left">-</div>;
      const formattedDate = new Date(fecha).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      return <div className="text-left">{formattedDate}</div>;
    },
    size: 120,
    enableSorting: true,
  },
  {
    accessorKey: "ejercicio",
    header: () => <div className="text-center">Ejercicio</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.ejercicio || '-'}</div>
    ),
    size: 100,
    enableSorting: true,
  },
  {
    id: "nombre",
    accessorFn: (row) => row.datosGenerales?.nombre,
    header: () => <div className="text-left">Nombre(s)</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.datosGenerales?.nombre || '-'}</div>
    ),
    size: 200,
    enableSorting: true,
  },
  {
    id: "primerApellido",
    accessorFn: (row) => row.datosGenerales?.primerApellido,
    header: () => <div className="text-left">Primer Apellido</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.datosGenerales?.primerApellido || '-'}</div>
    ),
    size: 200,
    enableSorting: true,
  },
  {
    id: "segundoApellido",
    accessorFn: (row) => row.datosGenerales?.segundoApellido,
    header: () => <div className="text-left">Segundo Apellido</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.datosGenerales?.segundoApellido || '-'}</div>
    ),
    size: 200,
    enableSorting: true,
  },
  {
    id: "entidadFederativa",
    accessorFn: (row) => row.empleoCargoComision?.entidadFederativa,
    header: () => <div className="text-left">Entidad Federativa</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.empleoCargoComision?.entidadFederativa || '-'}</div>
    ),
    size: 180,
    enableSorting: true,
  },
  {
    id: "siglasEntePublico",
    accessorFn: (row) => row.empleoCargoComision?.siglasEntePublico,
    header: () => <div className="text-left">Siglas Ente Público</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.empleoCargoComision?.siglasEntePublico || '-'}</div>
    ),
    size: 180,
    enableSorting: true,
  },
  {
    id: "vigencia",
    accessorKey: "date_updated",
    header: () => <div className="text-center">Vigencia</div>,
    cell: ({ row }) => {
      const dateUpdated = row.original.date_updated;

      if (!dateUpdated) {
        return (
          <div className="flex justify-center">
            <Badge variant="destructive">
              Actualización requerida
            </Badge>
          </div>
        );
      }

      const today = new Date();
      const updatedDate = new Date(dateUpdated);
      const diffTime = Math.abs(today.getTime() - updatedDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const isExpired = diffDays >= 15;

      return (
        <div className="flex justify-center">
          <Badge variant={isExpired ? "destructive" : "success"}>
            {isExpired ? "Actualización requerida" : "Vigente"}
          </Badge>
        </div>
      );
    },
    size: 180,
    enableSorting: true,
  },
  {
    id: "actions",
    header: () => <div className="text-center"></div>,
    cell: ({ row }) => <CellAction data={row.original} session={session} />,
    size: 25,
    enableSorting: false,
  },
];
