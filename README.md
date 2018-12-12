# React-form-wrapper
[![CircleCI](https://circleci.com/gh/zWingz/react-form-wrapper/tree/master.svg?style=svg)](https://circleci.com/gh/zWingz/react-form-wrapper/tree/master)  [![codecov](https://codecov.io/gh/zWingz/react-form-wrapper/branch/master/graph/badge.svg)](https://codecov.io/gh/zWingz/react-form-wrapper)

[DEMO](http://zwing.site/react-form-wrapper/#/)
[![Edit react-form-wrapper demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/53z1rm56zl?autoresize=1)

## Base Usage

```typescript
FormWrapperHoc(WrappedComponent, defaultState)
```

`WrappedComponent` can get `formWrapper` from `this.props`

### FormWrapper props
| name | type | desc |
| ---- | ---- | ---- |
| itemWrapper | (element: JSX.Element, opt: FormItemWrapperOpt) => JSX.Element | used to wrap component |
| getState | () => state | used to getState from wrapper |
| setWrapperState | (state, callback) => void | use dto setState like React.setState |

### FormItemWrapperOpt

| name | type | desc | default |
| ---- | ---- | ---- | ------- |
| valuePropName | string | name for `value` prop | `value` |
| getValueFromEvent | (e: any) => any | change event to value | (e) => e.target\[valuePropName\]
| defaultValue | any | set defaultValue when `value` is `undefined` | `undefined` |
| eventTrigger | string | listening for `value` changed | `onChange` |

``` typescript

import * as React from 'react'
import FormWrapperHoc, {FormWrapperHocProp} from '@zzwing/react-form-wrapper'

class Form extends React.PureComponent<FormWrapperHocProp> {
  render() {
    const { itemWrapper, getState } = this.props.formWrapper
    // use itemWrapper to wrap sub-comp
    const Input = itemWrapper('valueKey')(<input />)
    const value = getState().valueKey
    return <>
      {Input}
      you can get value for {key}
    </>
  }
}
```



## Types

```typescript
type PlainObject = {
  [key: string]: any;
}

interface FormItemWrapperOpt {
  valuePropName?: string
  getValueFromEvent?: (e: any) => any
  defaultValue?: any
  eventTrigger?: string
}

 interface FormItemWrapper {
  (key: string, props?: FormItemWrapperOpt): (
    element: JSX.Element
  ) => JSX.Element
}

interface FormWrapperHocRef<T = any> {
  setWrapperState: (state: T) => void
  getState: () => T
}

type PropWithRef<P> = P & {
  getRef?: (arg: FormWrapperHocRef) => void;
}

function FormWrapperHoc<
    P = any,
    T extends PlainObject = PlainObject
  >(
    Wrapped: React.ComponentType<any>,
    initialState?: T
  ): React.ComponentClass<PropWithRef<P>>
}
```
