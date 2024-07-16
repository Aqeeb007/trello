"use client";

import { forwardRef, KeyboardEventHandler } from "react";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";
import { FormErrors } from "./form-error";

interface FormTextareaProps {
  id: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  defaultValue?: string;
  onBlur?: () => void;
  onClick?: () => void;
  onKyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      id,
      label,
      placeholder,
      required,
      disabled,
      errors,
      className,
      defaultValue,
      onBlur,
      onClick,
      onKyDown,
    },
    ref,
  ) => {
    const { pending } = useFormStatus();
    return (
      <div className="space-y-2 w-full">
        <div className="w-full space-y-1">
          {label ? (
            <label
              htmlFor={id}
              className="text-xs font-semibold text-neutral-700"
            >
              {label}
            </label>
          ) : null}
          <Textarea
            onClick={onClick}
            onKeyDown={onKyDown}
            id={id}
            name={id}
            ref={ref}
            placeholder={placeholder}
            required={required}
            disabled={pending || disabled}
            className={cn(
              "resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm",
              className,
            )}
            defaultValue={defaultValue}
            onBlur={onBlur}
            aria-describedby={`${id}-error`}
          />
        </div>
        <FormErrors errors={errors} id={id} />
      </div>
    );
  },
);

FormTextarea.displayName = "FormTextarea";
