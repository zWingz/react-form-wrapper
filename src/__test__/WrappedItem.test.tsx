import * as React from 'react'
import { shallow, mount } from 'enzyme'
import WrappedItem, { WrappedItemProp } from '../WrappedItem'

function getCom(element: JSX.Element, opt: Partial<WrappedItemProp>) {
  return <WrappedItem element={element} {...opt as WrappedItemProp} />
}
describe('test base use', () => {
  it('render input', () => {
    const val = 'value'
    const onChange = jest.fn()
    const stateKey = 'test'
    const wrapper = shallow(
      getCom(<input />, {
        stateKey,
        val,
        onChange
      })
    )
    const input = wrapper.find('input')
    expect(input).toHaveLength(1)
    expect(input.props().value).toBe(val)
    expect(onChange).toBeCalledTimes(0)
    input.simulate('change', 'change value')
    expect(onChange).toBeCalledTimes(1)
    expect(onChange.mock.calls[0]).toEqual([stateKey, 'change value'])
  })
})

describe('test value props', () => {
  it('input/textarea value should not be undefinedm and defaultValue is empty-str', () => {
    let wrapper = shallow(getCom(<input />, {}))
    const input = wrapper.find('input')
    expect(input.props().value).toBe('')
    wrapper = shallow(getCom(<textarea />, {}))
    const textarea = wrapper.find('textarea')
    expect(textarea.props().value).toBe('')
  })
  it('custom value prop', () => {
    const Test = function(p) {
      return <div>{p.customValueProp}</div>
    }
    const val = 'test'
    let wrapper = mount(
      getCom(<Test />, {
        val,
        wrapperProp: {
          valuePropName: 'customValueProp'
        }
      })
    )
    const inner = wrapper.find(Test)
    expect(inner.props().customValueProp).toBe(val)
    expect(inner.find('div').text()).toBe(val)
  })
})

describe('test onChange props', () => {
  describe('get val from e.target', () => {
    it('get value from target[valuePropName]', () => {
      const customEvent = {
        target: {
          checked: 1000
        }
      }
      const onChange = jest.fn()
      class Test extends React.PureComponent<any> {
        onChange = () => {
          this.props.onChange(customEvent)
        }
        render() {
          return <div />
        }
      }
      const wrapper = mount(
        getCom(<Test />, {
          stateKey: 'key',
          onChange,
          wrapperProp: {
            valuePropName: 'checked'
          }
        })
      )
      const ele = wrapper.find(Test).instance() as Test
      ele.onChange()
      expect(onChange).toBeCalledWith('key', customEvent.target.checked)
    })
    it('get val from target.value', () => {
      const customEvent = {
        target: {
          value: 1000
        }
      }
      const onChange = jest.fn()
      class Test extends React.PureComponent<any> {
        onChange = () => {
          this.props.onChange(customEvent)
        }
        render() {
          return <div />
        }
      }
      const wrapper = mount(
        getCom(<Test />, {
          stateKey: 'key',
          onChange
        })
      )
      const ele = wrapper.find(Test).instance() as Test
      ele.onChange()
      expect(onChange).toBeCalledWith('key', customEvent.target.value)
    })
  })
  it('get val from customEvent', () => {
    const customEvent = {
      custom: 10000
    }
    const getValueFromEvent = jest.fn(e => e.custom)
    const onChange = jest.fn()
    class Test extends React.PureComponent<any> {
      onChange = () => {
        this.props.onChange(customEvent)
      }
      render() {
        return <div />
      }
    }
    const wrapper = mount(
      getCom(<Test />, {
        stateKey: 'key',
        onChange,
        wrapperProp: {
          getValueFromEvent
        }
      })
    )
    const ele = wrapper.find(Test).instance() as Test
    ele.onChange()
    expect(getValueFromEvent).toBeCalledTimes(1)
    expect(getValueFromEvent).toBeCalledWith(customEvent)
    expect(onChange).toBeCalledWith('key', customEvent.custom)
  })
  it('get val from origin event', () => {
    const customEvent = {
      custom: 10000
    }
    class Test extends React.PureComponent<any> {
      onChange = () => {
        this.props.onChange(customEvent)
      }
      render() {
        return <div />
      }
    }
    const onChange = jest.fn()
    const wrapper = mount(
      getCom(<Test />, {
        stateKey: 'key',
        onChange
      })
    )
    const ele = wrapper.find(Test).instance() as Test
    ele.onChange()
    expect(onChange).toBeCalledWith('key', customEvent)
  })
})

describe('test eventTrigger', () => {
  it('set a eventTrigger', () => {
    const customEvent = 'any ret val'
    const onChange = jest.fn()
    class Test extends React.PureComponent<any> {
      onChange = () => {
        this.props.onCustomTrigger(customEvent)
      }
      render() {
        return <div />
      }
    }
    const wrapper = mount(
      getCom(<Test />, {
        onChange,
        stateKey: 'key',
        wrapperProp: {
          eventTrigger: 'onCustomTrigger'
        }
      })
    )
    const ins = wrapper.find(Test).instance() as Test
    ins.onChange()
    expect(onChange).toBeCalledTimes(1)
    expect(onChange).toBeCalledWith('key', customEvent)
  })
})

describe('test originChange', () => {
  it('should trigger originChange', () => {
    const onChange = jest.fn()
    const originChange = jest.fn()
    const wrapper = mount(
      getCom(<input onChange={originChange} />, {
        onChange,
        stateKey: 'key'
      })
    )
    const ins = wrapper.find('input')
    const e = {
      target: {
        value: 'new value'
      }
    }
    ins.simulate('change', e)
    expect(onChange).toBeCalledTimes(1)
    expect(onChange).toBeCalledWith('key', 'new value')
    expect(originChange).toBeCalledTimes(1)
    expect(originChange.mock.calls[0][0]).toMatchObject(e)
  })
})
