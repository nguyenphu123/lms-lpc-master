import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Select: any = ({ options, ...props }: any) => {
  return (
    <select name="option">
      {options.length != 0 ? (
        options.map((item: any, index: any) => {
          <option key={item.id} value={item.id}>
            {item.title}
          </option>;
        })
      ) : (
        <></>
      )}
    </select>
  );
};
Select.displayName = "Select";

export { Select };
