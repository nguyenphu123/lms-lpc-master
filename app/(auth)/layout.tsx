import { ModeToggle } from "@/components/ui/theme-button";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
     

      <main className=" pt-[80px] h-full"> {children}</main>
    </div>
  );
};

export default AuthLayout;
