"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function CreatePage() {
  const formSchema = z.object({
    title: z.string().min(1, {
      message: "Title is required",
    }),
  });

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  // const [programList, setProgramList] = useState([]);
  const { isSubmitting, isValid } = form.formState;
  // useEffect(() => {
  //   const fetchProgram = async () => {
  //     const programs: any = await axios.get("/api/programs");
  //     // setProgramList(programs);
  //   };
  //   // call the function
  //   fetchProgram()
  //     // make sure to catch any error
  //     .catch(console.error);
  // }, [programList]);
  const onSubmitProgram = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/department", values);
      router.push(`/teacher/departments/${response.data.id}`);
      toast.success("Department created");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6 pt-60">
      <div>
        <>
          <h1 className="text-2xl">Name your permission</h1>
          <p className="text-sm text-slate-600">
            What would you like to name your permission? Don&apos;t worry, you
            can change this later.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitProgram)}
              className="space-y-8 mt-8"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permission title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. 'Create course permission'"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Department name?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-x-2">
                <Link href="/teacher/departments">
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={!isValid || isSubmitting}>
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </>
      </div>
    </div>
  );
}

export default CreatePage;
