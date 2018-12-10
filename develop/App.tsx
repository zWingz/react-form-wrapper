import React from 'react'
import { hot } from 'react-hot-loader'
import FormWrapper, { FormWrapperHocProp } from '../src'

declare const module: any

class Input extends React.PureComponent<any> {
  render() {
    const { value, onChange } = this.props
    return <input type='text' value={value} onChange={onChange}/>
  }
}

class Test extends React.PureComponent<FormWrapperHocProp, any, any> {
  render() {
    const { formWrapper } = this.props
    const { itemWrapper } = formWrapper
    const Input1 = itemWrapper('test', {
    })(<input type='text' name='test'/>)
    // const Input2 = itemWrapper('test2', {
    //   defaultValue: undefined
    // })(<Input />)
    const state = formWrapper.getState()
    return (
      <div>
        <div>
          {Input1}
          {state.test}
        </div>
        {/* <div>
          {Input2}
          {state.test2}
        </div> */}
      </div>
    )
  }
}

const T = FormWrapper(Test, {
})

const App = hot(module)(() => {
  return (
    <div>
      <div className='container' style={{ display: 'flex', flexWrap: 'wrap' }}>
        <T />
      </div>
    </div>
  )
})

export default App
