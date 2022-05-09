import { Kwh } from '.'
import { ICalculadora } from '../interfaces/props'
import { NumberHelpers } from '../Util'

export default class Pis {
  private valorPadrao: number = 0.65
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
  get = () => {
    return NumberHelpers.parseFloatOrDefault(
      this.dadosACalcular.valorPISPASEP,
      this.valorPadrao,
    )
  }
}
