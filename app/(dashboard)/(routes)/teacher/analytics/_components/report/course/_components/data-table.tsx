"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { PlusCircle, FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useQuery } from "react-query";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [instructors, setInstructors] = React.useState([]);
  const [fromDate, setFromDate] = React.useState(new Date());
  const [toDate, setToDate] = React.useState(new Date());
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });
  React.useEffect(() => {
    async function getInstructors() {
      let instructorList = await axios.get(`/api/user/instructor`);
      setInstructors(instructorList.data);
    }

    getInstructors();
  }, []);
  async function getSheetData() {
    data.forEach((a: any) => {
      delete a.imageUrl;
    });
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    const date = new Date();
    XLSX.writeFile(workbook, `${""}_${date}.xlsx`);
  }
  const onChangeFromDate = (e: any, date: any) => {
    if (date.getTime() > toDate.getTime()) {
      setToDate(date);
      table.getColumn("endDate")?.setFilterValue(date);
    }
    setFromDate(date);
    table.getColumn("startDate")?.setFilterValue(date);
    table.getColumn("endDate")?.setFilterValue(new Date());
  };
  const onChangeToDate = (e: any, date: any) => {
    if (date.getTime() < fromDate.getTime()) {
      setFromDate(date);

      table.getColumn("startDate")?.setFilterValue(date);
    }
    setToDate(date);

    table.getColumn("endDate")?.setFilterValue(date);
    table.getColumn("startDate")?.setFilterValue(new Date());
  };
  return (
    <div>
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filter title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <select
          name="status"
          id="filterByStatus"
          onChange={(event) =>
            table.getColumn("status")?.setFilterValue(event.target.value)
          }
        >
          <option value="">All</option>
          {instructors.map((item: any) => {
            return (
              <option key={item.id} value={item.id}>
                {item.username}
              </option>
            );
          })}
        </select>
        <label htmlFor="birthday">From Date:</label>
        <input
          type="date"
          id="fromDate"
          name="fromDate"
          onChange={(e: any) => onChangeFromDate(e, e.target.value)}
        ></input>
        <label htmlFor="birthday">To Date:</label>
        <input
          type="date"
          id="toDate"
          name="toDate"
          onChange={(e: any) => onChangeToDate(e, e.target.value)}
        ></input>
        <Button onClick={() => getSheetData()}>
          <FileDown className="h-4 w-4 mr-2" />
          Export report
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
