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
import { PlusCircle, FileDown, ChevronDown } from "lucide-react";
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
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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
  const [courseList, setCourseList] = React.useState(data);
  const [instructors, setInstructors] = React.useState([]);
  const [dateRange, setDateRange]: any = React.useState<
    DateRange | undefined
  >();
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data: courseList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  React.useEffect(() => {
    async function getInstructors() {
      let instructorList = await axios.get(`/api/user/instructor`);
      setInstructors(instructorList.data);
    }

    getInstructors();
  }, []);

  React.useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      let tempUserList = [...data].filter((item: any) => {
        let dateFrom: any = new Date(dateRange.from.toISOString());
        let date: any = new Date(new Date(item.startDate).toISOString());
        let dateTo: any = new Date(dateRange.to.toISOString());
        return dateFrom <= date && date <= dateTo;
      });

      setCourseList(tempUserList);
      // table.getColumn("startDate")?.setFilterValue(dateRange.from);
      // table.getColumn("endDate")?.setFilterValue(dateRange.to);
    } else {
      setCourseList(data);
    }
  }, [dateRange, table]);

  async function getSheetData() {
    data.forEach((a: any) => {
      delete a.imageUrl;
    });
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const date = new Date();
    XLSX.writeFile(workbook, `${""}_${date}.xlsx`);
  }

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
            table
              .getColumn("courseInstructedBy")
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm p-2 border rounded text-muted-foreground dark:bg-slate-950"
        >
          <option value="">All Instructors</option>
          {instructors.map((item: any) => (
            <option
              key={item.id}
              value={item.id}
              className="text-black dark:text-white"
            >
              {item.username}
            </option>
          ))}
        </select>
        <DatePickerWithRange
          date={dateRange}
          setDate={setDateRange}
          className="max-w-sm"
        />
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <FileDown className="h-4 w-4 mr-2" />
                Select report <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => getSheetData()}>
                Report (All)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => getSheetData()}>
                Report (Selected Rows)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => getSheetData()}>
                Report (This Week)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => getSheetData()}>
                Report (This Month)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => getSheetData()}>
                Report (This Year)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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

function DatePickerWithRange({
  className,
  date,
  setDate,
}: {
  className?: string;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Check course created between</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
