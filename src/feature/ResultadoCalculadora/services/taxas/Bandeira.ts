import { ICalculadora } from 'types'
import Kwh from '../Kwh'
import { Cofins, Icms, Pis } from '.'

export default class Bandeira {
  private dadosACalcular: ICalculadora
  private objIcms: Icms
  private objPis: Pis
  private objCofins: Cofins
  private objKwh: Kwh
  constructor(
    dadosACalcular: ICalculadora,
    objKwh: Kwh,
    objIcms: Icms,
    objPis: Pis,
    objCofins: Cofins,
  ) {
    this.dadosACalcular = dadosACalcular
    this.objIcms = objIcms
    this.objPis = objPis
    this.objCofins = objCofins
    this.objKwh = objKwh
  }

  public getValorBandeiraPorKw = () => {
    return this.getValorBandeira() / 100
  }

  public getValorBandeiraSemTaxa = () => {
    return (
      this.getValorBandeira() * Math.round(this.objKwh.getQuantidadeKw() / 100)
    )
  }

  public getValorBandeiraComTaxa = () => {
    let bandeiraComTaxa = 0
    bandeiraComTaxa += this.getValorBandeira()
    bandeiraComTaxa += this.objIcms.getValorPorKw()
    bandeiraComTaxa += this.objPis.getValorPorKw()
    bandeiraComTaxa += this.objCofins.getValorPorKw()
    return bandeiraComTaxa * Math.round(this.objKwh.getQuantidadeKw() / 100)
  }

  private getValorBandeira = () => {
    if (this.dadosACalcular.bandeira === 1) return 1.87
    if (this.dadosACalcular.bandeira === 2) return 3.97
    if (this.dadosACalcular.bandeira === 3) return 9.49
    if (this.dadosACalcular.bandeira === 4) return 14.2
    return 0
  }
}
