import { ComponentProps, ElementType } from "react";

export type IconProps<T extends ElementType> = ComponentProps<T> & {
  className?: string;
};