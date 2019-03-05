interface PlainObject extends Object {
  [key: string]: any
}

function isUndefined(obj) {
  return typeof obj === 'undefined'
}

export default class Store<T extends PlainObject = PlainObject> {
  private selfState: T
  private hadSetDefaultValue: string[] = []
  private shouldSetDefault = (key, value, defaultValue?) => {
    return (
      isUndefined(value) &&
      !isUndefined(defaultValue) &&
      !this.hadSetDefaultValue.includes(key)
    )
  }
  constructor(defaultState: T = {} as T) {
    this.selfState = Object.assign({}, defaultState)
    this.getState = this.getState.bind(this)
  }
  getState() {
    return {
      ...(this.selfState as object)
    }
  }
  public replace(state) {
    this.selfState = {
      ...(this.selfState as {}),
      ...state
    }
  }
  public set(path: string, value: any) {
    if (path.includes('.')) {
      const keyPath = path.split('.')
      let tmp = this.selfState
      keyPath.forEach((each, index) => {
        if (index === keyPath.length - 1) {
          tmp[each] = value
        } else {
          if (typeof tmp[each] === 'undefined') {
            tmp[each] = {}
          }
          tmp = tmp[each]
        }
      })
    } else {
      this.selfState[path] = value
    }
  }

  public get(path: string, defaultValue?) {
    const { hadSetDefaultValue, shouldSetDefault } = this
    let val
    if (path.includes('.')) {
      const keyPath = path.split('.')
      const { length } = keyPath
      let field = this.selfState
      let tmp = field
      for(let i = 0; i < length; i ++) {
        const each = keyPath[i]
        if (i === length - 1) {
          if (shouldSetDefault(path, tmp[each], defaultValue)) {
            tmp[each] = defaultValue
            hadSetDefaultValue.push(path)
          }
          val = tmp[each]
        } else {
          if (typeof tmp[each] === 'undefined') {
            if(isUndefined(defaultValue)) {
              return undefined
            }
            tmp[each] = {}
          }
          tmp = tmp[each]
        }
      }
    } else {
      if (shouldSetDefault(path, this.selfState[path], defaultValue)) {
        hadSetDefaultValue.push(path)
        this.selfState[path] = defaultValue
      }
      val = this.selfState[path]
    }
    return val
  }
}
