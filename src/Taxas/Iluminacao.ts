import { Kwh } from '.'
import { ICalculadora } from '../interfaces/props'
import { NumberHelpers } from '../Util'

export default class Ilumincao {
  private dadosACalcular: ICalculadora
  private objKwh: Kwh
  constructor(dadosACalcular: ICalculadora, objKwh: Kwh) {
    this.dadosACalcular = dadosACalcular
    this.objKwh = objKwh
  }
  get = () => {
    if (
      NumberHelpers.parseFloatOrDefault(
        this.dadosACalcular.valorTaxaDeIluminacao,
        0,
      ) !== 0
    )
      return this.dadosACalcular.valorTaxaDeIluminacao

    let quantidadeKwh = this.objKwh.getQuantidadeKw()
    if (quantidadeKwh < 80) return 0
    if (quantidadeKwh >= 80 && quantidadeKwh < 100) return 6.55
    if (quantidadeKwh >= 100 && quantidadeKwh < 150) return 9.94
    if (quantidadeKwh >= 150 && quantidadeKwh < 300) return 12.9
    if (quantidadeKwh >= 300 && quantidadeKwh < 500) return 16.75
    if (quantidadeKwh >= 500 && quantidadeKwh < 750) return 20.75
    if (quantidadeKwh >= 750 && quantidadeKwh < 1000) return 24.03
    if (quantidadeKwh >= 100 && quantidadeKwh < 1500) return 26.2
    if (quantidadeKwh >= 1500) return 28.61
    return 0
  }
}
