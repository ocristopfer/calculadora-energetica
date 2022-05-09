import { ICalculadora, ICalculadoraResponse } from '../interfaces/props'
import { Bandeira, Cofins, Icms, Kwh, Pis, Iluminacao } from './'

export default class Calculadora {
  private objCalcRespos: ICalculadoraResponse
  private objIcms: Icms
  private objPis: Pis
  private objCofins: Cofins
  private objKwh: Kwh
  private objBandeira: Bandeira
  private objIluminacao: Iluminacao
  constructor(dadosACalcular: ICalculadora) {
    this.objCalcRespos = {} as ICalculadoraResponse
    this.objKwh = new Kwh(dadosACalcular)
    this.objIcms = new Icms(dadosACalcular, this.objKwh)
    this.objPis = new Pis(dadosACalcular, this.objKwh)
    this.objCofins = new Cofins(dadosACalcular, this.objKwh)
    this.objIluminacao = new Iluminacao(dadosACalcular, this.objKwh)
    this.objBandeira = new Bandeira(
      dadosACalcular,
      this.objKwh,
      this.objIcms,
      this.objPis,
      this.objCofins,
    )
  }

  public getValores = () => {
    let objCalcRespos = this.objCalcRespos
    //Totais
    objCalcRespos.quantidadeKwh = this.objKwh.getQuantidadeKw()
    objCalcRespos.valorConsumidoSemTaxa = this.objKwh.getValorConsumidoSemTaxa()
    objCalcRespos.valorConsumidoComTaxa = this.objKwh.getValorConsumidoComTaxa()
    objCalcRespos.valorTaxaIluminacao = this.objIluminacao.get()

    //Taxas
    objCalcRespos.valorKwComTaxas = this.objKwh.getValorComTaxas()
    objCalcRespos.valorICMS = this.objIcms.getValor()
    objCalcRespos.valorPisPasep = this.objPis.getValor()
    objCalcRespos.valorCOFINS = this.objCofins.getValor()
    objCalcRespos.valorBandeira = this.objBandeira.getValorBandeiraComTaxa()

    objCalcRespos.valorTotal =
      objCalcRespos.valorConsumidoComTaxa +
      objCalcRespos.valorBandeira +
      objCalcRespos.valorTaxaIluminacao

    return objCalcRespos
  }
}
