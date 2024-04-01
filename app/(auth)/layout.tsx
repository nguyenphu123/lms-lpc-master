import { BasicNavbar } from "./_component/course-navbar";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center">
      <BasicNavbar userId={undefined}></BasicNavbar>
      {children}
    </div>
  );
};

export default AuthLayout;
