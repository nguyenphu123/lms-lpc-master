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
    },
  });
  function getMonday(d: any) {
    d = new Date(d);
    const day = d.getDay();
    const diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  async function getSheetData(filter: any) {
    const workbook = XLSX.utils.book_new();

    if (filter == "All") {
      let newList: any = [...programList];
      let exportList = [];
      for (let i = 0; i < newList.length; i++) {
        let courses_report = "";
        for (let j = 0; j < newList[i].courseWithProgram.length; j++) {
          courses_report =
            courses_report +
            "" +
            newList[i].courseWithProgram[j].course.title +
            " \n";
        }
        let newItem = {
          title: newList[i].title,
          description: newList[i].description,

          courses_report: courses_report,
        };
        exportList.push(newItem);
      }

      const worksheet = XLSX.utils.json_to_sheet(programList);

      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      worksheet["!cols"] = [
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 50 },
      ];
      const date = new Date();
      XLSX.writeFile(workbook, `${filter}_Program_${date}.xlsx`);
    }
    if (filter == "Selected Rows") {
      let newList: any = [...table.getSelectedRowModel().rows];
      let exportList = [];
      for (let i = 0; i < newList.length; i++) {
        let courses_report = "";
        for (let j = 0; j < newList[i].original.courseWithProgram.length; j++) {
          courses_report =
            courses_report +
            "" +
            newList[i].original.courseWithProgram[j].course.title +
            " \n";
        }
        let newItem = {
          title: newList[i].original.title,
          description: newList[i].original.description,

          courses_report: courses_report,
        };
        exportList.push(newItem);
      }

      const worksheet = XLSX.utils.json_to_sheet(programList);

      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      worksheet["!cols"] = [
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 50 },
      ];
      const date = new Date();
      XLSX.writeFile(workbook, `${filter}_Program_${date}.xlsx`);
    }
    if (filter == "This Week") {
      let newList: any = [...programList].filter((item: any) => {
        let dateFrom: any = getMonday(new Date()).toISOString();
        let date: any = new Date(new Date(item.endDate).toISOString());
        // let dateTo: any = getSunday(new Date()).toISOString();
        return dateFrom <= date;
      });
      let exportList = [];
      for (let i = 0; i < newList.length; i++) {
        let courses_report = "";
        for (let j = 0; j < newList[i].courseWithProgram.length; j++) {
          courses_report =
            courses_report +
            "" +
            newList[i].courseWithProgram[j].course.title +
            " \n";
        }
        let newItem = {
          title: newList[i].title,
          description: newList[i].description,

          courses_report: courses_report,
        };
        exportList.push(newItem);
      }

      const worksheet = XLSX.utils.json_to_sheet(programList);

      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      worksheet["!cols"] = [
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 50 },
      ];
      const date = new Date();
      XLSX.writeFile(workbook, `${filter}_Program_${date}.xlsx`);
    }
    if (filter == "This Month") {
      let newList: any = [...programList].filter((item: any) => {
        let currDate = new Date();
        let firstDay = new Date(currDate.getFullYear(), currDate.getMonth(), 1);

        let dateFrom: any = new Date(firstDay.toISOString());
        let date: any = new Date(new Date(item.startDate).toISOString());
        // let dateTo: any = new Date(dateRangeEnd.to.toISOString());
        return dateFrom <= date;
      });
      let exportList = [];
      for (let i = 0; i < newList.length; i++) {
        let courses_report = "";
        for (let j = 0; j < newList[i].courseWithProgram.length; j++) {
          courses_report =
            courses_report +
            "" +
            newList[i].courseWithProgram[j].course.title +
            " \n";
        }
        let newItem = {
          title: newList[i].title,
          description: newList[i].description,

          courses_report: courses_report,
        };
        exportList.push(newItem);
      }

      const worksheet = XLSX.utils.json_to_sheet(programList);

      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      worksheet["!cols"] = [
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 50 },
      ];
      const date = new Date();
      XLSX.writeFile(workbook, `${filter}_Program_${date}.xlsx`);
    }
    if (filter == "This Year") {
      let newList: any = [...programList].filter((item: any) => {
        let currDate = new Date();
        let firstDay = new Date(currDate.getFullYear(), 0, 1);

        let dateFrom: any = new Date(firstDay.toISOString());
        let date: any = new Date(new Date(item.startDate).toISOString());
        // let dateTo: any = new Date(dateRangeEnd.to.toISOString());
        return dateFrom <= date;
      });
      let exportList = [];
      for (let i = 0; i < newList.length; i++) {
        let courses_report = "";
        for (let j = 0; j < newList[i].courseWithProgram.length; j++) {
          courses_report =
            courses_report +
            "" +
            newList[i].courseWithProgram[j].course.title +
            " \n";
        }
        let newItem = {
          title: newList[i].title,
          description: newList[i].description,

          courses_report: courses_report,
        };
        exportList.push(newItem);
      }

      const worksheet = XLSX.utils.json_to_sheet(programList);

      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      worksheet["!cols"] = [
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 50 },
      ];
      const date = new Date();
      XLSX.writeFile(workbook, `${filter}_Program_${date}.xlsx`);
    }
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
        <label htmlFor="fromDate">From Date:</label>
        <DatePickerWithRange
          date={dateRange}
          setDate={setDateRange}
          className="max-w-sm"
        />
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
                <DropdownMenuItem onClick={() => getSheetData("Selected Rows")}>
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
              <span>Pick a date</span>
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
