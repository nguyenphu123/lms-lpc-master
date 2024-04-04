import { BasicNavbar } from "./_component/course-navbar";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <BasicNavbar userId={undefined}></BasicNavbar>
      </div>

      <main className=" pt-[80px] h-full"> {children}</main>
    </div>
  );
};

export default AuthLayout;
