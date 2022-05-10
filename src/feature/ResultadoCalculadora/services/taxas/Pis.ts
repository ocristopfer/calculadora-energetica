import { NumberHelpers } from '../../../../services/number'
import { ICalculadora } from '../../../../types'
import Kwh from '../Kwh'

export default class Pis {
  private valorPadrao: number = 0.65
  private dadosACalcular: ICalculadora
  private objKwh: Kwh
  constructor(dadosACalcular: ICalculadora, objKwh: Kwh) {
    this.dadosACalcular = dadosACalcular
    this.objKwh = objKwh
  }

  public getValorPorKw = () => {
    return this.getPis() / 100
  }

  public getValor = () => {
    return (
      this.objKwh.getQuantidadeKw() *
      ((this.objKwh.getKwh() * this.getPis()) / 100)
    )
  }

  private getPis = () => {
    return NumberHelpers.parseFloatOrDefault(
      this.dadosACalcular.valorPISPASEP,
      this.valorPadrao,
    )
  }
}
