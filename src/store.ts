interface PlainObject extends Object {
  [key: string]: any
}

function isUndefined(obj) {
  return typeof obj === 'undefined'
}

export default class Store<T extends PlainObject = PlainObject> {
  private selfState: T
  private hadSetDefaultValue: string[] = []
  private events = {}
  private shouldSetDefault = (key, value, defaultValue) => {
    return (
      isUndefined(value) &&
      !isUndefined(defaultValue) &&
      !this.hadSetDefaultValue.includes(key)
    )
  }
  private emit(event, val?) {
    const listeners = this.events[event]
    if(listeners) {
      listeners.forEach(each => {
        each(val)
      })
    }
  }
  constructor(defaultState: T = {} as T) {
    this.selfState = defaultState
  }
  getState = () => {
    return {
      ...(this.selfState as object)
    }
  }
  public on(event, cb) {
    const listeners = this.events[event]
    if(listeners) {
      listeners.push(cb)
    } else {
      this.events[event] = [cb]
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
        if (index === path.length - 1) {
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

  public get(path: string, defaultValue) {
    const { hadSetDefaultValue, shouldSetDefault } = this
    let val
    if (path.includes('.')) {
      const keyPath = path.split('.')
      let field = this.selfState
      let tmp = field
      keyPath.forEach((each, index) => {
        if (index === path.length - 1) {
          if (shouldSetDefault(path, tmp[each], defaultValue)) {
            tmp[each] = defaultValue
            hadSetDefaultValue.push(path)
          }
          val = tmp[each]
        } else {
          if (typeof tmp[each] === 'undefined') {
            tmp[each] = {}
          }
          tmp = tmp[each]
        }
      })
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
