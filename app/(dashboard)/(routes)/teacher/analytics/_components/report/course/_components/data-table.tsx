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
  const [columnVisibility, setColumnVisibility] = React.useState({});
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
      columnVisibility: {
        courseInstructedBy: false,
      },
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
      const moduleList = item.Module.map(
        (module: any) => `${module.title} : ${module.type}`
      ).join(" \n");
      const moduleListResult = item.Module.map(
        (module: any) =>
          `${module.title} :  ${module.UserProgress.map(
            (item: any) =>
              `\n-${item.user.username} : ${item.status}${
                item?.score != null ? `(${item?.score}%)` : ""
              }`
          )}`
      ).join(" \n");
      const attendees = item.ClassSessionRecord.map(
        (session: any) => `${session.user.username} : ${session.status}`
      ).join(" \n");
      const departments = item?.CourseOnDepartment.map(
        (item: any) => item?.Department?.title
      ).join(" \n");

      exportList.push({
        Title: item.title || "",
        Department: departments,
        Credit: item.credit || "",
        Instructor:
          (item.courseInstructor && item.courseInstructor.username) || "",
        "Module list": moduleList,
        "Module list result": moduleListResult,
        Attendees: attendees,
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(exportList);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    worksheet["!cols"] = [
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 50 },
      { wch: 50 },
      { wch: 50 },
    ];

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

    XLSX.writeFile(workbook, `${filter}_Course_${dateSuffix}.xlsx`);
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
            {courseList.length == 0 ? (
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
