import { ICalculadoraResponse, ICalculadora } from '../../../types'
import { Kwh } from '.'
import { Icms, Pis, Cofins, Bandeira, Iluminacao } from './taxas'

//Todo estudar uma forma melhor de fazer os calculos, está muito pesado
const Calculadora = (dadosACalcular: ICalculadora) => {
  let objCalcRespos = {} as ICalculadoraResponse
  const objKwh: Kwh = new Kwh(dadosACalcular)
  const objIcms: Icms = new Icms(dadosACalcular, objKwh)
  const objPis: Pis = new Pis(dadosACalcular, objKwh)
  const objCofins: Cofins = new Cofins(dadosACalcular, objKwh)
  const objIluminacao: Iluminacao = new Iluminacao(dadosACalcular, objKwh)
  const objBandeira: Bandeira = new Bandeira(
    dadosACalcular,
    objKwh,
    objIcms,
    objPis,
    objCofins,
  )

  //Totais
  objCalcRespos.quantidadeKwh = objKwh.getQuantidadeKw()
  objCalcRespos.valorConsumidoSemTaxa = objKwh.getValorConsumidoSemTaxa()
  objCalcRespos.valorConsumidoComTaxa = objKwh.getValorConsumidoComTaxa()
  objCalcRespos.valorTaxaIluminacao = objIluminacao.getIluminacao()

  //Taxas
  objCalcRespos.valorKwComTaxas = objKwh.getValorComTaxas()
  objCalcRespos.valorICMS = objIcms.getValor()
  objCalcRespos.valorPisPasep = objPis.getValor()
  objCalcRespos.valorCOFINS = objCofins.getValor()
  objCalcRespos.valorBandeira = objBandeira.getValorBandeiraComTaxa()

  objCalcRespos.valorTotal =
    objCalcRespos.valorConsumidoComTaxa +
    objCalcRespos.valorBandeira +
    objCalcRespos.valorTaxaIluminacao

  return objCalcRespos
}

export default Calculadora
