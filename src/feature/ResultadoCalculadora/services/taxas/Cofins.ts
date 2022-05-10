import { Kwh } from '../'
import { NumberHelpers } from '../../../../services/number'
import { ICalculadora } from '../../../../types'

export default class Cofins {
  private valorPadrao: number = 3
  private dadosACalcular: ICalculadora
  private objKwh: Kwh
  constructor(dadosACalcular: ICalculadora, objKwh: Kwh) {
    this.dadosACalcular = dadosACalcular
    this.objKwh = objKwh
  }

  public getValorPorKw = () => {
    return this.getCofins() / 100
  }

  public getValor = () => {
    return (
      this.objKwh.getQuantidadeKw() *
      ((this.objKwh.getKwh() * this.getCofins()) / 100)
    )
  }

  public getCofins = () => {
    return NumberHelpers.parseFloatOrDefault(
      this.dadosACalcular.valorCOFINS,
      this.valorPadrao,
    )
  }
}
