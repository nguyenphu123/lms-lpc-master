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
import { CalendarIcon, FileDown, PlusCircle } from "lucide-react";
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
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@nextui-org/react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  canPrintReport: boolean;
  user: any;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  canPrintReport,
  user,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [dateRange, setDateRange]: any = React.useState<
    DateRange | undefined
  >();
  const [courseList, setCourseList] = React.useState(data);

  const table = useReactTable({
    data: courseList,
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
  function getMonday(d: any) {
    d = new Date(d);
    const day = d.getDay();
    const diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  async function getSheetData(filter: string) {
    const workbook = XLSX.utils.book_new();
    const exportList: any = [];

    let filteredList: any = [];

    switch (filter) {
      case "All":
        filteredList = [...courseList];
        break;
      case "Selected Rows":
        filteredList = table
          .getSelectedRowModel()
          .rows.map((row) => row.original);
        break;
      case "This Week":
        filteredList = courseList.filter((item: any) => {
          const dateFrom = getMonday(new Date()).toISOString();
          const date = new Date(item.endDate).toISOString();
          return dateFrom <= date;
        });
        break;
      case "This Month":
        const currDate = new Date();
        const firstDay = new Date(
          currDate.getFullYear(),
          currDate.getMonth(),
          1
        );
        const dateFrom = new Date(firstDay).toISOString();
        filteredList = courseList.filter((item: any) => {
          const date = new Date(item.startDate).toISOString();
          return dateFrom <= date;
        });
        break;
      case "This Year":
        const currYear = new Date().getFullYear();
        const firstDayOfYear = new Date(currYear, 0, 1);
        const dateFromYear = new Date(firstDayOfYear).toISOString();
        filteredList = courseList.filter((item: any) => {
          const date = new Date(item.startDate).toISOString();
          return dateFromYear <= date;
        });
        break;
      default:
        break;
    }

    filteredList.forEach((item: any) => {
      let testResult = item.Module.map(
        (item: any) =>
          item.title +
          " : " +
          item.UserProgress[0].score +
          "%/" +
          item.UserProgress[0].status +
          "/" +
          item.UserProgress[0].attempt +
          " attempt"
      );

      exportList.push({
        Title: item.title || "",

        Credit: item.credit || "",
        Status:
          item.ClassSessionRecord[0].status +
          " " +
          new Date(item.ClassSessionRecord[0].endDate).toLocaleDateString(
            "vi-VN",
            {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }
          ),
        "Test Result": testResult.join("\n"),
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(exportList);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    worksheet["!cols"] = [{ wch: 20 }, { wch: 20 }, { wch: 30 }, { wch: 50 }];

    const currentDate = new Date();
    let dateSuffix = "";

    if (filter === "This Week") {
      const mondayDate = getMonday(new Date());
      dateSuffix = `${mondayDate.toISOString().split("T")[0]}-${
        currentDate.toISOString().split("T")[0]
      }`;
    } else if (filter === "This Month" || filter === "This Year") {
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      dateSuffix = `${firstDayOfMonth.toISOString().split("T")[0]}-${
        currentDate.toISOString().split("T")[0]
      }`;
    } else {
      dateSuffix = new Date().toISOString().split("T")[0];
    }

    XLSX.writeFile(workbook, `${filter}_${user.username}_${dateSuffix}.xlsx`);
  }

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
  return (
    <div>
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filter courses..."
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
          <option value="finished">Finished</option>
          <option value="studying">Studying</option>
        </select>
        <DatePickerWithRange
          date={dateRange}
          setDate={setDateRange}
          className="max-w-sm"
        />
        {canPrintReport ? (
          table.getSelectedRowModel().rows.length > 1 ? (
            <Button onClick={() => getSheetData("Selected Rows")}>
              <FileDown className="h-4 w-4 mr-2" />
              Export Selected Rows to Excel
            </Button>
          ) : (
            <Button onClick={() => getSheetData("All")}>
              <FileDown className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
          )
        ) : (
          <></>
        )}
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
