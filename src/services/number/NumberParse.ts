export default class NumberHelpers {
  public static parseFloatOrDefault = (objToParse: any, objDefault: any) => {
    if (
      objToParse !== 0 &&
      objToParse !== '' &&
      !Number.isNaN(Number(objToParse))
    )
      return parseFloat(objToParse)
    return objDefault
  }
}
