export default class NumberHelpers {
  public static parseFloatOrDefault = (value: any, valorPadrao: any) => {
    if (value !== 0 && value !== '' && !Number.isNaN(Number(value)))
      return parseFloat(value)
    return valorPadrao
  }
}
