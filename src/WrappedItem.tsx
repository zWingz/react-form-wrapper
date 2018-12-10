import * as React from 'react'
import { FormItemWrapperOpt } from '.'
export interface WrappedItemProp {
  element: JSX.Element
  stateKey: string
  val: any
  onChange: (key, value) => any
  wrapperProp: FormItemWrapperOpt & {
    originOnChange?: (e) => void;
  }
}

function typeOf(arg, type) {
  return typeof arg === type
}

function getValue(val: any, element: JSX.Element) {
  const { type } = element
  if(!(typeOf(val, 'undefined') && typeOf(type, 'string'))) {
    return val
  }
  return ['input', 'textarea'].includes(type as string) ? '' : val
}

export default class WrappedItem extends React.PureComponent<WrappedItemProp> {
  render() {
    const { element, stateKey, wrapperProp = {}, val, onChange } = this.props
    const wrappedOpt = Object.assign({}, wrapperProp)
    const { valuePropName = 'value', eventTrigger = 'onChange' } = wrappedOpt
    if (element.props[eventTrigger]) {
      wrappedOpt.originOnChange = element.props[eventTrigger]
    }
    const valueProp = {
      [valuePropName]: getValue(val, element)
    }
    const changeProp = {
      [eventTrigger]: e => {
        const { getValueFromEvent } = wrappedOpt
        let value = ''
        if (getValueFromEvent) {
          value = getValueFromEvent(e)
        } else if (e && e.target) {
          value = e.target[wrappedOpt.valuePropName || 'value']
        } else {
          value = e
        }
        onChange(stateKey, value)
        if (wrappedOpt.originOnChange) {
          wrappedOpt.originOnChange(e)
        }
      }
    }
    return <element.type {...element.props} {...valueProp} {...changeProp} />

  }
}
