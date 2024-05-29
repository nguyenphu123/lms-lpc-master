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
  DropdownMenuItem,
  DropdownMenuTrigger,
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
  const [programList, setProgramList] = React.useState(data);
  const [rowSelection, setRowSelection] = React.useState({});
  const [dateRange, setDateRange]: any = React.useState<
    DateRange | undefined
  >();
  const [datePickerDisabled, setDatePickerDisabled] = React.useState(false); // State to manage date picker disable

  const [columnVisibility, setColumnVisibility] = React.useState({});

  const table = useReactTable({
    data: programList,
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
      columnVisibility: {
        endDate: false,
      },
    },
  });

  async function getSheetData(filter: any) {
    const workbook = XLSX.utils.book_new();
    const generateSheet = (dataList: any[]) => {
      let exportList = dataList.map((item) => {
        let courses_report = item.courseWithProgram
          .map((course: { course: { title: any } }) => course.course.title)
          .join("\n");
        return {
          Title: item.title,
          Description: item.description,
          "Courses Report": courses_report,
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportList);
      const worksheetCols = [{ wch: 20 }, { wch: 30 }, { wch: 50 }];

      worksheet["!cols"] = worksheetCols;

      // Apply bold formatting to header row
      const range = XLSX.utils.decode_range(worksheet["!ref"] || "");
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ c: C, r: 0 });
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = {
          font: {
            bold: true,
          },
        };
      }
      for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        const rowAddress = XLSX.utils.encode_row(R);
        const cell = worksheet[`A${R}`];
        if (cell) {
          cell.v = cell.v + "\n\n"; // Add new lines to simulate row height
        }
      }

      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    };

    let newList: any = [];
    switch (filter) {
      case "All":
        newList = [...programList];
        break;
      case "Selected Rows":
        newList = [...table.getSelectedRowModel().rows].map(
          (row) => row.original
        );
        break;
      case "This Week":
        newList = [...programList].filter((item: any) => {
          let dateFrom: any = getMonday(new Date()).toISOString();
          let date: any = new Date(new Date(item.endDate).toISOString());
          return dateFrom <= date;
        });
        break;
      case "This Month":
        newList = [...programList].filter((item: any) => {
          let currDate = new Date();
          let firstDay = new Date(
            currDate.getFullYear(),
            currDate.getMonth(),
            1
          );
          let dateFrom: any = new Date(firstDay.toISOString());
          let date: any = new Date(new Date(item.startDate).toISOString());
          return dateFrom <= date;
        });
        break;
      case "This Year":
        newList = [...programList].filter((item: any) => {
          let currDate = new Date();
          let firstDay = new Date(currDate.getFullYear(), 0, 1);
          let dateFrom: any = new Date(firstDay.toISOString());
          let date: any = new Date(new Date(item.startDate).toISOString());
          return dateFrom <= date;
        });
        break;
      default:
        return;
    }

    generateSheet(newList);

    const date = new Date();
    XLSX.writeFile(workbook, `${filter}_Program_${date}.xlsx`);
  }

  function getMonday(d: any) {
    d = new Date(d);
    const day = d.getDay();
    const diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }
  React.useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      // table.getColumn("startDate")?.setFilterValue(dateRange.from);
      // table.getColumn("endDate")?.setFilterValue(dateRange.to);
      let tempUserList = [...data].filter((item: any) => {
        let dateFrom: any = new Date(dateRange.from.toISOString());
        let date: any = new Date(new Date(item.startDate).toISOString());
        let dateTo: any = new Date(dateRange.to.toISOString());
        return dateFrom <= date && date <= dateTo;
      });

      setProgramList(tempUserList);
      setDatePickerDisabled(true); // Disable date picker after selecting date range
    } else {
      setProgramList(data);
    }
  }, [dateRange, table]);
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
        <div className="flex gap-2 items-center">
          <DatePickerWithRange
            placeHolder={"Filter by date"}
            date={dateRange}
            setDate={setDateRange}
            className="max-w-sm"
            disabled={datePickerDisabled}
          />
          {dateRange != undefined ? (
            <button
              onClick={() => {
                setDateRange(undefined);
                setDatePickerDisabled(false); // Enable date picker on cancel
              }}
            >
              X
            </button>
          ) : (
            <></>
          )}
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <FileDown className="h-4 w-4 mr-2" />
                Select report <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            {programList.length == 0 ? (
              <></>
            ) : (
              <DropdownMenuContent>
                {table.getSelectedRowModel().rows.length == 0 ? (
                  <DropdownMenuItem onClick={() => getSheetData("All")}>
                    Report (All)
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => getSheetData("Selected Rows")}
                  >
                    Report (Selected Rows)
                  </DropdownMenuItem>
                )}
                {table.getSelectedRowModel().rows.length == 0 ? (
                  <DropdownMenuItem onClick={() => getSheetData("This Week")}>
                    Report (This Week)
                  </DropdownMenuItem>
                ) : (
                  <></>
                )}
                {table.getSelectedRowModel().rows.length == 0 ? (
                  <DropdownMenuItem onClick={() => getSheetData("This Month")}>
                    Report (This Month)
                  </DropdownMenuItem>
                ) : (
                  <></>
                )}
                {table.getSelectedRowModel().rows.length == 0 ? (
                  <DropdownMenuItem onClick={() => getSheetData("This Year")}>
                    Report (This Year)
                  </DropdownMenuItem>
                ) : (
                  <></>
                )}
              </DropdownMenuContent>
            )}
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
  placeHolder,
  className,
  date,
  setDate,
  disabled,
}: {
  placeHolder?: string;
  disabled?: boolean; // Accept disabled prop
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
              !date && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed" // Apply styles when disabled
            )}
            disabled={disabled} // Disable button when disabled prop is true
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
              <span>{placeHolder}</span>
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
