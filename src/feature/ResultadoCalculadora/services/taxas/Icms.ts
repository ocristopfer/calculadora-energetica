import { NumberHelpers } from 'services/number'
import { ICalculadora } from 'types'
import Kwh from '../Kwh'

export default class Icms {
  private dadosACalcular: ICalculadora
  private objKwh: Kwh
  constructor(dadosACalcular: ICalculadora, objKwh: Kwh) {
    this.dadosACalcular = dadosACalcular
    this.objKwh = objKwh
  }

  public getValorPorKw = () => {
    return this.getIcms() / 100
  }

  public getValor = () => {
    return (
      this.objKwh.getQuantidadeKw() *
      ((this.objKwh.getKwh() * this.getIcms()) / 100)
    )
  }

  private getIcms = () => {
    if (
      NumberHelpers.parseFloatOrDefault(this.dadosACalcular.valorIMCS, 0) !== 0
    )
      return this.dadosACalcular.valorIMCS

    let quantidadeKwh = this.objKwh.getQuantidadeKw()

    if (quantidadeKwh < 50) return 0
    if (quantidadeKwh >= 51 && quantidadeKwh <= 300) return 18
    if (quantidadeKwh >= 301 && quantidadeKwh <= 450) return 31
    if (quantidadeKwh > 450) return 32
    return 0
  }
}
