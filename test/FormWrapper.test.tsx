import * as React from 'react'
import { mount } from 'enzyme'
import FormWrapper, { FormWrapperHocProp } from '../src'

describe('test form wrapper', () => {
  const originOnChange = jest.fn()
  const getRef = jest.fn()
  const BaseTest = FormWrapper(class Wrapped extends React.PureComponent<FormWrapperHocProp> {
    render() {
      const {formWrapper} = this.props
      const { itemWrapper } = formWrapper
      const Input = itemWrapper('name')(<input onChange={originOnChange}/>)
      return <>
        {Input}
      </>
    }
  })
  const wrapper = mount(<BaseTest getRef={getRef}/>)
  const ins = wrapper.instance() as any
  it('input change should update name', () => {
    const input = wrapper.find('input')
    const newValue = 'input new value'
    input.simulate('change', {
      target: {
        value: newValue
      }
    })
    expect(wrapper.find('input').props().value).toEqual(newValue)
    expect(ins.store.get('name')).toEqual(newValue)
  })
  it('input originOnChange should be called', () => {
    expect(originOnChange).toBeCalledTimes(1)
  })
  it('getRef should return setWrapperState&getState', () => {
    expect(getRef).toBeCalledTimes(1)
    expect(getRef).toBeCalledWith({
      setWrapperState: ins.setWrapperState,
      getState: ins.store.getState
    })
  })
  it('setWrapperState should like React.setState', (done) => {
    const newState = {
      name: 'zhengzwing',
      nickName: 'zwing'
    }
    const cb = jest.fn()
    ins.setWrapperState(newState, cb)
    setTimeout(() => {
      expect(cb).toBeCalledTimes(1)
      expect(ins.store.getState()).toMatchObject(newState)
      wrapper.update()
      // console.log(wrapper.find('input').props())
      expect(wrapper.find('input').props().value).toEqual(newState.name)
      done()
    }, 250)
  })
})
