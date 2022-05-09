import { Kwh } from '.'
import { ICalculadora } from '../interfaces/props'
import { NumberHelpers } from '../Util'

export default class Cofins {
  private valorPadrao: number = 3
  private dadosACalcular: ICalculadora
  private objKwh: Kwh
  constructor(dadosACalcular: ICalculadora, objKwh: Kwh) {
    this.dadosACalcular = dadosACalcular
    this.objKwh = objKwh
  }
  public getValor = () => {
    return (
      this.objKwh.getQuantidadeKw() * ((this.objKwh.get() * this.get()) / 100)
    )
  }
  public getValorPorKw = () => {
    return this.get() / 100
  }
  public get = () => {
    return NumberHelpers.parseFloatOrDefault(
      this.dadosACalcular.valorCOFINS,
      this.valorPadrao,
    )
  }
}
