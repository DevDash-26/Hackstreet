import * as React from 'react';
import { Controller, FormProvider, useFormContext } from 'react-hook-form';
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import { cn } from 'cn';
import { Label } from '@/components/ui/label';

const Form = FormProvider;

// React Hook Form's Controller knows the field name; FormField exposes that
// name to the label/control/message children through context so they can
// render the field's error state without prop drilling.
type FormFieldContextValue<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue<FieldValues, string> | null>(
  null,
);

function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(
  props: ControllerProps<TFieldValues, TName>,
) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const formContext = useFormContext();
  if (fieldContext === null) {
    throw new Error('useFormField must be used within a <FormField>');
  }
  const fieldState = formContext.getFieldState(fieldContext.name, formContext.formState);
  const id = React.useId();
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    invalid: fieldState.invalid,
    error: fieldState.error,
  };
}

function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="form-item" className={cn('grid gap-2', className)} {...props} />;
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  const { invalid, formItemId } = useFormField();
  return (
    <Label
      data-slot="form-label"
      data-invalid={invalid || undefined}
      htmlFor={formItemId}
      className={cn('data-[invalid=true]:text-destructive', className)}
      {...props}
    />
  );
}

function FormControl<
  Props extends {
    children?: React.ReactNode;
    id?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
  },
>({ children, ...props }: Props) {
  const { invalid, formItemId, formDescriptionId, formMessageId } = useFormField();

  if (!React.isValidElement(children)) {
    return null;
  }

  // The form control must be the input element itself (not a wrapper) for the
  // label id/href and aria-describedby wiring to reach the real input. Clone
  // the child and inject the field-association attributes.
  return React.cloneElement(children, {
    ...props,
    id: formItemId,
    'aria-describedby': invalid ? `${formDescriptionId} ${formMessageId}` : formDescriptionId,
    'aria-invalid': invalid,
  });
}

function FormMessage({ className, children, ...props }: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField();
  const body = error !== undefined ? String(error.message ?? '') : children;

  if (body === undefined || body === null || body === '') {
    return null;
  }

  return (
    <p
      id={formMessageId}
      data-slot="form-message"
      className={cn('text-sm text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  );
}

export { Form, FormControl, FormField, FormItem, FormLabel, FormMessage };
