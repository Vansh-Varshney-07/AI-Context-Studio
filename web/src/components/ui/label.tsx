"use client";

import * as React from "react";
import { cn } from "@shared/utils/cn";

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  function Label({ className, ...props }, ref) {
    return <label ref={ref} className={cn("label", className)} {...props} />;
  },
);

Label.displayName = "Label";

export { Label };