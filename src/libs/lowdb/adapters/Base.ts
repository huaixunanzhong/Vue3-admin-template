import stringify from './_stringify'

class Base {
  source: any
  defaultValue: any
  serialize: any
  deserialize: any
  constructor(
    source:any,
    { defaultValue = {}, serialize = stringify, deserialize = JSON.parse } = {}
  ) {
    this.source = source
    this.defaultValue = defaultValue
    this.serialize = serialize
    this.deserialize = deserialize
  }
}

export default Base
