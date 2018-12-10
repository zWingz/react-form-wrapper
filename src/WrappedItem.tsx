import * as React from 'react'
import { FormItemWrapperOpt } from '.'
interface WrappedItemProp {
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

export default React.memo<WrappedItemProp>(function WrappedItem(
  p: WrappedItemProp
) {
  const { element, stateKey, wrapperProp, val, onChange } = p
  const props = Object.assign({}, wrapperProp)
  const { valuePropName = 'value', eventTrigger = 'onChange' } = props
  if (element.props[eventTrigger]) {
    props.originOnChange = element.props[eventTrigger]
  }
  const valueProp = {
    [valuePropName]: getValue(val, element)
  }
  const changeProp = {
    [eventTrigger]: e => {
      const { getValueFromEvent } = props
      let value = ''
      if (getValueFromEvent) {
        value = getValueFromEvent(e)
      } else if (e && e.target) {
        value = e.target[props.valuePropName || 'value']
      } else {
        value = e
      }
      onChange(stateKey, value)
      if (props.originOnChange) {
        props.originOnChange(e)
      }
    }
  }
  return <element.type {...element.props} {...valueProp} {...changeProp} />
})
