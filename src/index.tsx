import * as React from 'react'
import Store from './store'
import WrappedpedItem from './Item'
function isUndefined(obj) {
  return typeof obj === 'undefined'
}
type PlainObject = {
  [key: string]: any
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
export default function FormWrapperHoc<P = any, T extends PlainObject = PlainObject>(
  Wrapped: React.ComponentType<any>,
  initialState: T = {} as T
): React.ComponentClass<PropWithRef<P>> {
  return class FormWrapped extends React.PureComponent<PropWithRef<P>, any> {

    store = new Store<T>(initialState)
    constructor(p) {
      super(p)
      this.store.on('changeDefault', () => {
        this.forceUpdate()
      })
    }

    setFields = (fields: object, needUpdate = false, callback?) => {
      // this.field = Object.assign({}, this.field, fields)
      this.store.replace(fields)
      needUpdate && this.forceUpdate(callback)
    }

    setWrapperState = (state: object) => {
      this.setFields(
        {
          ...state
        },
        true
      )
    }

    itemWrapper: FormItemWrapper = (key, opt = {}) => element => {
      const val = this.store.get(key, opt.defaultValue)
      return (
        <WrappedpedItem
          element={element}
          stateKey={key}
          val={val}
          wrapperProp={opt}
          onChange={this._onChange}
        />
      )
    }

    _onChange = (key, val) => {
      this.store.set(key, val)
      this.forceUpdate()
    }
    componentDidMount() {
      const { setWrapperState, props } = this
      const { getRef } = props
      getRef &&
        getRef({
          setWrapperState,
          getState: this.store.getState
        })
    }
    render() {
      const { itemWrapper, setWrapperState, store } = this
      return (
        <Wrapped
          {...this.props}
          formWrapper={{
            itemWrapper,
            setWrapperState,
            getState: store.getState
          }}
        />
      )
    }
  }
}
