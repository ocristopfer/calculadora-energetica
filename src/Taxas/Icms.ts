import { Kwh } from '.'
import { ICalculadora } from '../interfaces/props'
import { NumberHelpers } from '../Util'

export default class Icms {
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
