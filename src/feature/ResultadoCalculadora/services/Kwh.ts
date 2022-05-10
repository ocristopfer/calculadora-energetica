import { Cofins, Icms, Pis } from './taxas'
import { ICalculadora } from '../../../types'
import { NumberHelpers } from '../../../services/number'

export default class Kwh {
  private valorPadrao: number = 0.8022
  private dadosACalcular: ICalculadora
  private objIcms: Icms
  private objPis: Pis
  private objCofins: Cofins
  constructor(dadosACalcular: ICalculadora) {
    this.dadosACalcular = dadosACalcular
    this.objIcms = new Icms(dadosACalcular, this)
    this.objPis = new Pis(dadosACalcular, this)
    this.objCofins = new Cofins(dadosACalcular, this)
  }

  public getQuantidadeKw = () => {
    return (
      NumberHelpers.parseFloatOrDefault(this.dadosACalcular.medicaoAtual, 0) -
      NumberHelpers.parseFloatOrDefault(this.dadosACalcular.medicaoAnterior, 0)
    )
  }

  public getValorConsumidoSemTaxa = () => {
    return this.getQuantidadeKw() * this.getKwh()
  }

  public getValorConsumidoComTaxa = () => {
    return this.getQuantidadeKw() * this.getValorComTaxas()
  }

  public getValorComTaxas = () => {
    let valorKwComTaxas = 0
    valorKwComTaxas += this.getKwh()
    valorKwComTaxas += this.objIcms.getValorPorKw()
    valorKwComTaxas += this.objPis.getValorPorKw()
    valorKwComTaxas += this.objCofins.getValorPorKw()
    return valorKwComTaxas
  }

  public getKwh = () => {
    return NumberHelpers.parseFloatOrDefault(
      this.dadosACalcular.valorKwh,
      this.valorPadrao,
    )
  }
}
