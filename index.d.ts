import * as React from 'react'
declare module '@zzwing/react-form-wrapper' {
  type PlainObject = {
    [key: string]: any;
  }
  export interface FormItemWrapperOpt {
    valuePropName?: string
    getValueFromEvent?: (e: any) => any
    defaultValue?: any
    eventTrigger?: string
  }
  export interface FormItemWrapper {
    (key: string, props?: FormItemWrapperOpt): (
      element: JSX.Element
    ) => JSX.Element
  }
  export interface FormWrapperHocRef<T = any> {
    setWrapperState: (state: T) => void
    getState: () => T
  }
  export interface FormWrapperHocProp<T extends PlainObject = PlainObject> {
    formWrapper: {
      getState: () => T;
      setWrapperState: (state: { [P in keyof T]?: T[P] }) => void;
      itemWrapper: FormItemWrapper;
    }
  }
  type PropWithRef<P> = P & {
    getRef?: (arg: FormWrapperHocRef) => void;
  }
  export default function FormWrapperHoc<
    P = any,
    T extends PlainObject = PlainObject
  >(
    Wrapped: React.ComponentType<any>,
    initialState?: T
  ): React.ComponentClass<PropWithRef<P>>
}
