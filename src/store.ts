interface PlainObject {
  [key: string]: any
}

// function isUndefined(obj) {
//   return typeof obj === 'undefined'
// }

function isPlain(obj) {
  if (!obj || Object.prototype.toString.call(obj) !== '[object Object]') {
    return false
  }
  const prop = Object.getPrototypeOf(obj)
  return prop === null || prop === Object.prototype
}

export default class Store<T extends PlainObject = PlainObject> {
  private _selfState: T
  // private hadSetDefaultValue: string[] = []
  private _chain: PlainObject = {}
  // private shouldSetDefault = (key, value, defaultValue?) => {
  //   return (
  //     isUndefined(value) &&
  //     !isUndefined(defaultValue) &&
  //     this.hadSetDefaultValue.indexOf(key) === -1
  //   )
  // }
  private objectToChain(obj, prefix: string = '', track = {}) {
    const keys = Object.keys(obj)
    const ret = {}
    keys.forEach(each => {
      const value = obj[each]
      const chainKey = prefix ? `${prefix}.${each}` : each
      track[chainKey] = value
      if (isPlain(value)) {
        ret[each] = this.objectToChain(value, chainKey, track)
      } else {
        ret[each] = value
      }
    })
    return ret
  }
  constructor(defaultState: T = {} as T) {
    this._selfState = Object.assign({}, defaultState)
    this._chain = this.objectToChain(this._selfState)
    this.getState = this.getState.bind(this)
    this.set = this.set.bind(this)
    this.get = this.get.bind(this)
  }

  public getState() {
    return Object.assign({}, this._selfState)
  }

  public replace(state) {
    this._selfState = {
      ...this._selfState,
      ...state
    }
    const chain = {}
    this.objectToChain(this._selfState, '', chain)
    this._chain = chain
  }
  public set(path: string, value: any) {
    const { _chain, _selfState } = this
    let tmp = _selfState
    if (path.indexOf('.') !== -1) {
      const keyPath = path.split('.')
      if(path in _chain) {
        const parentKey = keyPath.slice(0, -1).join('.')
        _chain[parentKey][keyPath.pop()] = value
      } else {
        const deepMax = keyPath.length - 1
        keyPath.forEach((each, index) => {
          if (index === deepMax) {
            tmp[each] = value
          } else {
            if (typeof tmp[each] === 'undefined') {
              tmp[each] = {}
            }
            _chain[keyPath.slice(0, index + 1).join('.')] = tmp[each]
            tmp = tmp[each]
          }
        })
      }
    } else {
      tmp[path] = value
    }
    _chain[path] = value
  }

  public get(path: string, defaultValue?) {
    const { _chain: chain, set } = this
    // if (shouldSetDefault(path, val, defaultValue)) {
    //   set(path, defaultValue)
    //   hadSetDefaultValue.push(path)
    // } else
    if (!(path in chain)) {
      set(path, defaultValue)
    }
    return chain[path]

    // if (path.indexOf('.') !== -1) {
    //   const keyPath = path.split('.')
    //   const { length } = keyPath
    //   const deepMax = length - 1
    //   let tmp = this.selfState
    //   for (let i = 0; i < length; i++) {
    //     const each = keyPath[i]
    //     if (i === deepMax) {
    //       if (shouldSetDefault(path, tmp[each], defaultValue)) {
    //         tmp[each] = defaultValue
    //         hadSetDefaultValue.push(path)
    //       }
    //       val = tmp[each]
    //     } else {
    //       if (typeof tmp[each] === 'undefined') {
    //         if (isUndefined(defaultValue)) {
    //           return undefined
    //         }
    //         tmp[each] = {}
    //       }
    //       tmp = tmp[each]
    //     }
    //   }
    // } else {
    //   if (shouldSetDefault(path, this.selfState[path], defaultValue)) {
    //     hadSetDefaultValue.push(path)
    //     this.selfState[path] = defaultValue
    //   }
    //   val = this.selfState[path]
    // }
    // return val
  }
}
